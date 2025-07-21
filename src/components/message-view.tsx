
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from '@/components/message-item';
import { SendHorizonal, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChatAttachmentModal } from './chats/ChatAttachmentModal';

export function MessageView({ initialConversation, currentUser, className }: { initialConversation: Conversation; currentUser: User, className?: string }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
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
      source: source as any, // Cast for now
    };
    
    setMessages(prev => [...prev, message]);

    // Simulate receiving a reply
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


  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  if (!otherParticipant) return null;

  return (
    <>
    <div className={cn("flex flex-col flex-1", className)}>
      <ScrollArea className="flex-1" viewportProps={{ ref: viewportRef }}>
        <div className="p-4 space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} currentUser={currentUser} otherParticipant={otherParticipant} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background shrink-0">
        <form onSubmit={handleSendMessage} className="relative w-full">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Сообщение..."
            className="w-full pr-20 pl-12 py-3"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
           <Button type="button" variant="ghost" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setIsAttachmentModalOpen(true)}>
             <Camera className="h-5 w-5 text-muted-foreground" />
             <span className="sr-only">Открыть камеру</span>
           </Button>
          <Button type="submit" size="icon" variant="ghost" aria-label="Send Message" className="absolute right-3 top-1/2 -translate-y-1/2" disabled={!newMessage.trim()}>
            <SendHorizonal className="h-5 w-5 text-muted-foreground" />
          </Button>
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
