
"use client";

import React from 'react';
import type { User, Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './message-item';

interface MessageViewProps {
    messages: Message[];
    currentUser: User;
    otherParticipant: User;
    onOpenMenu: (messageId: string, rect: DOMRect) => void;
    viewportRef: React.RefObject<HTMLDivElement>;
}

export function MessageView({ messages, currentUser, otherParticipant, onOpenMenu, viewportRef }: MessageViewProps) {
  
  if (!otherParticipant) return null;

  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="p-4 space-y-6">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            currentUser={currentUser} 
            otherParticipant={otherParticipant} 
            onOpenMenu={onOpenMenu}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
