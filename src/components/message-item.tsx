
"use client";

import React, { useState, useRef, useTransition, useEffect, useCallback } from 'react';
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

// Custom Menu Component
interface MessageMenuProps {
  isSentByCurrentUser: boolean;
  onReply: () => void;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

function ChatMessageMenu({ isSentByCurrentUser, onReply, onCopy, onEdit, onDelete, onClose }: MessageMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const menuItems = [
    { label: 'Ответить', icon: MessageSquareReply, action: onReply, a: 's' },
    { label: 'Копировать', icon: Copy, action: onCopy },
    ...(isSentByCurrentUser ? [
      { label: 'Изменить', icon: Pencil, action: onEdit! },
      { label: 'Удалить', icon: Trash2, action: onDelete!, className: 'text-destructive' },
    ] : [])
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      {menuItems.map((item, index) => (
        <React.Fragment key={item.label}>
          <button
            onClick={() => { item.action(); onClose(); }}
            className={cn(
              "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
              item.className
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
          {item.label === 'Копировать' && isSentByCurrentUser && <div className="-mx-1 my-1 h-px bg-muted" />}
        </React.Fragment>
      ))}
    </div>
  );
}


export function MessageItem({ message, currentUser, otherParticipant, onDelete, onCopy, onEdit, onReply }: MessageItemProps) {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(message.translation || null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language: targetLanguage } = useLanguageStore();
  const t = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const messageRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);


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
  
  const openMenu = useCallback(() => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      setIsMenuOpen(true);
    }
  }, []);

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    pressTimer.current = setTimeout(() => {
      openMenu();
    }, 700);
  };
  
  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    touchStartPos.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (!pressTimer.current || !touchStartPos.current) return;
     const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
     const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
     if (dx > 10 || dy > 10) {
        handlePressEnd(); // It's a scroll, not a long press
     }
  };


  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu();
  };

  const isSentByCurrentUser = message.senderId === currentUser.id;
  const sender = isSentByCurrentUser ? currentUser : otherParticipant;
  const textToShow = showTranslation && translatedText ? translatedText : message.text;
  const messageColorClass = isSentByCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card border';
  
  const renderMenu = () => {
    if (!isMenuOpen) return null;

    const MenuWithPosition = ({ position }: { position: { top: number, left: number, width: number, height: number } }) => {
      const menuRef = useRef<HTMLDivElement>(null);
      const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

      useEffect(() => {
        if (menuRef.current) {
          const menuRect = menuRef.current.getBoundingClientRect();
          const menuHeight = menuRect.height;
          const spaceBelow = window.innerHeight - position.top - position.height;
          
          let top = position.top + position.height + 4; // Position below by default
          if (spaceBelow < menuHeight && position.top > menuHeight) {
            top = position.top - menuHeight - 4; // Position above if not enough space below
          }
          
          let left = position.left;
          if(left + menuRect.width > window.innerWidth) {
            left = window.innerWidth - menuRect.width - 8;
          }

          setStyle({ top, left, opacity: 1 });
        }
      }, [position]);


      return (
        <div ref={menuRef} style={style} className="fixed z-50">
          <ChatMessageMenu
            isSentByCurrentUser={isSentByCurrentUser}
            onReply={() => onReply(message)}
            onCopy={() => onCopy(message.text)}
            onEdit={() => onEdit(message)}
            onDelete={() => onDelete(message.id)}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      );
    };

    return <MenuWithPosition position={menuPosition} />;
  };

  return (
    <>
      <div className={cn('flex items-end space-x-3', isSentByCurrentUser ? 'justify-end' : '')}>
        {!isSentByCurrentUser && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={sender.avatarUrl} alt={sender.name} data-ai-hint="person portrait" />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div
          ref={messageRef}
          onContextMenu={handleContextMenu}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchMove={handleTouchMove}
          className={cn('max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col', messageColorClass)}
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
      </div>
      {renderMenu()}
    </>
  );
}
