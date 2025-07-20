
'use client';

import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, FileImage, Send, X, AlertTriangle, LoaderCircle, Zap, Circle, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ChatAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMediaSend: (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => void;
}

export function ChatAttachmentModal({ isOpen, onClose, onMediaSend }: ChatAttachmentModalProps) {
    const { toast } = useToast();
    const [activeView, setActiveView] = useState<'gallery' | 'photo'>('gallery');
    
    // Media state
    const [selectedMedia, setSelectedMedia] = useState<{ src: string; type: 'image' | 'video'; source: 'camera' | 'gallery' } | null>(null);
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
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const type = file.type.startsWith('video') ? 'video' : 'image';
                setSelectedMedia({ 
                    src: event.target?.result as string,
                    type,
                    source: 'gallery'
                });
            };
            reader.readAsDataURL(file);
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
        // State changes will be handled by the onstop event listener
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
            }, 120000); // 2 minutes
        }
    }, [clearRecordingTimer, handleStopRecording, stopCamera, toast]);

    
    useEffect(() => {
        const getCameraPermission = async () => {
            if (isOpen && activeView === 'photo' && !selectedMedia) {
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
    }, [isOpen, activeView, selectedMedia, stopCamera, toast, clearRecordingTimer]);
    
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
                    <div className="flex-grow mt-0 flex flex-col items-center justify-center p-4">
                        <div className="text-center text-muted-foreground mb-4">
                            <p>Выберите фото или видео из галереи</p>
                        </div>
                         <div className="mt-auto w-full">
                            <Button variant="outline" className="w-full h-12 text-base" onClick={() => fileInputRef.current?.click()}>
                                <FileImage className="mr-2 h-4 w-4" />
                                Выбрать с устройства
                            </Button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                        </div>
                    </div>
                )}

                {activeView === 'photo' && (
                     <div className="flex-grow mt-0 flex flex-col items-center justify-between p-4 gap-4">
                        <div className="w-full flex-grow relative flex items-center justify-center">
                            {isCameraLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20 rounded-lg">
                                   <LoaderCircle className="h-8 w-8 animate-spin" />
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-full w-full h-full max-h-screen p-0 m-0 gap-0" hideCloseButton>
                <DialogHeader className="sr-only">
                    <DialogTitle>Прикрепить медиа</DialogTitle>
                    <DialogDescription>
                        Выберите фото/видео из галереи или сделайте новое с помощью камеры.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col h-full bg-background">
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
            </DialogContent>
        </Dialog>
    );
}
