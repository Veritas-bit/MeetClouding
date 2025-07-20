// This is a mock file to provide data for the user profile page.
// In a real application, this data would come from a database or API.
import type { ChatItemProps } from "@/components/chats/ChatItem";

export const mockChats: ChatItemProps[] = [
    {
        id: 'user-1',
        name: 'John Doe',
        message: 'See you tomorrow!',
        time: '10:42',
        unread: 2,
        isOnline: true,
        avatarUrl: 'https://placehold.co/64x64.png',
        avatarHint: 'man portrait',
        gender: 'male'
    }
];

export const mockFriendsChats: ChatItemProps[] = [
    {
        id: 'user-2',
        name: 'Jane Smith',
        message: 'Sounds good!',
        time: '09:15',
        unread: 0,
        isOnline: false,
        avatarUrl: 'https://placehold.co/64x64.png',
        avatarHint: 'woman portrait',
        gender: 'female'
    }
];

// This component won't be rendered directly, it just holds the mock data.
export default function ChatsPage() {
  return null;
}
