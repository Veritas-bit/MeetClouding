
'use client';

import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera, FileImage, Send, X, AlertTriangle, Zap, Circle, Square, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { GradientBorderCloudIcon } from '../icons/GradientBorderCloudIcon';

interface ChatAttachmentModalProps {
    onClose: () => void;
    onMediaSend: (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => void;
}

type MediaSource = 'camera' | 'gallery';

interface Media {
    src: string;
    type: 'image' | 'video';
    source: MediaSource;
}

export function ChatAttachmentModal({ onClose, onMediaSend }: ChatAttachmentModalProps) {
    const { toast } = useToast();
    const [activeView, setActiveView] = useState<'gallery' | 'photo'>('gallery');
    
    // Media state
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [galleryImages, setGalleryImages] = useState<Media[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Camera state
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
    const [isRecording, setIsRecording] = useState(false);
    
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    const clearRecordingTimer = useCallback(() => {
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    }, []);
    
    const handleClose = useCallback(() => {
        stopCamera();
        clearRecordingTimer();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setSelectedMedia(null);
        setHasCameraPermission(null);
        setIsRecording(false);
        onClose();
    }, [stopCamera, clearRecordingTimer, onClose]);

    const handleViewChange = (view: 'gallery' | 'photo') => {
        setActiveView(view);
        if (view === 'gallery' && videoRef.current?.srcObject) {
            stopCamera();
        }
    };
    
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const type = file.type.startsWith('video') ? 'video' : 'image';
                    const newMedia: Media = { 
                        src: event.target?.result as string,
                        type,
                        source: 'gallery'
                    };
                    setGalleryImages(prev => {
                        if (prev.some(p => p.src === newMedia.src)) return prev;
                        return [newMedia, ...prev];
                    });
                };
                reader.readAsDataURL(file);
            })
        }
        if(e.target) {
            e.target.value = "";
        }
    };

    const handleCapturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/png');
                stopCamera();
                setSelectedMedia({ src: dataUrl, type: 'image', source: 'camera' });
            }
        }
    };

    const handleStopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const handleStartRecording = useCallback(() => {
        if (videoRef.current?.srcObject) {
            setIsRecording(true);
            const stream = videoRef.current.srcObject as MediaStream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                clearRecordingTimer();
                setIsRecording(false);
                const blob = new Blob(chunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                setSelectedMedia({ src: videoUrl, type: 'video', source: 'camera' });
                stopCamera();
            };

            mediaRecorderRef.current.start();
            
            recordingTimerRef.current = setTimeout(() => {
                handleStopRecording();
                toast({
                    title: 'Запись остановлена',
                    description: 'Достигнут лимит записи в 2 минуты.',
                });
            }, 120000);
        }
    }, [clearRecordingTimer, handleStopRecording, stopCamera, toast]);
    
    useEffect(() => {
        const getCameraPermission = async () => {
            if (activeView === 'photo' && !selectedMedia) {
                setIsCameraLoading(true);
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setHasCameraPermission(true);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    toast({
                        variant: 'destructive',
                        title: 'Доступ к камере и микрофону запрещен',
                        description: 'Пожалуйста, разрешите доступ в настройках браузера.',
                    });
                } finally {
                    setIsCameraLoading(false);
                }
            }
        };

        getCameraPermission();
        
        return () => {
             if (videoRef.current?.srcObject) {
                stopCamera();
             }
             clearRecordingTimer();
        }
    }, [activeView, selectedMedia, stopCamera, toast, clearRecordingTimer]);
    
    const handleCancelPreview = () => {
        setSelectedMedia(null);
    };

    const renderContent = () => {
        if (selectedMedia) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full relative p-4 bg-black">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {selectedMedia.type === 'image' ? (
                            <Image src={selectedMedia.src} alt="Выбранное изображение" layout="fill" objectFit="contain" />
                        ) : (
                            <video src={selectedMedia.src} controls autoPlay loop className="max-w-full max-h-full" />
                        )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 z-10">
                        <Button variant="outline" onClick={handleCancelPreview}>Отмена</Button>
                        <Button onClick={() => onMediaSend({src: selectedMedia.src, type: selectedMedia.type}, selectedMedia.source)}>
                            <Send className="mr-2 h-4 w-4" />
                            Отправить
                        </Button>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="flex flex-col h-full w-full">
                {activeView === 'gallery' && (
                     <div className="flex flex-col p-4 h-full">
                        <div className="flex-grow p-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 m-[3%] overflow-hidden">
                            <div className="bg-black/50 rounded-[7px] h-full p-2 overflow-y-auto">
                                {galleryImages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                                        <p>Ваша галерея пуста.</p>
                                        <p className="text-sm">Загрузите фото или видео, чтобы они появились здесь.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                                        {galleryImages.map((media, index) => (
                                            <div key={index} className="relative aspect-square w-full cursor-pointer" onClick={() => setSelectedMedia(media)}>
                                                <Image src={media.src} alt={`Gallery item ${index}`} layout="fill" objectFit="cover" className="rounded" />
                                                {media.type === 'video' && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Circle className="h-8 w-8 text-white fill-white" /></div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex-shrink-0">
                            <Button variant="outline" className="w-full h-12 text-base" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Загрузить с устройства
                            </Button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileSelect} />
                        </div>
                    </div>
                )}


                {activeView === 'photo' && (
                     <div className="flex-grow mt-0 flex flex-col items-center justify-between p-4 gap-4">
                        <div className="w-full flex-grow relative flex items-center justify-center">
                            {isCameraLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20 rounded-lg">
                                   <GradientBorderCloudIcon className="h-8 w-8" />
                                   <p className="mt-2 text-muted-foreground">Запускаем камеру...</p>
                                </div>
                            )}
                            {hasCameraPermission === false && !isCameraLoading && (
                                 <Alert variant="destructive" className="m-4">
                                     <AlertTriangle className="h-4 w-4"/>
                                     <AlertTitle>Доступ к камере необходим</AlertTitle>
                                     <AlertDescription>
                                        Пожалуйста, разрешите доступ в настройках вашего браузера.
                                     </AlertDescription>
                                 </Alert>
                            )}
                            
                            <div className="relative w-full aspect-[3/4] max-w-full max-h-full bg-muted overflow-hidden rounded-lg">
                               <video 
                                    ref={videoRef} 
                                    className="w-full h-full object-cover transform -scale-x-100"
                                    autoPlay 
                                    muted 
                                    playsInline 
                               />
                               {isRecording && <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 animate-pulse" />}
                            </div>
                        </div>
                        
                        <div className="flex-shrink-0 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-4 text-sm font-medium text-white p-1 rounded-full bg-black/40">
                                <button 
                                    onClick={() => setCaptureMode('photo')}
                                    className={cn(
                                        "px-4 py-1 rounded-full transition-colors",
                                        captureMode === 'photo' ? 'bg-white text-black' : 'text-white'
                                    )}
                                    disabled={isRecording}
                                >
                                    Фото
                                </button>
                                 <button 
                                    onClick={() => setCaptureMode('video')}
                                    className={cn(
                                        "px-4 py-1 rounded-full transition-colors",
                                        captureMode === 'video' ? 'bg-white text-black' : 'text-white'
                                    )}
                                    disabled={isRecording}
                                >
                                    Видео
                                </button>
                            </div>
                            <Button 
                                size="lg" 
                                className={cn(
                                    "rounded-full w-16 h-16",
                                    isRecording && "bg-red-500 hover:bg-red-600"
                                )}
                                onClick={isRecording ? handleStopRecording : (captureMode === 'photo' ? handleCapturePhoto : handleStartRecording)}
                                disabled={hasCameraPermission !== true || isCameraLoading}
                                aria-label={isRecording ? "Остановить запись" : (captureMode === 'photo' ? 'Сделать фото' : 'Начать запись')}
                            >
                                {isRecording ? (
                                    <Square className="h-7 w-7 fill-current" />
                                ) : captureMode === 'photo' ? (
                                    <Zap className="h-8 w-8" />
                                ) : (
                                    <Circle className="h-8 w-8 text-red-500 fill-current" />
                                )}
                            </Button>
                        </div>

                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between p-2 border-b h-14">
               <div className="flex items-center justify-center flex-grow">
                  <div className="inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                      <Button 
                          variant={activeView === 'gallery' ? 'default' : 'ghost'} 
                          className="w-24"
                          onClick={() => handleViewChange('gallery')}
                          disabled={isRecording}
                      >
                          Галерея
                      </Button>
                      <Button 
                          variant={activeView === 'photo' ? 'default' : 'ghost'} 
                          className="w-24"
                          onClick={() => handleViewChange('photo')}
                          disabled={isRecording}
                      >
                          Фото
                      </Button>
                  </div>
               </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="absolute right-2">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Закрыть</span>
                </Button>
            </div>
            <div className="flex-grow relative overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
}
