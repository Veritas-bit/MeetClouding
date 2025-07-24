
'use client';

import { useEffect, useState } from 'react';
import { useProfileStore } from '@/lib/profile-store';
import { Header } from '@/components/layout/Header';
import { BottomNavBar } from '@/components/layout/BottomNavBar';

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirstEdit, setIsFirstEdit] = useState(true);
  const { nickname } = useProfileStore();

  useEffect(() => {
    // Check if there's already a nickname. If so, it's not the first edit.
    if (nickname) {
      setIsFirstEdit(false);
    }
  }, [nickname]);

  if (isFirstEdit) {
    // On first edit, render only the page content without Header and BottomNavBar
    return <main className="flex-grow overflow-y-auto">{children}</main>;
  }

  // For subsequent edits, render the full layout
  return (
    <>
      <Header />
      <main className="flex-grow overflow-y-auto pb-20">{children}</main>
      <BottomNavBar />
    </>
  );
}
