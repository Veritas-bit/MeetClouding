
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from '@/components/message-item';
import { SendHorizonal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function MessageView({ initialConversation, currentUser, className }: { initialConversation: Conversation; currentUser: User, className?: string }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);

  const otherParticipant = initialConversation.participants.find(p => p.id !== currentUser.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate receiving a reply and show a notification
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

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  if (!otherParticipant) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      <ScrollArea className="flex-1" viewportProps={{ ref: viewportRef }}>
        <div className="p-4 space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} currentUser={currentUser} otherParticipant={otherParticipant} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" aria-label="Send Message" className="self-end" disabled={!newMessage.trim()}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
