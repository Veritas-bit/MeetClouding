import type { Gender } from "@/lib/profile-store";

// This file only contains the type definition for now.
export interface ChatItemProps {
    id: string;
    name: string;
    message: string;
    time: string;
    unread: number;
    isOnline: boolean;
    avatarUrl: string;
    avatarHint?: string;
    gender?: Gender;
}
