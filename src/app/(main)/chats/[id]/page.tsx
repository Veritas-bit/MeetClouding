
"use client";

import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import { MessageView } from '@/components/message-view';
import { notFound } from 'next/navigation';
import type { Conversation, Message, User } from '@/lib/types';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, SendHorizonal } from 'lucide-react';
import { ChatAttachmentModal } from '@/components/chats/ChatAttachmentModal';
import { useToast } from '@/hooks/use-toast';
import { ChatMessageMenu } from '@/components/message-item';

type ActiveMenu = {
  message: Message;
  position: { top: number; left: number };
};

// We create a new client component to contain all the chat logic.
function ConversationClient({ initialConversation, currentUser }: { initialConversation: Conversation; currentUser: User }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const otherParticipant = initialConversation.participants.find(p => p.id !== currentUser.id);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);
  
  const handleOpenMenu = useCallback((messageId: string, rect: DOMRect) => {
    const message = messages.find(m => m.id === messageId);
    const scrollContainer = viewportRef.current;
    if (!message || !scrollContainer) return;
    
    const isSentByCurrentUser = message.senderId === currentUser.id;
    const containerRect = scrollContainer.getBoundingClientRect();
    const menuHeight = isSentByCurrentUser ? 130 : 80;

    let top: number;
    // Check if there's enough space below the message inside the container
    if (rect.bottom + menuHeight > containerRect.bottom) {
        // Not enough space below, position above
        top = rect.top - menuHeight;
    } else {
        // Enough space below, position below
        top = rect.top + rect.height;
    }

    // Clamp top position to be within the visible container area
    top = Math.max(containerRect.top, Math.min(top, containerRect.bottom - menuHeight));

    let left = isSentByCurrentUser ? rect.right - 180 : rect.left; // 180 is approx menu width

    // Clamp left position
    left = Math.max(8, Math.min(left, window.innerWidth - 180 - 8));

    setActiveMenu({ message, position: { top, left } });
  }, [messages, currentUser.id]);

  useEffect(() => {
    const scrollContainer = viewportRef.current;
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleCloseMenu);
        window.addEventListener('resize', handleCloseMenu);
        return () => {
            scrollContainer.removeEventListener('scroll', handleCloseMenu);
            window.removeEventListener('resize', handleCloseMenu);
        };
    }
  }, [handleCloseMenu]);

  useEffect(() => {
    if (viewportRef.current) {
        setTimeout(() => {
            viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }, 0);
    }
  }, [messages]);
  
  const sendMessage = (text: string, media?: { src: string; type: 'image' | 'video' }, source?: 'camera' | 'gallery') => {
    if (text.trim() === '' && !media) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: text,
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: 'sent',
      image: media?.type === 'image' ? media.src : undefined,
      video: media?.type === 'video' ? media.src : undefined,
      source: source as any,
    };
    
    setMessages(prev => [...prev, message]);

    setTimeout(() => {
      if (!otherParticipant) return;
      const reply: Message = {
        id: `msg-${Date.now() + 1}`,
        text: 'This is an automated reply!',
        timestamp: Date.now() + 1000,
        senderId: otherParticipant.id,
        status: 'delivered',
      };
      setMessages(prev => [...prev, reply]);
      toast({
        title: `New message from ${otherParticipant.name}`,
        description: reply.text,
      });
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };
  
  const handleMediaSend = (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => {
    sendMessage('', media, source);
    setIsAttachmentModalOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Скопировано', description: 'Текст сообщения скопирован в буфер обмена.' });
    });
    handleCloseMenu();
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    toast({ title: 'Сообщение удалено', variant: 'destructive' });
    handleCloseMenu();
  };
  
  const handleEdit = (message: Message) => {
      // Mock implementation
      toast({ title: 'Редактирование', description: `Выбрано для редактирования: "${message.text}"` });
      handleCloseMenu();
  };

  const handleReply = (message: Message) => {
      // Mock implementation
      toast({ title: 'Ответ', description: `Выбран ответ на: "${message.text}"` });
      handleCloseMenu();
  };


  if (!otherParticipant) {
    return <div>Собеседник не найден</div>;
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageView
          messages={messages}
          currentUser={currentUser}
          otherParticipant={otherParticipant}
          onOpenMenu={handleOpenMenu}
          viewportRef={viewportRef}
        />
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="relative w-full flex items-center">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Сообщение..."
              className="w-full pl-12 pr-12 py-3"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="absolute left-0 top-0 bottom-0 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-full w-10 hover:bg-transparent"
                onClick={() => setIsAttachmentModalOpen(true)}
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Открыть камеру</span>
              </Button>
            </div>

            <div className="absolute left-10 top-0 bottom-0 flex items-center">
              <div className="h-6 w-px bg-border" />
            </div>

            <div className="absolute right-10 top-0 bottom-0 flex items-center">
              <div className="h-6 w-px bg-border" />
            </div>

            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                aria-label="Send Message"
                className="h-full w-10 hover:bg-transparent"
                disabled={!newMessage.trim()}
              >
                <SendHorizonal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ChatAttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onMediaSend={handleMediaSend}
      />
      <ChatMessageMenu
          message={activeMenu?.message || null}
          position={activeMenu?.position || null}
          isSentByCurrentUser={activeMenu?.message?.senderId === currentUser.id}
          onReply={handleReply}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={handleCloseMenu}
      />
    </>
  )
}


export default function ConversationPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [convData, currentUserData] = await Promise.all([
        getConversationById(params.id),
        getCurrentUser()
      ]);
      setConversation(convData || null);
      setCurrentUser(currentUserData || null);
    }
    fetchData();
  }, [params.id]);

  if (!conversation || !currentUser) {
    // You can return a loading spinner here
    return null;
  }

  return (
    <ConversationClient initialConversation={conversation} currentUser={currentUser} />
  );
}
