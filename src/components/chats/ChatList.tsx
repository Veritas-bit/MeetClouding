
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
type ChatItemData = Omit<ChatItemProps, 'onDelete'>;

export function ChatList({ mainChats: initialMainChats, friendChats: initialFriendChats, activeTab }: ChatListProps) {
  const [mainChats, setMainChats] = useState<ChatItemData[]>(initialMainChats);
  const [friendChats, setFriendChats] = useState<ChatItemData[]>(initialFriendChats);
  const { toast } = useToast();

  const handleDelete = (id: string, type: 'main' | 'friend') => {
    if (type === 'main') {
        setMainChats(prev => prev.filter(chat => chat.id !== id));
    } else {
        setFriendChats(prev => prev.filter(chat => chat.id !== id));
    }
    toast({
        title: "Чат удален",
        variant: "destructive",
    });
  };

  const chatsToShow = activeTab === 'all' ? mainChats : friendChats;
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
                        />
                    ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
  );
}
