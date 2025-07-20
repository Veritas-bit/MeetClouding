import type { Conversation, User } from '@/lib/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationListItem } from '@/components/conversation-list-item';

export function ConversationList({ conversations, currentUser }: { conversations: Conversation[]; currentUser: User }) {
  return (
    <aside className="h-screen w-full max-w-xs border-r flex flex-col bg-secondary/30">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-10 bg-background" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 pt-0 space-y-1">
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              currentUser={currentUser}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
