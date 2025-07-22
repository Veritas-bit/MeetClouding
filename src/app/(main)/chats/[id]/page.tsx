
"use client";

import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { Conversation, Message, User } from '@/lib/types';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import { MessageItem, ChatMessageMenu } from '@/components/message-item';
import { MessageView } from '@/components/message-view';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { ChatAttachmentModal } from '@/components/chats/ChatAttachmentModal';


// =====================================================================
// Client Component: Handles all state, interactions, and UI rendering
// =====================================================================
interface ConversationClientProps {
  initialConversation: Conversation;
  currentUser: User;
}

function ConversationClient({ initialConversation, currentUser }: ConversationClientProps) {
  const otherParticipant = initialConversation.participants.find(p => p.id !== currentUser.id);

  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const t = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // State for context menu
  const [menuState, setMenuState] = useState<{ messageId: string | null; position: { top: number; left: number } | null }>({ messageId: null, position: null });
  
  // State for message actions
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // State for attachment modal
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  // Set focus on textarea when editing
  useEffect(() => {
    if (editingMessage) {
        document.getElementById('message-input')?.focus();
    }
  }, [editingMessage]);


  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !editingMessage) return;

    if (editingMessage) {
      // Edit existing message
      setMessages(messages.map(msg => 
        msg.id === editingMessage.id ? { ...msg, text: newMessage } : msg
      ));
      toast({ title: "Сообщение изменено" });
      setEditingMessage(null);
    } else {
      // Add new message
      const message: Message = {
        id: `msg-${Date.now()}`,
        text: newMessage,
        timestamp: Date.now(),
        senderId: currentUser.id,
        status: 'sent',
      };
      setMessages([...messages, message]);
    }

    setNewMessage('');
    setReplyingTo(null);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenMenu = useCallback((messageId: string, rect: DOMRect) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const viewportRect = viewport.getBoundingClientRect();
      const menuHeight = 180; // Approximate height of the menu

      let top = rect.bottom + 8; // Default position below the message
      
      // If there's not enough space below, show it above
      if (rect.bottom + menuHeight > viewportRect.bottom) {
        top = rect.top - menuHeight - 8;
      }
      // Clamp the top position to be within the viewport
      top = Math.max(viewportRect.top, Math.min(top, viewportRect.bottom - menuHeight));


      setMenuState({
          messageId,
          position: { top: top, left: rect.left }
      });
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuState({ messageId: null, position: null });
  }, []);

  const selectedMessage = messages.find(m => m.id === menuState.messageId);

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setEditingMessage(null); // Cancel editing if any
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Текст скопирован" });
  };
  
  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setReplyingTo(null); // Cancel replying if any
    setNewMessage(message.text);
  };
  
  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    toast({ title: "Сообщение удалено", variant: "destructive" });
  };

  const handleMediaSend = (media: { src: string, type: 'image' | 'video' }, source: 'camera' | 'gallery') => {
      const message: Message = {
          id: `msg-${Date.now()}`,
          text: '',
          timestamp: Date.now(),
          senderId: currentUser.id,
          status: 'sent',
          image: media.type === 'image' ? media.src : undefined,
          video: media.type === 'video' ? media.src : undefined,
          source,
      };
      setMessages([...messages, message]);
      setIsAttachmentModalOpen(false);
  };

  if (!otherParticipant) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Собеседник не найден.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col min-h-0 relative">
        <MessageView
            messages={messages}
            currentUser={currentUser}
            otherParticipant={otherParticipant}
            onOpenMenu={handleOpenMenu}
            viewportRef={viewportRef}
        />
        {menuState.position && selectedMessage && (
            <ChatMessageMenu
                message={selectedMessage}
                isSentByCurrentUser={selectedMessage.senderId === currentUser.id}
                position={menuState.position}
                onClose={handleCloseMenu}
                onReply={handleReply}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        )}
      </div>

      <div className="px-4 py-2 border-t bg-background">
        {replyingTo && (
            <div className="text-xs p-2 mb-2 rounded-md bg-muted text-muted-foreground border-l-4 border-primary">
                <div className="flex justify-between items-center">
                    <span className="font-bold">{t('Ответ на сообщение')}</span>
                    <button onClick={() => setReplyingTo(null)}><X className="h-4 w-4" /></button>
                </div>
                <p className="truncate italic mt-1">"{replyingTo.text}"</p>
            </div>
        )}
        {editingMessage && (
            <div className="text-xs p-2 mb-2 rounded-md bg-muted text-muted-foreground border-l-4 border-accent">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-accent">{t('Редактирование')}</span>
                    <button onClick={() => { setEditingMessage(null); setNewMessage(''); }}><X className="h-4 w-4" /></button>
                </div>
                <p className="truncate italic mt-1">"{editingMessage.text}"</p>
            </div>
        )}

        <div className="relative flex items-center">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setIsAttachmentModalOpen(true)}>
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Прикрепить файл</span>
          </Button>
          <Textarea
            id="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            rows={1}
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent max-h-24 resize-none"
          />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
            <span className="sr-only">Добавить эмодзи</span>
          </Button>
          <Button size="icon" className="shrink-0 rounded-full" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Отправить</span>
          </Button>
        </div>
      </div>
      <ChatAttachmentModal 
          isOpen={isAttachmentModalOpen}
          onClose={() => setIsAttachmentModalOpen(false)}
          onMediaSend={handleMediaSend}
      />
    </div>
  );
}


// =====================================================================
// Server Component: Fetches data and passes it to the Client Component
// =====================================================================

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const conversationId = params.id;
  
  // Fetch data on the server
  const [conversation, currentUser] = await Promise.all([
    getConversationById(conversationId),
    getCurrentUser()
  ]);

  // Handle case where conversation or user is not found
  if (!conversation || !currentUser) {
    notFound();
  }

  // Render the client component with the fetched data
  return (
    <ConversationClient initialConversation={conversation} currentUser={currentUser} />
  );
}
