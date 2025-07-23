
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/profile-store";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { useLocationStore } from "@/lib/location-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/use-translation";

// Heavy components are now lazy-loaded where they are used.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isRegistered, checkRegistration } = useProfileStore();
  const requestLocation = useLocationStore((state) => state.requestLocation);
  const t = useTranslation();

  useEffect(() => {
    // This is the key change: ensure we check registration status
    // when any page within this layout is loaded.
    checkRegistration();
  }, [checkRegistration]);


  useEffect(() => {
    // Request location only when user is in the main part of the app
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    // If the registration status is determined to be false, redirect to the root welcome/auth page.
    if (isRegistered === false) {
      router.replace('/');
    }
  }, [isRegistered, router]);

  // While we wait for the registration status, show a loader.
  if (isRegistered === null) {
    return <FullScreenLoader text={t('loading')} />;
  }

  // If the user is not registered, they will be redirected, so we don't render anything.
  if (isRegistered === false) {
    return null;
  }
  
  // If the user is registered, show the main app layout.
  return (
    <div className="relative flex flex-col h-svh">
      <Header />
      <main className="flex-grow overflow-y-auto pb-20">{children}</main>
      <BottomNavBar />
    </div>
  );
}
