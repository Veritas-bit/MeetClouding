import type { User, Conversation } from './types';

const users: User[] = [
  { id: 'user-1', name: 'You', avatarUrl: '', isOnline: true, gender: 'male' },
  { id: 'user-2', name: 'Elena Petrova', avatarUrl: '', isOnline: true, gender: 'female' },
  { id: 'user-3', name: 'Kenji Tanaka', avatarUrl: '', isOnline: false, gender: 'male' },
  { id: 'user-4', name: 'Priya Sharma', avatarUrl: '', isOnline: true, gender: 'female' },
  { id: 'user-5', name: 'Alex Doe', avatarUrl: '', isOnline: true, gender: 'unselected' },
  { id: 'friend-1', name: 'Иван Друг', avatarUrl: '', isOnline: true, gender: 'male' },
  { id: 'friend-2', name: 'Мария Подруга', avatarUrl: '', isOnline: false, gender: 'female' },
];

const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [users[0], users[1]],
    wishText: 'Я хочу попробовать самый вкусный кофе в городе',
    wishCategory: 'food',
    messages: [
      { id: 'msg-1-1', text: 'Hey Elena! How are you doing?', timestamp: Date.now() - 1000 * 60 * 5, senderId: 'user-1', status: 'read' },
      { id: 'msg-1-2', text: 'Привет! I am doing well, thank you. Just working on the new design. How about you?', timestamp: Date.now() - 1000 * 60 * 4, senderId: 'user-2', status: 'read' },
      { id: 'msg-1-3', text: 'I\'m great! Excited to see it. Btw, checkout this cool site: https://google.com', timestamp: Date.now() - 1000 * 60 * 3, senderId: 'user-1', status: 'read' },
      { id: 'msg-1-4', text: 'Sure, I will take a look. I also wanted to ask you something.', timestamp: Date.now() - 1000 * 60 * 2, senderId: 'user-2', status: 'delivered' },
      { id: 'msg-1-5', text: 'Are we still on for the meeting tomorrow?', timestamp: Date.now() - 1000 * 60 * 1, senderId: 'user-2', status: 'delivered' },
    ],
  },
  {
    id: 'conv-2',
    participants: [users[0], users[2]],
    wishText: 'Я хочу сходить в поход на один день',
    wishCategory: 'walk',
    messages: [
      { id: 'msg-2-1', text: 'Hi Kenji, do you have the latest report?', timestamp: Date.now() - 1000 * 60 * 60 * 2, senderId: 'user-1', status: 'read' },
      { id: 'msg-2-2', text: 'こんにちは。Yes, I will send it to you in a moment. @channel has been notified.', timestamp: Date.now() - 1000 * 60 * 60 * 1, senderId: 'user-2', status: 'read' },
    ],
  },
  {
    id: 'conv-3',
    participants: [users[0], users[3]],
    wishText: 'Я хочу поиграть в настолки в антикафе',
    wishCategory: 'entertainment',
    messages: [
       { id: 'msg-3-1', text: 'Hey Priya, are we still on for lunch tomorrow?', timestamp: Date.now() - 1000 * 60 * 30, senderId: 'user-1', status: 'sent' },
    ],
  },
  {
    id: 'friend-1',
    participants: [users[0], users[5]],
    messages: [
       { id: 'msg-4-1', text: 'Привет! Давно не виделись!', timestamp: Date.now() - 1000 * 60 * 60 * 24, senderId: 'friend-1', status: 'read' },
    ],
  },
  {
    id: 'friend-2',
    participants: [users[0], users[6]],
    messages: [
       { id: 'msg-5-1', text: 'Какие планы на выходные?', timestamp: Date.now() - 1000 * 60 * 60 * 4, senderId: 'user-1', status: 'delivered' },
    ],
  }
];

type FriendshipStatus = "none" | "sent" | "received" | "friends";
const friendshipStatuses: Record<string, FriendshipStatus> = {
    'user-2': 'none',
    'user-3': 'none',
    'user-4': 'none',
    'user-5': 'received',
    'friend-1': 'friends',
    'friend-2': 'friends',
};

export const getFriendshipStatus = (userId: string): FriendshipStatus => {
    return friendshipStatuses[userId] || 'none';
}

export const setFriendshipStatus = (userId: string, status: FriendshipStatus) => {
    friendshipStatuses[userId] = status;
}

export const getCurrentUser = async (): Promise<User | undefined> => {
  return Promise.resolve(users.find(u => u.id === 'user-1'));
};

export const getAllUsers = async (): Promise<User[]> => {
    return Promise.resolve(users);
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    return Promise.resolve(users.find(u => u.id === id));
};

export const getConversations = async (): Promise<Conversation[]> => {
  return Promise.resolve(conversations);
};

export const getConversationById = async (id: string): Promise<Conversation | undefined> => {
  return Promise.resolve(conversations.find(c => c.id === id));
};
