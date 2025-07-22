
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import type { User, Conversation, Message } from '@/lib/types';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { MessageView } from '@/components/message-view';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessageMenu } from '@/components/message-item';
import { ChatAttachmentModal } from '@/components/chats/ChatAttachmentModal';


export default function ConversationPage() {
  const params = useParams();
  const { toast } = useToast();

  // Data state
  const [conversation, setConversation] = useState<Conversation | null | undefined>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);

  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  
  // Context Menu State
  const [menuState, setMenuState] = useState<{
    message: Message | null;
    position: { top: number; left: number } | null;
  }>({ message: null, position: null });
  
  const viewportRef = useRef<HTMLDivElement>(null);

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
    setIsAttachmentModalOpen(false);

    // Simulate network delay and auto-reply
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'delivered'} : m));
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === mediaMessage.id ? {...m, status: 'read'} : m));
        }, 1000);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser || !conversation) return;

    setIsSending(true);

    const sentMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
    };

    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
    
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
             setIsSending(false);
        }, 1000);

    }, 500);
  };
  
  // --- Context Menu Logic ---
  const handleOpenMenu = (messageId: string, rect: DOMRect) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !viewportRef.current) return;

    const viewportRect = viewportRef.current.getBoundingClientRect();
    const top = rect.bottom + 8; // Position below the message
    const left = Math.max(8, Math.min(rect.left, viewportRect.width - 200)); // Keep within bounds

    setMenuState({ message, position: { top, left } });
  };

  const handleCloseMenu = () => {
    setMenuState({ message: null, position: null });
  };
  
  const handleReply = (message: Message) => {
    console.log('Replying to:', message.text);
    toast({ title: 'Функция "Ответить" в разработке' });
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Скопировано!', description: 'Текст сообщения скопирован в буфер обмена.' });
  };
  const handleEdit = (message: Message) => {
    console.log('Editing:', message.text);
    toast({ title: 'Функция "Изменить" в разработке' });
  };
  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    toast({ title: 'Сообщение удалено', variant: 'destructive' });
  };


  if (conversation === null || currentUser === null) {
    return <FullScreenLoader text="Загрузка чата..." />;
  }

  if (conversation === undefined) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <MessageView
            messages={messages}
            currentUser={currentUser}
            otherParticipant={otherParticipant!}
            onOpenMenu={handleOpenMenu}
            viewportRef={viewportRef}
        />
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 pr-2">
            <Button variant="ghost" size="icon" className="shrink-0 group" onClick={() => setIsAttachmentModalOpen(true)}>
                <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <Textarea
                placeholder="Сообщение..."
                value={newMessage}
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
            <div className="w-px h-6 bg-border mx-1"></div>
            <Button
                size="icon"
                className="shrink-0"
                onClick={handleSendMessage}
                disabled={isSending || newMessage.trim() === ''}
            >
                <Send className="h-5 w-5" />
            </Button>
        </div>
      </div>
      
      <ChatMessageMenu
        message={menuState.message}
        isSentByCurrentUser={menuState.message?.senderId === currentUser.id}
        position={menuState.position}
        onReply={handleReply}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={handleCloseMenu}
      />

      <ChatAttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onMediaSend={handleMediaSend}
      />
    </div>
  );
}
