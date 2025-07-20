
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Gender } from "@/lib/profile-store";

export interface ChatItemProps {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    avatarUrl: string;
    avatarHint?: string;
    gender?: Gender;
    isOnline?: boolean;
}

export function ChatItem({
    name,
    lastMessage,
    timestamp,
    unreadCount,
    avatarUrl,
    avatarHint,
    isOnline,
}: ChatItemProps) {
    return (
        <div className="flex items-center p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b">
            <div className="relative shrink-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl} alt={name} data-ai-hint={avatarHint} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                )}
            </div>
            <div className="ml-4 flex-grow overflow-hidden">
                <p className="font-semibold truncate">{name}</p>
                <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
            </div>
            <div className="ml-2 flex flex-col items-end space-y-1 text-xs text-muted-foreground shrink-0">
                <span>{timestamp}</span>
                {unreadCount > 0 && (
                    <Badge variant="default" className="w-5 h-5 flex items-center justify-center p-0 text-xs">
                        {unreadCount}
                    </Badge>
                )}
            </div>
        </div>
    );
}
