export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  status: 'sent' | 'delivered' | 'read';
  translation?: string;
}

export interface Conversation {
  id:string;
  participants: User[];
  messages: Message[];
}
