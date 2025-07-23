
'use client';

import Link from "next/link";
import { ChatItem, type ChatItemProps } from "./ChatItem";
import { ScrollArea } from "../ui/scroll-area";

interface ChatListProps {
    mainChats: ChatItemProps[];
    friendChats: ChatItemProps[];
    activeTab: 'all' | 'friends';
}

export function ChatList({ mainChats, friendChats, activeTab }: ChatListProps) {
  const chatsToShow = activeTab === 'all' ? mainChats : friendChats;

  return (
    <div className="flex-grow flex flex-col p-2 h-full">
        <ScrollArea className="flex-grow rounded-lg bg-primary/10">
            <div>
                <div className="flex flex-col">
                {chatsToShow.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                        <ChatItem {...chat} />
                    </Link>
                ))}
                </div>
            </div>
        </ScrollArea>
    </div>
  );
}
