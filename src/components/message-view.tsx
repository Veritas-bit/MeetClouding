
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
    // Scroll to the bottom when messages change.
    // Use a timeout to ensure the DOM has updated before scrolling.
    if (viewportRef.current) {
        setTimeout(() => {
            viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }, 0);
    }
  }, [messages]);

  if (!otherParticipant) return null;

  return (
    <>
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1" viewportProps={{ ref: viewportRef }}>
        <div className="p-4 space-y-6 pb-20">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} currentUser={currentUser} otherParticipant={otherParticipant} />
          ))}
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 left-0 right-0 p-4 border-t bg-background shrink-0">
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
