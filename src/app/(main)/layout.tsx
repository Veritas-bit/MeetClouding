
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/profile-store";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { useLocationStore } from "@/lib/location-store";

// Heavy components are now lazy-loaded where they are used.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isRegistered } = useProfileStore();
  const requestLocation = useLocationStore((state) => state.requestLocation);

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
    return <FullScreenLoader text="Загрузка..." />;
  }

  // If the user is not registered, they will be redirected, so we don't render anything.
  if (isRegistered === false) {
    return null;
  }
  
  // If the user is registered, show the main app layout.
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col pb-20 overflow-hidden">{children}</main>
      <BottomNavBar />
    </div>
  );
}
