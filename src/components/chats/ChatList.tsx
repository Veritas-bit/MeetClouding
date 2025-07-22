
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChatItem, type ChatItemProps } from "./ChatItem";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";


interface ChatListProps {
    mainChats: ChatItemProps[];
    friendChats: ChatItemProps[];
}

export function ChatList({ mainChats, friendChats }: ChatListProps) {
  return (
    <div className="container mx-auto p-0 sm:p-4 pb-24 flex-grow flex flex-col">
        <ScrollArea className="flex-grow">
            <div className="pt-2">
                <div className="flex flex-col">
                <h2 className="text-lg font-semibold px-4 pt-2 pb-1 text-primary">Чаты</h2>
                {mainChats.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                        <ChatItem {...chat} />
                    </Link>
                ))}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col">
                <h2 className="text-lg font-semibold px-4 pt-2 pb-1 text-primary">Друзья</h2>
                {friendChats.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                    <ChatItem key={chat.id} {...chat} />
                    </Link>
                ))}
                </div>
            </div>
        </ScrollArea>
    </div>
  );
}
