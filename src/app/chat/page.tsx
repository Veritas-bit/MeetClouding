import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-secondary/30">
      <MessageCircle className="h-24 w-24 text-muted-foreground" />
      <h2 className="mt-6 text-2xl font-semibold text-foreground">
        Welcome to LinguaLink Chat
      </h2>
      <p className="mt-2 text-muted-foreground">
        Select a conversation from the list to start messaging.
      </p>
    </div>
  );
}
