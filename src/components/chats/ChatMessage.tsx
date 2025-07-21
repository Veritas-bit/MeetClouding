
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const hasMedia = image || video;

  return (
    <div className="relative">
      <div
        className={cn('flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}
      >
        <div
          className={cn(
            'max-w-[75%] rounded-lg text-sm shadow-md sm:max-w-[60%] transition-all active:brightness-90',
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
  );
}
