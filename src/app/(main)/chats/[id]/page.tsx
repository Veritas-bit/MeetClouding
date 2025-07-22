"use client";

import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import { MessageView } from '@/components/message-view';
import { notFound, useParams } from 'next/navigation';
import type { User, Conversation } from '@/lib/types';
import { useEffect, useState } from 'react';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

export default function ConversationPage() {
  const params = useParams();
  const [conversation, setConversation] = useState<Conversation | null | undefined>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      const conv = await getConversationById(params.id as string);
      const user = await getCurrentUser();
      setConversation(conv);
      setCurrentUser(user as User);
    }
    fetchData();
  }, [params.id]);


  if (conversation === null || currentUser === null) {
    return <FullScreenLoader text="Загрузка чата..." />;
  }

  if (conversation === undefined) {
    notFound();
  }

  return <MessageView initialConversation={conversation} currentUser={currentUser} />;
}
