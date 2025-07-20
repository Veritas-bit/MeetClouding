import type { User, Conversation } from './types';

const users: User[] = [
  { id: 'user-1', name: 'You', avatarUrl: 'https://placehold.co/100x100.png', isOnline: true },
  { id: 'user-2', name: 'Elena Petrova', avatarUrl: 'https://placehold.co/100x100.png', isOnline: true },
  { id: 'user-3', name: 'Kenji Tanaka', avatarUrl: 'https://placehold.co/100x100.png', isOnline: false },
  { id: 'user-4', name: 'Priya Sharma', avatarUrl: 'https://placehold.co/100x100.png', isOnline: true },
  { id: '1', name: 'Иван', avatarUrl: 'https://placehold.co/100x100.png', isOnline: true },
];

const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [users[0], users[1]],
    messages: [
      { id: 'msg-1-1', text: 'Hey Elena! How are you doing?', timestamp: Date.now() - 1000 * 60 * 5, senderId: 'user-1', status: 'read' },
      { id: 'msg-1-2', text: 'Привет! I am doing well, thank you. Just working on the new design. How about you?', timestamp: Date.now() - 1000 * 60 * 4, senderId: 'user-2', status: 'read' },
      { id: 'msg-1-3', text: 'I\'m great! Excited to see it. Btw, checkout this cool site: https://google.com', timestamp: Date.now() - 1000 * 60 * 3, senderId: 'user-1', status: 'delivered' },
    ],
  },
  {
    id: 'conv-2',
    participants: [users[0], users[2]],
    messages: [
      { id: 'msg-2-1', text: 'Hi Kenji, do you have the latest report?', timestamp: Date.now() - 1000 * 60 * 60 * 2, senderId: 'user-1', status: 'read' },
      { id: 'msg-2-2', text: 'こんにちは。Yes, I will send it to you in a moment. @channel has been notified.', timestamp: Date.now() - 1000 * 60 * 60 * 1, senderId: 'user-2', status: 'read' },
    ],
  },
  {
    id: 'conv-3',
    participants: [users[0], users[3]],
    messages: [
       { id: 'msg-3-1', text: 'Hey Priya, are we still on for lunch tomorrow?', timestamp: Date.now() - 1000 * 60 * 30, senderId: 'user-1', status: 'sent' },
    ],
  },
  {
    id: '1',
    participants: [users[0], users[4]],
    messages: [
       { id: 'msg-4-1', text: 'Привет! Давай встретимся?', timestamp: Date.now() - 1000 * 60 * 30, senderId: 'user-1', status: 'sent' },
    ],
  }
];

export const getCurrentUser = async (): Promise<User> => {
  return Promise.resolve(users[0]);
};

export const getConversations = async (): Promise<Conversation[]> => {
  return Promise.resolve(conversations);
};

export const getConversationById = async (id: string): Promise<Conversation | undefined> => {
  return Promise.resolve(conversations.find(c => c.id === id));
};
