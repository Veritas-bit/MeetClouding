
'use client';

import { useState, useRef, MouseEvent, TouchEvent, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CornerUpLeft, Copy, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessageProps {
  id: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  image?: string;
  video?: string;
  source?: 'camera' | 'gallery';
  replyTo?: {
    author: string;
    message: string;
  };
  authorName?: string;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessageProps) => void;
  onEdit?: (message: ChatMessageProps) => void;
}

export function ChatMessage({ id, message, timestamp, isOwn, image, video, source, replyTo, onDelete, onReply, onEdit, authorName }: ChatMessageProps) {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const messageRef = useRef<HTMLDivElement>(null);

  const clearTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
      setIsMenuOpen(true);
    }
  }, []);
  
  const handlePressStart = (clientX: number, clientY: number) => {
    clearTimer();
    startPos.current = { x: clientX, y: clientY };
    pressTimer.current = setTimeout(() => {
        openMenu();
        pressTimer.current = null;
    }, 1000);
  };

  const handlePressMove = (clientX: number, clientY: number) => {
    const dx = Math.abs(clientX - startPos.current.x);
    const dy = Math.abs(clientY - startPos.current.y);
    if (dx > 10 || dy > 10) {
      clearTimer();
    }
  };

  const handlePressEnd = () => {
    clearTimer();
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      handlePressStart(e.clientX, e.clientY);
    }
  };
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => handlePressMove(e.clientX, e.clientY);
  const handleMouseUp = () => handlePressEnd();
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => handlePressStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => handlePressMove(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => handlePressEnd();

  const handleAction = (action: 'reply' | 'copy' | 'edit' | 'delete') => {
    setIsMenuOpen(false);
    const messageProps: ChatMessageProps = { id, message, timestamp, isOwn, image, video, source, authorName };

    switch (action) {
      case 'reply':
        onReply?.(messageProps);
        break;
      case 'copy':
        navigator.clipboard.writeText(message || 'Медиафайл');
        toast({ title: 'Действие', description: "Текст сообщения скопирован" });
        break;
      case 'edit':
        onEdit?.(messageProps);
        break;
      case 'delete':
        if (onDelete) {
          onDelete(id);
          toast({ title: 'Действие', description: "Сообщение удалено" });
        }
        break;
    }
  };
  
  useEffect(() => {
    const handleScrollOrResize = () => setIsMenuOpen(false);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true); // Use capture phase
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, []);

  const hasMedia = image || video;

  return (
    <>
      <div 
        ref={messageRef}
        className="relative outline-none transition-all active:brightness-90"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn('flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}
        >
          <div
            className={cn(
              'max-w-[75%] rounded-lg text-sm shadow-md sm:max-w-[60%]',
              !hasMedia && !replyTo && 'p-3',
              hasMedia && !replyTo && 'p-1',
              isOwn
                ? 'rounded-br-none bg-primary text-primary-foreground'
                : 'rounded-bl-none bg-muted text-foreground'
            )}
          >
            {replyTo && (
                <div className="bg-black/10 dark:bg-white/10 p-2 rounded-t-md border-b border-white/20">
                    <p className="font-semibold">{replyTo.author}</p>
                    <p className="text-xs opacity-90 truncate">{replyTo.message}</p>
                </div>
            )}
            
            <div className={cn(replyTo && (message || hasMedia) && 'p-2 pt-1')}>
                {image && (
                    <div className="relative">
                        <Image 
                            src={image}
                            alt="Прикрепленное изображение"
                            width={250}
                            height={250}
                            className="object-cover rounded-lg"
                        />
                        {source === 'camera' && (
                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-white rounded-full p-0.5">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9 9h6l-3-7zM3 13l9-2-2 9H3zm18-2l-9 2v7h7l2-9z"></path></svg>
                            </div>
                        )}
                    </div>
                )}
                {video && (
                    <div className="relative">
                        <video 
                            src={video}
                            controls
                            className="w-[250px] object-cover rounded-lg"
                        />
                        {source === 'camera' && (
                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-white rounded-full p-0.5">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9 9h6l-3-7zM3 13l9-2-2 9H3zm18-2l-9 2v7h7l2-9z"></path></svg>
                            </div>
                        )}
                    </div>
                )}
                {!hasMedia && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={cn(
              "fixed z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-95",
              "-translate-x-1/2 -translate-y-full"
            )}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
              <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => handleAction('reply')}>
                  <CornerUpLeft className="h-4 w-4" />
                  <span>Ответить</span>
              </button>
              <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => handleAction('copy')} disabled={!message && !hasMedia}>
                  <Copy className="h-4 w-4" />
                  <span>Копировать</span>
              </button>
              {isOwn && onEdit && !!message && (
                  <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => handleAction('edit')}>
                      <Pencil className="h-4 w-4" />
                      <span>Изменить</span>
                  </button>
              )}
              {isOwn && onDelete && (
                <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive" onClick={() => handleAction('delete')}>
                    <Trash2 className="h-4 w-4" />
                    <span>Удалить</span>
                </button>
              )}
          </div>
        </div>
      )}
    </>
  );
}
