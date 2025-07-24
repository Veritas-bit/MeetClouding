
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, MessageSquareReply, Copy, Pencil, Trash2, MapPin, Lock } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import type { Gender } from '@/lib/profile-store';
import { MaleIcon } from '@/components/icons/gender/MaleIcon';
import { FemaleIcon } from '@/components/icons/gender/FemaleIcon';
import { NeuterIcon } from '@/components/icons/gender/NeuterIcon';
import { useRouter } from 'next/navigation';


interface MessageItemProps {
  message: Message;
  currentUser: User;
  otherParticipant: User;
  onOpenMenu: (messageId: string, rect: DOMRect) => void;
  onPreviewImage: (message: Message) => void;
  onReply: (message: Message) => void;
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

function LocationContent({ message, isSentByCurrentUser }: { message: Message, isSentByCurrentUser: boolean }) {
    const router = useRouter();

    if (!message.location) return null;

    const handleClick = () => {
        router.push(`/map?lat=${message.location!.latitude}&lon=${message.location!.longitude}&from=chat`);
    };

    return (
        <button onClick={handleClick} className="w-full text-left">
            <div className={cn(
                "p-2 rounded-lg flex items-center gap-3",
                 isSentByCurrentUser ? "bg-black/10 dark:bg-white/10" : "bg-muted"
            )}>
                 <MapPin className="h-10 w-10 text-destructive shrink-0" />
                 <div className="flex-1">
                     <p className="text-sm font-semibold">Геопозиция</p>
                     <p className="text-xs opacity-80 truncate">Нажмите, чтобы посмотреть</p>
                 </div>
            </div>
        </button>
    );
}

function MediaContent({ message, onPreviewImage }: { message: Message, onPreviewImage: (message: Message) => void }) {
  if (message.image) {
    const isPrivate = !!message.viewOptions;
    return (
      <button onClick={() => onPreviewImage(message)} className="relative w-full max-w-[250px] aspect-[4/5] block overflow-hidden rounded-lg">
        <Image
          src={message.image}
          alt={isPrivate ? "Private image" : "Image attachment"}
          layout="fill"
          objectFit="cover"
          className={cn(isPrivate && "blur-md")}
        />
        {isPrivate && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
            </div>
        )}
      </button>
    );
  }
  if (message.video) {
     return (
        <video 
            src={message.video} 
            controls 
            className="w-full max-w-[250px] rounded-lg" 
        />
     )
  }
  return null;
}

function ReplyContent({ message, isSentByCurrentUser }: { message: Message, isSentByCurrentUser: boolean }) {
  if (!message.replyTo) return null;

  return (
    <div className={cn(
        "p-2 rounded-lg mb-1 border-l-2",
        isSentByCurrentUser ? "border-white/50 bg-white/10" : "border-primary bg-primary/10"
    )}>
        <p className="text-xs font-semibold">{message.replyTo.senderName}</p>
        <p className="text-xs opacity-80 truncate">{message.replyTo.text}</p>
    </div>
  )
}


export function MessageItem({ message, currentUser, otherParticipant, onOpenMenu, onPreviewImage, onReply }: MessageItemProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    clearLongPressTimer();
    pressTimer.current = setTimeout(() => {
        openMenu();
        pressTimer.current = null;
    }, 500);
  };

  const handlePointerUp = () => {
      clearLongPressTimer();
  };
  
  const handlePointerLeave = () => {
      clearLongPressTimer();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu();
  };

  const isSentByCurrentUser = message.senderId === currentUser.id;
  const sender = isSentByCurrentUser ? currentUser : otherParticipant;
  const messageColorClass = isSentByCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card border';
  const hasTextContent = message.text && !message.image && !message.location && !message.video;

  return (
    <div className="relative">
        <div className={cn('flex items-end space-x-2 relative z-10 bg-transparent', isSentByCurrentUser ? 'justify-end' : '')}>
            {!isSentByCurrentUser && (
            <Avatar className="h-8 w-8 shrink-0 bg-muted/50 self-end mb-1">
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
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl flex flex-col', 
                    messageColorClass,
                    (message.image || message.location || message.video) ? 'p-0 overflow-hidden' : 'p-1.5'
                )}
            >
                <div className={cn(hasTextContent && 'px-1')}>
                    <ReplyContent message={message} isSentByCurrentUser={isSentByCurrentUser} />
                    {hasTextContent && (
                        <div className="text-sm whitespace-pre-wrap break-words">
                            {parseMessageContent(message.text)}
                        </div>
                    )}
                </div>

                <MediaContent message={message} onPreviewImage={onPreviewImage} />
                <LocationContent message={message} isSentByCurrentUser={isSentByCurrentUser} />

                <div className={cn(
                    "flex items-center gap-2 self-end text-xs", 
                    isSentByCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground',
                     (message.image || message.location || message.video) ? 'p-1' : 'mt-1'
                )}>
                    {message.edited && <span className="text-xs opacity-70">изменено</span>}
                    <span>{format(new Date(message.timestamp), 'p')}</span>
                    {isSentByCurrentUser && <MessageStatus status={message.status} />}
                </div>
            </div>
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
    { label: 'Копировать', icon: Copy, action: () => onCopy(message.text), disabled: !!(message.image || message.location || message.video) },
    ...(isSentByCurrentUser ? [
      { label: 'Изменить', icon: Pencil, action: () => onEdit(message), disabled: !!(message.image || message.location || message.video) },
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
            disabled={item.disabled}
            className={cn(
              "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none",
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
