
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import type { User, Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './message-item';
import { MapPin } from 'lucide-react';

interface MessageViewProps {
    messages: Message[];
    currentUser: User;
    otherParticipant: User;
    onOpenMenu: (messageId: string, rect: DOMRect) => void;
    viewportRef: React.RefObject<HTMLDivElement>;
    wishText?: string;
}

const WishHeader = ({ wishText }: { wishText: string }) => {
  const router = useRouter();
  
  const handleGoToMap = () => {
    // This is a mock navigation. In a real app, you would pass coordinates.
    router.push('/map?fromChat=true');
  }

  return (
    <button onClick={handleGoToMap} className="w-full text-left mb-4">
      <div className="p-3 bg-muted border rounded-lg">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Желание</p>
            <p className="text-xs text-muted-foreground truncate">{wishText}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

export function MessageView({ messages, currentUser, otherParticipant, onOpenMenu, viewportRef, wishText }: MessageViewProps) {
  
  if (!otherParticipant) return null;

  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="p-4 space-y-6">
        {wishText && <WishHeader wishText={wishText} />}
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
