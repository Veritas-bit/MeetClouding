
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import type { User, Conversation, Message, ViewOptions } from '@/lib/types';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { MessageView } from '@/components/message-view';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, FileImage, Pencil, X, UserPlus, ShieldAlert, Video, MapPin, Share, Mic, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessageMenu } from '@/components/message-item';
// import { ChatAttachmentModal } from '@/components/chats/ChatAttachmentModal';
import { cn } from '@/lib/utils';
import { ReplyToView } from '@/components/chats/ReplyToView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from "@/components/ui/label"
import { Checkbox } from '@/components/ui/checkbox';
import { useLocationStore } from '@/lib/location-store';
import Link from 'next/link';
import Image from 'next/image';
import { useBlockedUsersStore } from '@/lib/blocked-users-store';
import { Separator } from '@/components/ui/separator';

const getDistance = (touches: React.TouchList) => {
    const [first, second] = [touches[0], touches[1]];
    return Math.sqrt(
        Math.pow(second.clientX - first.clientX, 2) +
        Math.pow(second.clientY - first.clientY, 2)
    );
};


const reportReasons = [
    { id: "wrong-gender", label: "Неверный пол" },
    { id: "spam", label: "Реклама" },
    { id: "scam", label: "Мошенничество" },
    { id: "begging", label: "Попрошайничество" },
    { id: "harassment", label: "Оскорбления и угрозы" },
    { id: "inappropriate-content", "label": "Нежелательный контент" },
]

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { blockUser, isUserBlocked } = useBlockedUsersStore();

  // Data state
  const [conversation, setConversation] = useState<Conversation | null | undefined>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);
  const { location, requestLocation } = useLocationStore();


  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<{src: string; viewOptions?: ViewOptions | null, messageId?: string} | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Context Menu State
  const [menuState, setMenuState] = useState<{
    message: Message | null;
    position: { top: number; left: number } | null;
  }>({ message: null, position: null });

  // Reply/Edit State
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editMessage, setEditMessage] = useState<Message | null>(null);

  // Alert Dialog State
  const [dialogState, setDialogState] = useState<'friendRequest' | 'report' | null>(null);
  const [selectedReportReasons, setSelectedReportReasons] = useState<string[]>([]);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Zoom and Pan state for image preview
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);
  const startDistance = useRef<number | null>(null);
  const startPosition = useRef({ x: 0, y: 0 });
  
  // --- Timer logic ---
  const [countdown, setCountdown] = useState<number | null>(null);
  const activeTimers = useRef<Map<string, number>>(new Map()); // <messageId, endTime>
  const previewImageRef = useRef(previewImage);
  previewImageRef.current = previewImage;

  // Function to remove a message by ID
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    activeTimers.current.delete(messageId);
    if (previewImageRef.current?.messageId === messageId) {
        setPreviewImage(null);
    }
  }, []);

  // Central timer loop
  useEffect(() => {
    const timerInterval = setInterval(() => {
        const now = Date.now();
        let isPreviewingTimedImage = false;
        
        activeTimers.current.forEach((endTime, messageId) => {
            const timeLeft = Math.round((endTime - now) / 1000);

            if (previewImageRef.current?.messageId === messageId) {
                setCountdown(timeLeft > 0 ? timeLeft : 0);
                isPreviewingTimedImage = true;
            }

            if (timeLeft <= 0) {
                removeMessage(messageId);
            }
        });

        if (!isPreviewingTimedImage) {
            setCountdown(null);
        }

    }, 1000);

    return () => clearInterval(timerInterval);
  }, [removeMessage]);


  // Initial data fetch
  useEffect(() => {
    async function fetchData() {
      const convId = params.id as string;
      const [convData, currentUserData] = await Promise.all([
        getConversationById(convId),
        getCurrentUser()
      ]);

      setConversation(convData);
      setCurrentUser(currentUserData as User);
      if (convData) {
        const otherP = convData.participants.find(p => p.id !== currentUserData?.id);
        if (otherP && isUserBlocked(otherP.id)) {
            toast({ title: 'Пользователь заблокирован', description: 'Вы не можете просматривать этот чат.', variant: 'destructive' });
            router.back();
            return;
        }
        setMessages(convData.messages);
      }
    }
    fetchData();
  }, [params.id, isUserBlocked, toast, router]);
  
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Check for sent image from gallery
  useEffect(() => {
    const pendingImageStr = sessionStorage.getItem('pending-image-to-send');
    if (pendingImageStr && currentUser) {
      try {
        const pendingImage = JSON.parse(pendingImageStr);
        if (pendingImage.src) {
          handleMediaSend(
            { src: pendingImage.src, type: 'image', viewOptions: pendingImage.viewOptions || null },
            'gallery'
          );
        }
      } catch (e) {
        handleMediaSend({ src: pendingImageStr, type: 'image' }, 'gallery');
      } finally {
        sessionStorage.removeItem('pending-image-to-send');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleMediaSend = (media: { src: string; type: 'image' | 'video', viewOptions?: ViewOptions | null }, source: 'camera' | 'gallery') => {
    if (!currentUser || !conversation) return;

    const mediaMessage: Message = {
      id: `msg-${Date.now()}`,
      text: media.type === 'image' ? 'Изображение' : 'Видео',
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
      [media.type]: media.src,
      source,
      viewOptions: media.viewOptions
    };

    setMessages(prev => [...prev, mediaMessage]);

    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'delivered'} : m));
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'read'} : m));
        }, 1000);
    }, 500);
  };
  
  const sendTextMessage = (text: string) => {
    if (!currentUser || !conversation) return;
      const sentMessage: Message = {
        id: `msg-${Date.now()}`,
        text: text,
        timestamp: Date.now(),
        senderId: currentUser.id,
        status: 'sent',
        replyTo: replyToMessage ? { 
          messageId: replyToMessage.id, 
          text: replyToMessage.text, 
          senderName: replyToMessage.senderId === currentUser.id ? currentUser.name : otherParticipant?.name || 'User' 
        } : undefined,
      };

      setMessages(prev => [...prev, sentMessage]);
      
      setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === sentMessage.id ? {...m, status: 'delivered'} : m));
          
          setTimeout(() => {
              setMessages(prev => prev.map(m => m.id === sentMessage.id ? {...m, status: 'read'} : m));
              if (otherParticipant) {
                  const replyMessage: Message = {
                      id: `msg-${Date.now() + 1}`,
                      text: `Это автоматический ответ на ваше сообщение: "${sentMessage.text}"`,
                      timestamp: Date.now(),
                      senderId: otherParticipant.id,
                      status: 'sent',
                  };
                  setMessages(prev => [...prev, replyMessage]);
              }
          }, 1000);

      }, 500);
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser || !conversation) return;
    setIsSending(true);

    if (editMessage) {
      setMessages(prev => prev.map(m => 
        m.id === editMessage.id ? { ...m, text: newMessage.trim(), edited: true } : m
      ));
      toast({ title: 'Сообщение изменено' });
      cancelEdit();
    } else {
        sendTextMessage(newMessage.trim());
    }
    
    setNewMessage('');
    setReplyToMessage(null);
    setIsSending(false);
  };

  const handleFriendRequest = () => {
    toast({ title: "Запрос отправлен", description: `Вы отправили запрос на добавление в друзья пользователю ${otherParticipant?.name}.` });
    setDialogState(null);
  }

  const handleReport = () => {
    if (selectedReportReasons.length === 0) {
        toast({ title: "Ошибка", description: "Пожалуйста, выберите причину жалобы.", variant: "destructive" });
        return;
    }
    toast({ title: "Жалоба отправлена", description: `Ваша жалоба на пользователя ${otherParticipant?.name} будет рассмотрена модераторами.`, variant: "destructive" });
    setDialogState(null);
    setSelectedReportReasons([]);
  }

  const handleBlockUser = () => {
    if (!otherParticipant) return;
    blockUser(otherParticipant);
    toast({ title: "Пользователь заблокирован", description: `${otherParticipant.name} добавлен в черный список.`, variant: "destructive" });
    setDialogState(null);
    router.back();
  }

  const handleReportReasonChange = (reasonId: string) => {
    setSelectedReportReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId) 
        : [...prev, reasonId]
    );
  };

  const cancelReply = () => {
    setReplyToMessage(null);
  };
  
  const cancelEdit = () => {
    setEditMessage(null);
    setNewMessage('');
  };
  
  const handleOpenMenu = (messageId: string, rect: DOMRect) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !viewportRef.current) return;

    const viewportRect = viewportRef.current.getBoundingClientRect();
    const tempMenu = document.createElement('div');
    tempMenu.className = 'fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md';
    tempMenu.style.visibility = 'hidden';
    tempMenu.innerHTML = `<button class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm">Reply</button>`;
    document.body.appendChild(tempMenu);
    const menuHeight = tempMenu.offsetHeight;
    document.body.removeChild(tempMenu);

    let top;
    const margin = 8; 

    if (rect.bottom + menuHeight > viewportRect.bottom) {
        top = rect.top - menuHeight - margin;
    } else {
        top = rect.bottom + margin;
    }

    top = Math.max(viewportRect.top, top);
    const left = Math.max(8, Math.min(rect.left, viewportRect.width - 200));

    setMenuState({ message, position: { top, left } });
  };


  const handleCloseMenu = () => {
    setMenuState({ message: null, position: null });
  };
  
  const handleReply = (message: Message) => {
    setEditMessage(null);
    setReplyToMessage(message);
    textareaRef.current?.focus();
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Скопировано!', description: 'Текст сообщения скопирован в буфер обмена.' });
  };
  const handleEdit = (message: Message) => {
    setReplyToMessage(null);
    setEditMessage(message);
    setNewMessage(message.text);
    textareaRef.current?.focus();
  };
  const handleDelete = (messageId: string) => {
    removeMessage(messageId);
    toast({ title: 'Сообщение удалено', variant: 'destructive' });
  };

  const handleSendLocation = () => {
    if (!currentUser) return;
    if (location) {
        const locationMessage: Message = {
            id: `msg-${Date.now()}`,
            text: 'Геопозиция',
            timestamp: Date.now(),
            senderId: currentUser.id,
            status: 'sent',
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            }
        };
        setMessages(prev => [...prev, locationMessage]);
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === locationMessage.id ? {...m, status: 'read'} : m));
        }, 500);

    } else {
        toast({ title: 'Не удалось определить геопозицию', description: 'Попробуйте еще раз позже.', variant: 'destructive'});
    }
  };
  
  const resetZoomAndPan = useCallback(() => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
  }, []);
  
  const handlePreviewImage = (message: Message) => {
      if (!message.image || !message.id) return;
      
      // Start timer on first view only
      if (message.viewOptions && !activeTimers.current.has(message.id)) {
        if (message.viewOptions === 'once') {
            // It will be removed on close
        } else {
           const durationMs = parseInt(message.viewOptions.replace('s', ''), 10) * 1000;
           activeTimers.current.set(message.id, Date.now() + durationMs);
        }
      }

      setPreviewImage({ src: message.image, viewOptions: message.viewOptions, messageId: message.id });
      resetZoomAndPan();
  };
  
  const handleClosePreview = useCallback(() => {
    if (previewImageRef.current?.viewOptions === 'once' && previewImageRef.current.messageId) {
        removeMessage(previewImageRef.current.messageId);
    }
    setPreviewImage(null);
    resetZoomAndPan();
    setCountdown(null);
  }, [removeMessage, resetZoomAndPan]);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
          startDistance.current = getDistance(e.touches);
      } else if (e.touches.length === 1) {
          startPosition.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
          
          const now = Date.now();
          const DOUBLE_TAP_DELAY = 300;
          if (now - lastTap.current < DOUBLE_TAP_DELAY) {
              e.preventDefault();
              if (scale > 1) {
                  resetZoomAndPan();
              } else {
                  setScale(2.5);
              }
          }
          lastTap.current = now;
      }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2 && startDistance.current !== null) {
          const newDistance = getDistance(e.touches);
          const newScale = Math.max(1, scale * (newDistance / startDistance.current));
          setScale(newScale);
          startDistance.current = newDistance;
      } else if (e.touches.length === 1 && scale > 1) {
          e.preventDefault();
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


  if (conversation === null || currentUser === null) {
    return <FullScreenLoader text="Загрузка чата..." />;
  }

  if (conversation === undefined) {
    notFound();
  }

  const isMessageEmpty = newMessage.trim() === '';
  const showIcons = !isInputFocused && isMessageEmpty;

  return (
    <div className="flex flex-col h-full">
      <div ref={viewportRef} className="flex-1 overflow-y-auto hide-scrollbar">
        <MessageView
            messages={messages}
            currentUser={currentUser}
            otherParticipant={otherParticipant!}
            onOpenMenu={handleOpenMenu}
            wishText={conversation.wishText}
            wishCategory={conversation.wishCategory}
            onPreviewImage={handlePreviewImage}
            onReply={handleReply}
        />
      </div>

      <div className="p-4 border-t bg-background flex-shrink-0">
        {replyToMessage && (
            <ReplyToView 
                message={replyToMessage}
                isSentByCurrentUser={replyToMessage.senderId === currentUser.id}
                onCancel={cancelReply}
            />
        )}
        {editMessage && (
            <div className="p-2 mb-2 rounded-md bg-muted flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <Pencil className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Редактирование</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}
        <div
          className={cn(
            "relative w-full rounded-lg p-px",
            "bg-gradient-to-r from-primary/30 to-secondary/30",
            "transition-all duration-300",
            "focus-within:from-primary/80 focus-within:to-secondary/80"
          )}
        >
          <div className="relative flex items-center bg-muted/50 rounded-[7px]">
            <div className={cn("flex items-center transition-all duration-300", showIcons ? "w-auto opacity-100" : "w-0 opacity-0")}>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent" onClick={() => setDialogState('report')}>
                    <ShieldAlert className="h-6 w-6 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent -ml-2" onClick={() => setDialogState('friendRequest')}>
                    <UserPlus className="h-6 w-6 text-muted-foreground" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent -ml-2">
                        <FileImage className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
                    <DropdownMenuItem>
                        <Link href={`/chats/${params.id}/gallery`} className="flex items-center w-full">
                            <Video className="mr-3 h-5 w-5" />
                            <span>Фото или видео</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSendLocation}>
                      <MapPin className="mr-3 h-5 w-5" />
                      <span>Геопозиция</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className={cn("w-px h-6 bg-border transition-all duration-300")}></div>
            </div>
              <Textarea
                  ref={textareaRef}
                  placeholder="Сообщение..."
                  value={newMessage}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                      }
                  }}
                  rows={1}
                  className="flex-1 max-h-24 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
              />
              <div className="w-px h-6 bg-border"></div>
              {isMessageEmpty ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 hover:bg-transparent active:bg-transparent"
                    onClick={() => { /* TODO: Implement voice message recording */ }}
                >
                    <Mic className="h-5 w-5 text-muted-foreground transition-colors" />
                </Button>
              ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 hover:bg-transparent active:bg-transparent"
                    onClick={handleSendMessage}
                    disabled={isSending}
                >
                    <Send className="h-5 w-5 text-primary transition-colors" />
                </Button>
              )}
          </div>
        </div>
      </div>
      
      <ChatMessageMenu
        message={menuState.message}
        isSentByCurrentUser={!!menuState.message && menuState.message.senderId === currentUser.id}
        position={menuState.position}
        onReply={handleReply}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={handleCloseMenu}
      />

        <AlertDialog open={dialogState === 'friendRequest'} onOpenChange={(open) => !open && setDialogState(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Добавить в друзья?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите отправить запрос на добавление в друзья пользователю {otherParticipant?.name}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!flex-row !justify-center gap-4">
                    <AlertDialogCancel className="max-w-[40%]" onClick={() => setDialogState(null)}>Нет</AlertDialogCancel>
                    <AlertDialogAction className="max-w-[40%]" onClick={handleFriendRequest}>Да</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={dialogState === 'report'} onOpenChange={(open) => { if (!open) { setDialogState(null); setSelectedReportReasons([]); } }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Пожаловаться на пользователя</DialogTitle>
                    <DialogDescription>
                        Выберите причину жалобы на пользователя {otherParticipant?.name}. Ваша жалоба будет рассмотрена модераторами.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 my-4">
                    {reportReasons.map(reason => (
                        <div key={reason.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={reason.id} 
                                checked={selectedReportReasons.includes(reason.id)} 
                                onCheckedChange={() => handleReportReasonChange(reason.id)}
                            />
                            <Label htmlFor={reason.id} className="font-normal">{reason.label}</Label>
                        </div>
                    ))}
                </div>
                <DialogFooter className="!flex-col sm:!flex-col sm:space-x-0 gap-2">
                     <Button type="submit" variant="destructive" className="w-full" onClick={handleReport} disabled={selectedReportReasons.length === 0}>Отправить жалобу</Button>
                     <Separator />
                     <Button type="button" variant="outline" className="w-full" onClick={handleBlockUser}>
                        <ShieldX className="mr-2 h-4 w-4" />
                        Заблокировать
                     </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={!!previewImage} onOpenChange={(open) => !open && handleClosePreview()}>
            <DialogContent 
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
                         {countdown !== null && (
                            <div className="absolute top-4 left-4 z-20 bg-black/50 text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-mono">
                                {countdown}
                            </div>
                        )}
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
                                alt="Image preview"
                                fill
                                className="object-contain"
                                draggable={false}
                            />
                        </div>
                    </div>
               )}
                <button onClick={handleClosePreview} className="absolute top-4 right-4 z-10 p-2">
                    <X className="h-6 w-6 text-primary" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    