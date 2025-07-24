
"use client";

import React from 'react';
import type { User, Message } from '@/lib/types';
import { MessageItem } from './message-item';
import { Sparkles } from 'lucide-react';
import { WISH_CATEGORIES, WishCategoryKey } from '@/lib/categories';


interface MessageViewProps {
    messages: Message[];
    currentUser: User;
    otherParticipant: User;
    onOpenMenu: (messageId: string, rect: DOMRect) => void;
    wishText?: string;
    wishCategory?: WishCategoryKey;
    onPreviewImage: (src: string) => void;
    onReply: (message: Message) => void;
}

const WishHeader = ({ wishText, wishCategory }: { wishText: string, wishCategory?: WishCategoryKey }) => {
    const category = wishCategory ? WISH_CATEGORIES[wishCategory] : null;
    const Icon = category ? category.icon : Sparkles;

    return (
        <div className="w-full text-left mb-4">
            <div className="p-3 bg-muted border rounded-lg">
                <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Желание</p>
                        <p className="text-xs text-muted-foreground truncate">{wishText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function MessageView({ messages, currentUser, otherParticipant, onOpenMenu, wishText, wishCategory, onPreviewImage, onReply }: MessageViewProps) {
  
  if (!otherParticipant) return null;

  return (
    <div className="h-full">
      <div className="p-4 space-y-2 pb-4">
        {wishText && <WishHeader wishText={wishText} wishCategory={wishCategory} />}
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            currentUser={currentUser} 
            otherParticipant={otherParticipant} 
            onOpenMenu={onOpenMenu}
            onPreviewImage={onPreviewImage}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
}
