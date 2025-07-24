
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, Send, X, Trash2, Timer, EyeOff } from 'lucide-react';
import { useRef, type ChangeEvent, useState, type TouchEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ViewOptions } from '@/lib/types';


interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    hint: string;
}

const getDistance = (touches: React.TouchList) => {
    const [first, second] = [touches[0], touches[1]];
    return Math.sqrt(
        Math.pow(second.clientX - first.clientX, 2) +
        Math.pow(second.clientY - first.clientY, 2)
    );
};

// --- Send Options Menu ---
interface SendOptionsMenuProps {
  position: { top: number; left: number; width: number; } | null;
  onSelect: (option: ViewOptions) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

function SendOptionsMenu({ position, onSelect, onClose, containerRef }: SendOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (position) {
      // We listen on the container of the dialog content to avoid issues with other modals
      const container = containerRef.current;
      container?.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      const container = containerRef.current;
      container?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose, containerRef]);


  if (!position) return null;

  const options: { label: string, value: ViewOptions, icon: React.ElementType }[] = [
    { label: 'На 5 секунд', value: '5s', icon: Timer },
    { label: 'На 15 секунд', value: '15s', icon: Timer },
    { label: 'На 30 секунд', value: '30s', icon: Timer },
    { label: 'Один просмотр', value: 'once', icon: EyeOff },
  ];

  return (
    <div
      ref={menuRef}
      style={{ top: position.top - 8, left: position.left, width: position.width, transform: 'translateY(-100%)' }}
      className="absolute z-[100] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={(e) => {
             e.stopPropagation(); // Prevent the click from bubbling up to the dialog overlay
             onSelect(option.value);
             onClose();
          }}
          className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
        >
          <option.icon className="mr-2 h-4 w-4" />
          {option.label}
        </button>
      ))}
    </div>
  );
}


export default function GalleryPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    // Zoom and Pan state
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);
    const lastTap = useRef(0);
    const startDistance = useRef<number | null>(null);
    const startPosition = useRef({ x: 0, y: 0 });

    // Send options menu state
    const [sendMenuState, setSendMenuState] = useState<{ position: { top: number; left: number; width: number } | null }>({ position: null });
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const sendButtonRef = useRef<HTMLButtonElement>(null);
    const dialogContentRef = useRef<HTMLDivElement>(null);


    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const filePromises = Array.from(files).map(file => {
                return new Promise<GalleryImage>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target?.result) {
                            resolve({
                                id: `uploaded-${file.name}-${Date.now()}`,
                                src: e.target.result as string,
                                alt: file.name,
                                hint: 'uploaded photo'
                            });
                        } else {
                            reject(new Error("Failed to read file"));
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(newImages => {
                setImages(prevImages => [...newImages, ...prevImages]);
            }).catch(error => {
                console.error("Error reading files:", error);
            });
        }
    };
    
    const resetZoomAndPan = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const handleImageClick = (image: GalleryImage) => {
        setPreviewImage(image);
        resetZoomAndPan();
    };
    
    const handleClosePreview = useCallback(() => {
        setPreviewImage(null);
        resetZoomAndPan();
        setSendMenuState({ position: null }); // Ensure menu closes with dialog
    }, [resetZoomAndPan]);
    
    const handleDeleteImage = () => {
        if (!previewImage) return;
        setImages(prevImages => prevImages.filter(img => img.id !== previewImage.id));
        handleClosePreview();
        toast({
            title: "Изображение удалено",
            variant: "destructive",
        })
    };

    const handleSendImage = (viewOptions: ViewOptions | null = null) => {
        if (!previewImage) return;

        // Regular click handling, which now includes calls from the menu
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }

        const dataToSend = JSON.stringify({ src: previewImage.src, viewOptions });
        sessionStorage.setItem('pending-image-to-send', dataToSend);
        
        if (viewOptions) {
             const optionLabels: Record<ViewOptions, string> = {
                '5s': 'На 5 секунд',
                '15s': 'На 15 секунд',
                '30s': 'На 30 секунд',
                'once': 'Один просмотр',
            }
             toast({
                title: `Изображение будет отправлено`,
                description: `Режим: ${optionLabels[viewOptions]}`,
            });
        }
        
        router.back();
    };


    // --- Long press for send options ---
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        // Only react to primary mouse button or touch
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        
        // Clear any existing timer
        if (pressTimer.current) clearTimeout(pressTimer.current);
        
        // Start a new timer
        pressTimer.current = setTimeout(() => {
            if (sendButtonRef.current) {
                const rect = sendButtonRef.current.getBoundingClientRect();
                 const dialogRect = dialogContentRef.current?.getBoundingClientRect();
                 if (dialogRect) {
                     setSendMenuState({
                         position: {
                             top: rect.top - dialogRect.top, // position relative to dialog
                             left: rect.left - dialogRect.left,
                             width: rect.width,
                         },
                     });
                 }
            }
            pressTimer.current = null;
        }, 500); // 500ms for long press
    };

    const handlePointerUp = (isClick: boolean) => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
            if (isClick) {
                 handleSendImage(null);
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the default browser context menu
        e.preventDefault();
        // Clear the long press timer if it's running
        clearTimeout(pressTimer.current!);
         if (sendButtonRef.current) {
             const rect = sendButtonRef.current.getBoundingClientRect();
             const dialogRect = dialogContentRef.current?.getBoundingClientRect();
             if (dialogRect) {
                 setSendMenuState({
                     position: {
                         top: rect.top - dialogRect.top,
                         left: rect.left - dialogRect.left,
                         width: rect.width,
                     },
                 });
             }
         }
    };
    
    // --- Touch Events for Zoom and Pan ---
    
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) { // Pinch
             startDistance.current = getDistance(e.touches);
        } else if (e.touches.length === 1) { // Pan
            startPosition.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
            
            // Double tap
            const now = Date.now();
            const DOUBLE_TAP_DELAY = 300;
            if (now - lastTap.current < DOUBLE_TAP_DELAY) {
                e.preventDefault(); // prevent zoom
                if (scale > 1) {
                    resetZoomAndPan();
                } else {
                    setScale(2.5); // Or calculate fit-to-screen zoom
                }
            }
            lastTap.current = now;
        }
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2 && startDistance.current !== null) { // Pinch to zoom
            const newDistance = getDistance(e.touches);
            const newScale = Math.max(1, scale * (newDistance / startDistance.current));
            setScale(newScale);
            startDistance.current = newDistance;

        } else if (e.touches.length === 1 && scale > 1) { // Pan
            e.preventDefault(); // prevent page scroll
            const newX = e.touches[0].clientX - startPosition.current.x;
            const newY = e.touches[0].clientY - startPosition.current.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
       startDistance.current = null;
    };
    
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (previewImage) {
                e.preventDefault();
                const newScale = scale - e.deltaY * 0.01;
                setScale(Math.max(1, newScale));
            }
        };

        const dialogElement = document.querySelector('[role="dialog"]');
        dialogElement?.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            dialogElement?.removeEventListener('wheel', handleWheel);
        };
    }, [previewImage, scale]);

    return (
        <div className="px-[2%] pt-[2%] pb-4 h-full flex flex-col gap-4">
            <div className="flex-grow h-full w-full rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-4 overflow-y-auto hide-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative aspect-square w-full cursor-pointer" onClick={() => handleImageClick(image)}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="rounded-md object-cover"
                                data-ai-hint={image.hint}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 flex justify-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                />
                <Button className="w-full max-w-[50%]" size="lg" onClick={handleUploadClick}>
                    Загрузить фотографию
                </Button>
            </div>

            <Dialog open={!!previewImage} onOpenChange={(open) => !open && handleClosePreview()}>
                <DialogContent
                    ref={dialogContentRef}
                    className="h-svh w-screen max-w-full p-0 gap-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm border-none touch-none" 
                    hideCloseButton
                >
                   <DialogTitle className="sr-only">Предпросмотр изображения</DialogTitle>
                   {previewImage && (
                        <div 
                            className="relative w-full h-full flex-grow flex items-center justify-center overflow-hidden"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                             <div
                                ref={imageRef}
                                className="relative"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    touchAction: 'none'
                                }}
                             >
                                <Image
                                    src={previewImage.src}
                                    alt={previewImage.alt}
                                    fill
                                    className="object-contain"
                                    draggable={false}
                                />
                             </div>
                            
                        </div>
                   )}
                   <button onClick={handleClosePreview} className="absolute top-4 right-4 z-[110] p-2">
                        <X className="h-6 w-6 text-primary" />
                        <span className="sr-only">Close</span>
                    </button>
                    <DialogFooter className="!flex-row !justify-center gap-4 p-4 bg-background w-full flex-shrink-0">
                        <Button variant="destructive" className="w-full max-w-xs" onClick={handleDeleteImage}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                        </Button>
                        <Button 
                          ref={sendButtonRef}
                          onClick={() => handlePointerUp(true)}
                          onContextMenu={handleContextMenu}
                          onPointerDown={handlePointerDown}
                          onPointerUp={() => handlePointerUp(false)}
                          onPointerLeave={() => handlePointerUp(false)}
                          className="w-full max-w-xs"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Отправить
                        </Button>
                    </DialogFooter>
                    <SendOptionsMenu
                        containerRef={dialogContentRef}
                        position={sendMenuState.position}
                        onClose={() => setSendMenuState({ position: null })}
                        onSelect={handleSendImage}
                    />
                </DialogContent>
            </Dialog>

        </div>
    );
}
