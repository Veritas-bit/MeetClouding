
"use client";

import React, { useState, useRef, useTransition, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, CheckCheck, Languages, MessageSquareReply, Copy, Pencil, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { getTranslation } from '@/lib/actions';
import { useLanguageStore } from '@/lib/language-store';
import { useTranslation } from '@/hooks/use-translation';
import Image from 'next/image';
import type { Gender } from '@/lib/profile-store';
import { MaleIcon } from '@/components/icons/gender/MaleIcon';
import { FemaleIcon } from '@/components/icons/gender/FemaleIcon';
import { NeuterIcon } from '@/components/icons/gender/NeuterIcon';
import { GradientBorderCloudIcon } from '@/components/icons/GradientBorderCloudIcon';
import { useRouter } from 'next/navigation';


interface MessageItemProps {
  message: Message;
  currentUser: User;
  otherParticipant: User;
  onOpenMenu: (messageId: string, rect: DOMRect) => void;
}

const GenderAvatar = ({ gender }: { gender: Gender }) => {
    const iconProps = { className: "w-full h-full p-1.5" };
    switch (gender) {
        case 'male':
            return <MaleIcon {...iconProps} />;
        case 'female':
            return <FemaleIcon {...iconProps} />;
        default:
            return <NeuterIcon {...iconProps} />;
    }
};

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

function LocationContent({ message }: { message: Message }) {
    const router = useRouter();

    if (!message.location) return null;

    const handleClick = () => {
        router.push(`/map?lat=${message.location!.latitude}&lon=${message.location!.longitude}&from=chat`);
    };

    return (
        <button onClick={handleClick} className="w-full text-left mt-2">
            <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Геопозиция</p>
                        <p className="text-xs opacity-80 truncate">Нажмите, чтобы посмотреть</p>
                    </div>
                </div>
            </div>
        </button>
    );
}

function MediaContent({ message }: { message: Message }) {
  if (message.image) {
    return (
      <div className="relative w-full max-w-[250px] aspect-square mt-2">
        <Image
          src={message.image}
          alt="Attached image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    );
  }
  if (message.video) {
     return (
        <video 
            src={message.video} 
            controls 
            className="w-full max-w-[250px] rounded-lg mt-2" 
        />
     )
  }
  return null;
}

function ReplyContent({ message, isSentByCurrentUser }: { message: Message, isSentByCurrentUser: boolean }) {
  if (!message.replyTo) return null;

  return (
    <div className={cn(
        "p-2 rounded-lg mb-2 border-l-2",
        isSentByCurrentUser ? "border-white/50 bg-white/10" : "border-primary bg-primary/10"
    )}>
        <p className="text-xs font-semibold">{message.replyTo.senderName}</p>
        <p className="text-xs opacity-80 truncate">{message.replyTo.text}</p>
    </div>
  )
}


export function MessageItem({ message, currentUser, otherParticipant, onOpenMenu }: MessageItemProps) {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(message.translation || null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language: targetLanguage } = useLanguageStore();
  const t = useTranslation();

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
      onOpenMenu(message.id, messageRef.current.getBoundingClientRect());
    }
  }, [message.id, onOpenMenu]);

  const clearLongPressTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePressStart = (e: React.TouchEvent) => {
    if (message.location) return; // Disable long press for location messages
    clearLongPressTimer();
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    pressTimer.current = setTimeout(openMenu, 700);
  };

  const handlePressEnd = () => {
    clearLongPressTimer();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (!pressTimer.current || !touchStartPos.current) return;
     const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
     const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
     if (dx > 10 || dy > 10) {
        clearLongPressTimer();
     }
  };


  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (message.location) return; // Disable context menu for location messages
    openMenu();
  };

  const isSentByCurrentUser = message.senderId === currentUser.id;
  const sender = isSentByCurrentUser ? currentUser : otherParticipant;
  const textToShow = showTranslation && translatedText ? translatedText : message.text;
  const messageColorClass = isSentByCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card border';
  
  return (
      <div className={cn('flex items-end space-x-3', isSentByCurrentUser ? 'justify-end' : '')}>
        {!isSentByCurrentUser && (
          <Avatar className="h-8 w-8 shrink-0 bg-muted/50">
            {sender.avatarUrl ? (
                <AvatarImage src={sender.avatarUrl} alt={sender.name} />
            ) : null}
            <AvatarFallback>
                <GenderAvatar gender={sender.gender} />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          ref={messageRef}
          onContextMenu={handleContextMenu}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchMove={handleTouchMove}
          onTouchCancel={handlePressEnd}
          className={cn('max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col', messageColorClass)}
        >
          <ReplyContent message={message} isSentByCurrentUser={isSentByCurrentUser} />
           {!message.location && (
                <div className="text-sm whitespace-pre-wrap break-words">
                    {parseMessageContent(textToShow)}
                    {showTranslation && <p className="text-xs opacity-70 mt-2 pt-2 border-t border-t-white/20">{t('original')}: {message.text}</p>}
                </div>
            )}
           <MediaContent message={message} />
           <LocationContent message={message} />
          <div className={cn("flex items-center gap-2 mt-2 self-end text-xs", isSentByCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
            {message.edited && <span className="text-xs opacity-70">изменено</span>}
            {isPending && <GradientBorderCloudIcon className="h-3 w-3" />}
            {!message.location && (
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
            )}
            <span>{format(new Date(message.timestamp), 'p')}</span>
            {isSentByCurrentUser && <MessageStatus status={message.status} />}
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      </div>
  );
}

// Custom Menu Component
interface ChatMessageMenuProps {
  message: Message | null;
  isSentByCurrentUser: boolean;
  position: { top: number; left: number } | null;
  onReply: (message: Message) => void;
  onCopy: (text: string) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onClose: () => void;
}

export function ChatMessageMenu({ message, isSentByCurrentUser, position, onReply, onCopy, onEdit, onDelete, onClose }: ChatMessageMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (position) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose]);

  if (!position || !message) return null;

  const menuItems = [
    { label: 'Ответить', icon: MessageSquareReply, action: () => onReply(message) },
    { label: 'Копировать', icon: Copy, action: () => onCopy(message.text) },
    ...(isSentByCurrentUser ? [
      { label: 'Изменить', icon: Pencil, action: () => onEdit(message) },
      { label: 'Удалить', icon: Trash2, action: () => onDelete(message.id), className: 'text-destructive' },
    ] : [])
  ];

  return (
    <div
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      {menuItems.map((item, index) => (
        <React.Fragment key={item.label}>
          <button
            onClick={(e) => { e.stopPropagation(); item.action(); onClose(); }}
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
