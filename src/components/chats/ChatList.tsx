
'use client';

import Link from "next/link";
import { ChatItem, type ChatItemProps } from "./ChatItem";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";


interface ChatListProps {
    mainChats: ChatItemProps[];
    friendChats: ChatItemProps[];
    activeTab: 'all' | 'friends';
}

export function ChatList({ mainChats, friendChats, activeTab }: ChatListProps) {
  const chatsToShow = activeTab === 'all' ? mainChats : friendChats;

  return (
    <div className="container mx-auto p-0 sm:p-4 pb-24 flex-grow flex flex-col">
        <ScrollArea className="flex-grow">
            <div className="pt-2">
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
