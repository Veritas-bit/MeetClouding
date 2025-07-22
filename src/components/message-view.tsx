
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem, ChatMessageMenu } from './message-item';
import { SendHorizonal, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChatAttachmentModal } from './chats/ChatAttachmentModal';

type ActiveMenu = {
  messageId: string;
  rect: DOMRect;
};

export function MessageView({ initialConversation, currentUser, className }: { initialConversation: Conversation; currentUser: User, className?: string }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);

  const otherParticipant = initialConversation.participants.find(p => p.id !== currentUser.id);

  const sendMessage = (text: string, media?: { src: string; type: 'image' | 'video' }, source?: 'camera' | 'gallery') => {
    if (text.trim() === '' && !media) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: text,
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
      image: media?.type === 'image' ? media.src : undefined,
      video: media?.type === 'video' ? media.src : undefined,
      source: source as any,
    };
    
    setMessages(prev => [...prev, message]);

    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now() + 1}`,
        text: 'This is an automated reply!',
        timestamp: Date.now() + 1000,
        senderId: otherParticipant!.id,
        status: 'delivered',
      };
      setMessages(prev => [...prev, reply]);
      toast({
        title: `New message from ${otherParticipant?.name}`,
        description: reply.text,
      });
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };
  
  const handleMediaSend = (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => {
    sendMessage('', media, source);
    setIsAttachmentModalOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Скопировано', description: 'Текст сообщения скопирован в буфер обмена.' });
    });
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    toast({ title: 'Сообщение удалено', variant: 'destructive' });
  };
  
  const handleEdit = (message: Message) => {
      // Mock implementation
      toast({ title: 'Редактирование', description: `Выбрано для редактирования: "${message.text}"` });
  };

  const handleReply = (message: Message) => {
      // Mock implementation
      toast({ title: 'Ответ', description: `Выбран ответ на: "${message.text}"` });
  };

  const handleOpenMenu = (messageId: string, rect: DOMRect) => {
    setActiveMenu({ messageId, rect });
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };

  const renderMenu = () => {
    if (!activeMenu) return null;

    const message = messages.find(m => m.id === activeMenu.messageId);
    if (!message) return null;

    const menuRect = { width: 180, height: 150 }; // Approximate menu size
    const containerRect = viewportRef.current?.getBoundingClientRect();

    if (!containerRect) return null;

    // Check if the message bottom is too close to the container bottom
    const spaceBelow = containerRect.bottom - activeMenu.rect.bottom;
    const isCloseToBottom = spaceBelow < menuRect.height + 20; // 20px buffer

    let top: number;
    if (isCloseToBottom) {
        // Position above the message bubble
        top = activeMenu.rect.top - menuRect.height;
    } else {
        // Position below the message bubble
        top = activeMenu.rect.top + activeMenu.rect.height;
    }
    
    const isSentByCurrentUser = message.senderId === currentUser.id;
    let left = isSentByCurrentUser ? (activeMenu.rect.left + activeMenu.rect.width - menuRect.width) : activeMenu.rect.left;

    // Clamp position within viewport
    top = Math.max(containerRect.top, Math.min(top, containerRect.bottom - menuRect.height));
    left = Math.max(8, Math.min(left, window.innerWidth - menuRect.width - 8));

    return (
        <div style={{ top: top, left: left }} className="fixed z-50">
            <ChatMessageMenu
                isSentByCurrentUser={isSentByCurrentUser}
                message={message}
                onReply={handleReply}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClose={handleCloseMenu}
            />
        </div>
    );
  };


  useEffect(() => {
    if (viewportRef.current) {
        setTimeout(() => {
            viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }, 0);
    }
  }, [messages]);

  if (!otherParticipant) return null;

  return (
    <>
      <div className={cn("fixed top-16 bottom-20 left-0 right-0", className)} onClick={handleCloseMenu}>
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                currentUser={currentUser} 
                otherParticipant={otherParticipant} 
                onDelete={handleDelete}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onReply={handleReply}
                onOpenMenu={handleOpenMenu}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {renderMenu()}

      <div className="fixed bottom-20 left-0 right-0 z-10">
          <div className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="relative w-full flex items-center">
                  <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Сообщение..."
                      className="w-full pl-12 pr-12 py-3"
                      rows={1}
                      onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                      }
                      }}
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex items-center">
                      <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-full w-10 hover:bg-transparent" 
                          onClick={() => setIsAttachmentModalOpen(true)}
                      >
                          <Camera className="h-5 w-5 text-muted-foreground" />
                          <span className="sr-only">Открыть камеру</span>
                      </Button>
                  </div>

                  <div className="absolute left-10 top-0 bottom-0 flex items-center">
                      <div className="h-6 w-px bg-border" />
                  </div>
                  
                  <div className="absolute right-10 top-0 bottom-0 flex items-center">
                      <div className="h-6 w-px bg-border" />
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                      <Button 
                          type="submit" 
                          size="icon" 
                          variant="ghost" 
                          aria-label="Send Message" 
                          className="h-full w-10 hover:bg-transparent"
                          disabled={!newMessage.trim()}
                      >
                          <SendHorizonal className="h-5 w-5 text-muted-foreground" />
                      </Button>
                  </div>
              </form>
          </div>
      </div>
      <ChatAttachmentModal 
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onMediaSend={handleMediaSend}
      />
    </>
  );
}
