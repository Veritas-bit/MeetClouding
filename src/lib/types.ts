
import { WishCategoryKey } from "./categories";
import { Gender } from "./profile-store";

export type ViewOptions = '5s' | '15s' | '30s' | 'once';

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
  location?: {
    latitude: number;
    longitude: number;
  };
  viewOptions?: ViewOptions | null;
}

export interface Conversation {
  id:string;
  participants: User[];
  messages: Message[];
  wishText?: string;
  wishCategory?: WishCategoryKey;
}
