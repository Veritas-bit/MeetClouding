
"use client";

import React, { useState, useRef, useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, CheckCheck, Languages, Loader2, MessageSquareReply, Copy, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getTranslation } from '@/lib/actions';
import { useLanguageStore } from '@/lib/language-store';
import { useTranslation } from '@/hooks/use-translation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface MessageItemProps {
  message: Message;
  currentUser: User;
  otherParticipant: User;
  onDelete: (messageId: string) => void;
  onCopy: (text: string) => void;
  onEdit: (message: Message) => void;
  onReply: (message: Message) => void;
}

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
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline">{part}</a>;
      }
      if (part.match(mentionRegex)) {
        return <span key={index} className="text-accent font-semibold">{part}</span>;
      }
      return part;
    });
}

export function MessageItem({ message, currentUser, otherParticipant, onDelete, onCopy, onEdit, onReply }: MessageItemProps) {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(message.translation || null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language: targetLanguage } = useLanguageStore();
  const t = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(true);
                }}
                onDoubleClick={() => setIsMenuOpen(true)}
                className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col', 
                    'transition-colors active:brightness-75',
                    messageColorClass
                )}
            >
                <div className="text-sm whitespace-pre-wrap break-words">
                    {parseMessageContent(textToShow)}
                    {showTranslation && <p className="text-xs opacity-70 mt-2 pt-2 border-t border-t-white/20">{t('original')}: {message.text}</p>}
                </div>
                <div className={cn("flex items-center gap-2 mt-2 self-end text-xs", isSentByCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleTranslate(); }} disabled={isPending}>
                              <Languages className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{showTranslation ? t('showOriginal') : `${t('translateTo')} ${targetLanguage}`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <span>{format(new Date(message.timestamp), 'p')}</span>
                    {isSentByCurrentUser && <MessageStatus status={message.status} />}
                </div>
                {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isSentByCurrentUser ? "end" : "start"}>
            <DropdownMenuItem onClick={() => onReply(message)}>
                <MessageSquareReply className="mr-2 h-4 w-4" />
                <span>Ответить</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopy(message.text)}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Копировать</span>
            </DropdownMenuItem>
            {isSentByCurrentUser && (
                <>
                    <DropdownMenuItem onClick={() => onEdit(message)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Изменить</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(message.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Удалить</span>
                    </DropdownMenuItem>
                </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
