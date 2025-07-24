
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, Send, X, Trash2 } from 'lucide-react';
import { useRef, type ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    hint: string;
}

export default function GalleryPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
    const router = useRouter();
    const { toast } = useToast();

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

    const handleImageClick = (image: GalleryImage) => {
        setPreviewImage(image);
    };
    
    const handleDeleteImage = () => {
        if (!previewImage) return;
        setImages(prevImages => prevImages.filter(img => img.id !== previewImage.id));
        setPreviewImage(null);
        toast({
            title: "Изображение удалено",
            variant: "destructive",
        })
    };

    const handleSendImage = () => {
        if (!previewImage) return;
        // Store image in session storage to be picked up by the chat page
        sessionStorage.setItem('pending-image-to-send', previewImage.src);
        router.back();
    };

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
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить фотографию
                </Button>
            </div>

            <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
                <DialogContent className="h-svh w-screen max-w-full p-0 gap-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm border-none" hideCloseButton>
                   <DialogTitle className="sr-only">Предпросмотр изображения</DialogTitle>
                   {previewImage && (
                        <div className="relative w-full h-full flex-grow">
                             <Image
                                src={previewImage.src}
                                alt={previewImage.alt}
                                fill
                                className="object-contain"
                            />
                            <DialogClose asChild>
                                <button className="absolute top-4 right-4 z-10 text-primary rounded-full bg-background/20 p-2 backdrop-blur-sm">
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </DialogClose>
                        </div>
                   )}
                    <DialogFooter className="!flex-row !justify-center gap-4 p-4 bg-background w-full flex-shrink-0">
                        <Button variant="destructive" className="w-full max-w-xs" onClick={handleDeleteImage}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                        </Button>
                        <Button onClick={handleSendImage} className="w-full max-w-xs">
                            <Send className="mr-2 h-4 w-4" />
                            Отправить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
