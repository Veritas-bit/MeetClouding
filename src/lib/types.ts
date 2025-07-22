import { WishCategoryKey } from "./categories";
import { Gender } from "./profile-store";

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  gender: Gender;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  status: 'sent' | 'delivered' | 'read';
  translation?: string;
  image?: string;
  video?: string;
  source?: 'camera' | 'gallery';
  replyTo?: {
    messageId: string;
    senderName: string;
    text: string;
  };
  edited?: boolean;
}

export interface Conversation {
  id:string;
  participants: User[];
  messages: Message[];
  wishText?: string;
  wishCategory?: WishCategoryKey;
}
