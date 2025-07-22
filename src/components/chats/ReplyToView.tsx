
'use client';

import { MessageSquareReply, X } from "lucide-react";
import { Button } from "../ui/button";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReplyToViewProps {
    message: Message;
    isSentByCurrentUser: boolean;
    onCancel: () => void;
}

export function ReplyToView({ message, isSentByCurrentUser, onCancel }: ReplyToViewProps) {
    const senderName = isSentByCurrentUser ? 'You' : message.replyTo?.senderName || 'User';

    return (
        <div className={cn(
            "p-2 mb-2 rounded-md bg-muted flex justify-between items-center border-l-4",
            isSentByCurrentUser ? "border-primary" : "border-accent"
        )}>
            <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquareReply className="h-5 w-5 text-primary shrink-0" />
                <div className="overflow-hidden">
                    <p className="font-semibold text-sm text-primary truncate">Ответ {senderName}</p>
                    <p className="text-xs text-muted-foreground truncate">{message.text}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onCancel}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
