
'use client';

import { useState } from "react";
import Link from "next/link";
import { ChatItem, type ChatItemProps } from "./ChatItem";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ChatListProps {
    mainChats: ChatItemProps[];
    friendChats: ChatItemProps[];
    activeTab: 'all' | 'friends';
}

// Props for ChatItem now include onDelete, but we'll handle it inside ChatList.
type ChatItemData = Omit<ChatItemProps, 'onDelete' | 'onPin'>;

export function ChatList({ mainChats: initialMainChats, friendChats: initialFriendChats, activeTab }: ChatListProps) {
  const [mainChats, setMainChats] = useState<ChatItemData[]>(initialMainChats);
  const [friendChats, setFriendChats] = useState<ChatItemData[]>(initialFriendChats);
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDelete = (id: string, type: 'main' | 'friend') => {
    const updater = type === 'main' ? setMainChats : setFriendChats;
    updater(prev => prev.filter(chat => chat.id !== id));
    setPinnedChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
    });
    toast({
        title: "Чат удален",
        variant: "destructive",
    });
  };

  const handlePin = (id: string) => {
    const isPinned = pinnedChats.has(id);
    const newPinnedSet = new Set(pinnedChats);

    if (isPinned) {
      newPinnedSet.delete(id);
      toast({ title: "Чат откреплен" });
    } else {
      newPinnedSet.add(id);
      toast({ title: "Чат закреплен" });
    }
    
    setPinnedChats(newPinnedSet);
  };

  const sortChats = (chats: ChatItemData[]) => {
      return [...chats].sort((a, b) => {
          const aIsPinned = pinnedChats.has(a.id);
          const bIsPinned = pinnedChats.has(b.id);
          if (aIsPinned && !bIsPinned) return -1;
          if (!aIsPinned && bIsPinned) return 1;
          return 0; // Keep original order for unpinned or same-pinned-status chats
      });
  };

  const chatsToShow = activeTab === 'all' ? sortChats(mainChats) : sortChats(friendChats);
  const chatType = activeTab === 'all' ? 'main' : 'friend';

  return (
    <div className="flex-grow flex flex-col p-2 h-full">
        <div className="flex-grow rounded-lg p-px bg-gradient-to-r from-primary/20 to-secondary/20">
            <ScrollArea className="flex-grow rounded-[7px] bg-primary/10 h-full">
                <div>
                    <div className="flex flex-col">
                    {chatsToShow.map((chat) => (
                        <ChatItem 
                            key={chat.id} 
                            {...chat} 
                            onDelete={(id) => handleDelete(id, chatType)}
                            onPin={handlePin}
                            isPinned={pinnedChats.has(chat.id)}
                        />
                    ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
  );
}
