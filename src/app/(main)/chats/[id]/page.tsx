

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import type { User, Conversation, Message } from '@/lib/types';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { MessageView } from '@/components/message-view';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, FileImage, Pencil, X, UserPlus, ShieldAlert, Video, MapPin, Share } from 'lucide-react';
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

  // Data state
  const [conversation, setConversation] = useState<Conversation | null | undefined>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);
  const { location, requestLocation } = useLocationStore();


  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
  const footerRef = useRef<HTMLDivElement>(null);


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
        setMessages(convData.messages);
      }
    }
    fetchData();
  }, [params.id]);
  
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Check for sent image from gallery
  useEffect(() => {
    const pendingImage = sessionStorage.getItem('pending-image-to-send');
    if (pendingImage && currentUser) {
        handleMediaSend({ src: pendingImage, type: 'image' }, 'gallery');
        sessionStorage.removeItem('pending-image-to-send');
    }
  // We only want to run this once on mount, but need currentUser to be available
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleMediaSend = (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => {
    if (!currentUser || !conversation) return;

    const mediaMessage: Message = {
      id: `msg-${Date.now()}`,
      text: media.type === 'image' ? 'Изображение' : 'Видео',
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
      [media.type]: media.src, // image: '...' or video: '...'
      source,
    };

    setMessages(prev => [...prev, mediaMessage]);

    // Simulate network delay and auto-reply
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'delivered'} : m));
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'read'} : m));
        }, 1000);
    }, 500);
  };
  
  const sendTextMessage = (text: string) => {
    if (!currentUser || !conversation) return;

     // Logic for sending a new message
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
      
      // Simulate network delay and auto-reply
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
                      status: 'sent', // from other's perspective
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
      // Logic for editing a message
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
  
  // --- Context Menu Logic ---
  const handleOpenMenu = (messageId: string, rect: DOMRect) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !viewportRef.current || !footerRef.current) return;

    const viewportRect = viewportRef.current.getBoundingClientRect();
    const footerRect = footerRef.current.getBoundingClientRect();
    const availableHeight = footerRect.top - viewportRect.top;

    const menuHeight = 150; // Approximate height of the menu
    let top;

    // Position menu above if it overflows below
    if (rect.bottom + menuHeight > footerRect.top) {
        top = rect.top - menuHeight;
    } else {
        top = rect.bottom + 8;
    }

    // Ensure it doesn't go above the viewport
    top = Math.max(viewportRect.top, top);

    const left = Math.max(8, Math.min(rect.left, viewportRect.width - 200)); // Keep within bounds

    setMenuState({ message, position: { top, left } });
  };


  const handleCloseMenu = () => {
    setMenuState({ message: null, position: null });
  };
  
  const handleReply = (message: Message) => {
    setEditMessage(null); // Cancel edit if active
    setReplyToMessage(message);
    textareaRef.current?.focus();
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Скопировано!', description: 'Текст сообщения скопирован в буфер обмена.' });
  };
  const handleEdit = (message: Message) => {
    setReplyToMessage(null); // Cancel reply if active
    setEditMessage(message);
    setNewMessage(message.text);
    textareaRef.current?.focus();
  };
  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
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
        // Simulate sending
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === locationMessage.id ? {...m, status: 'read'} : m));
        }, 500);

    } else {
        toast({ title: 'Не удалось определить геопозицию', description: 'Попробуйте еще раз позже.', variant: 'destructive'});
    }
  }


  if (conversation === null || currentUser === null) {
    return <FullScreenLoader text="Загрузка чата..." />;
  }

  if (conversation === undefined) {
    notFound();
  }

  const isMessageEmpty = newMessage.trim() === '';
  const showIcons = !isInputFocused && newMessage === '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageView
            messages={messages}
            currentUser={currentUser}
            otherParticipant={otherParticipant!}
            onOpenMenu={handleOpenMenu}
            viewportRef={viewportRef}
            wishText={conversation.wishText}
            wishCategory={conversation.wishCategory}
            onPreviewImage={setPreviewImage}
        />
      </div>

      <div ref={footerRef} className="p-4 border-t bg-background flex-shrink-0">
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
            <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent" onClick={() => setDialogState('report')}>
                <ShieldAlert className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent" onClick={() => setDialogState('friendRequest')}>
                <UserPlus className="h-6 w-6 text-muted-foreground" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent">
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
              <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-transparent active:bg-transparent"
                  onClick={handleSendMessage}
                  disabled={isSending || isMessageEmpty}
              >
                  <Send className={cn("h-5 w-5 text-muted-foreground", !isMessageEmpty && "text-primary", "transition-colors")} />
              </Button>
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
                <DialogFooter className="!flex-row !justify-center gap-4">
                    <DialogClose asChild>
                        <Button type="button" variant="default" className="max-w-[40%]">Отмена</Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive" className="max-w-[50%]" onClick={handleReport} disabled={selectedReportReasons.length === 0}>Отправить жалобу</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
            <DialogContent className="h-screen w-screen max-w-full p-0 gap-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm border-none" hideCloseButton>
               <DialogTitle className="sr-only">Предпросмотр изображения</DialogTitle>
               {previewImage && (
                    <div className="relative w-full h-full flex-grow">
                        <Image
                            src={previewImage}
                            alt="Image preview"
                            fill
                            className="object-contain"
                        />
                        <DialogClose asChild>
                            <button className="absolute top-4 right-4 z-10 text-primary-foreground rounded-full bg-black/50 p-2">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                            </button>
                        </DialogClose>
                    </div>
               )}
            </DialogContent>
        </Dialog>
    </div>
  );
}
