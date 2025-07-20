'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Conversation, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function ConversationListItem({ conversation, currentUser }: { conversation: Conversation; currentUser: User }) {
  const pathname = usePathname();
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isActive = pathname === `/chat/${conversation.id}`;

  if (!otherParticipant) return null;

  return (
    <Link href={`/chat/${conversation.id}`}>
      <div
        className={cn(
          'flex items-center space-x-4 p-3 rounded-lg transition-colors',
          isActive ? 'bg-primary/20' : 'hover:bg-primary/5'
        )}
      >
        <div className="relative">
            <Avatar>
            <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} data-ai-hint="person" />
            <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {otherParticipant.isOnline && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
            )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <p className="font-semibold truncate">{otherParticipant.name}</p>
            {lastMessage && (
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage ? lastMessage.text : 'No messages yet'}
          </p>
        </div>
      </div>
    </Link>
  );
}
