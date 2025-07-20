
"use client";

import React, { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, CheckCheck, Languages, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getTranslation } from '@/lib/actions';
import { useLanguageStore } from '@/lib/language-store';

function MessageStatus({ status }: { status: Message['status'] }) {
  if (status === 'read') {
    return <CheckCheck className="h-4 w-4 text-accent" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="h-4 w-4" />;
  }
  return <Check className="h-4 w-4" />;
}

function parseMessageContent(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex = /(@[a-zA-Z0-9_]+)/g;
  
    const parts = text.split(new RegExp(`(${urlRegex.source}|${mentionRegex.source})`, 'g'));
  
    return parts.map((part, index) => {
      if (!part) return null;
      if (part.match(urlRegex)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">{part}</a>;
      }
      if (part.match(mentionRegex)) {
        return <span key={index} className="text-accent font-semibold">{part}</span>;
      }
      return part;
    });
}

export function MessageItem({ message, currentUser, otherParticipant }: { message: Message; currentUser: User; otherParticipant: User }) {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(message.translation || null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language: targetLanguage } = useLanguageStore();

  const isSentByCurrentUser = message.senderId === currentUser.id;
  const sender = isSentByCurrentUser ? currentUser : otherParticipant;

  const handleTranslate = () => {
    if (showTranslation) {
        setShowTranslation(false);
        return;
    }

    if (translatedText) {
        setShowTranslation(true);
        return;
    }

    startTransition(async () => {
        // Simple language detection mock
        const sourceLanguage = message.text.match(/[\u0400-\u04FF]/) ? 'Russian' : 'English';
        
        const result = await getTranslation(message.text, sourceLanguage, targetLanguage);
        if (result.startsWith('Sorry')) {
            setError(result);
        } else {
            setTranslatedText(result);
            setShowTranslation(true);
        }
    });
  };

  const textToShow = showTranslation && translatedText ? translatedText : message.text;
  const messageColorClass = isSentByCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card border';

  return (
    <div className={cn('flex items-end space-x-3', isSentByCurrentUser ? 'justify-end' : '')}>
      {!isSentByCurrentUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={sender.avatarUrl} alt={sender.name} data-ai-hint="person portrait"/>
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn('max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col', messageColorClass)}>
        <div className="text-sm whitespace-pre-wrap break-words">
            {parseMessageContent(textToShow)}
            {showTranslation && <p className="text-xs opacity-70 mt-2 pt-2 border-t border-t-white/20">Original: {message.text}</p>}
        </div>
        <div className={cn("flex items-center gap-2 mt-2 self-end text-xs", isSentByCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
            {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/20" onClick={handleTranslate} disabled={isPending}>
                      <Languages className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showTranslation ? 'Show original' : `Translate to ${targetLanguage}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span>{format(new Date(message.timestamp), 'p')}</span>
            {isSentByCurrentUser && <MessageStatus status={message.status} />}
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    </div>
  );
}
