
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientCloudIcon } from "@/components/icons/GradientCloudIcon";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/profile-store";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export default function WelcomePage() {
  const router = useRouter();
  const { isRegistered, checkRegistration } = useProfileStore();
  const t = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRegistration();
    
    // Set a 5-second timer for the initial loading experience.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [checkRegistration]);


  useEffect(() => {
    // This effect runs when either isRegistered changes or the initial loading finishes.
    if (isLoading) return;

    if (isRegistered === true) {
      // If user is registered, and loading is done, redirect.
      router.replace('/main');
    } 
    // If isRegistered is false, the welcome screen will be shown.
  }, [isRegistered, router, isLoading]);

  // Show a loader during the 5-second period OR while we check registration.
  // Also show a loader after login (isRegistered === true) until redirect happens.
  if (isLoading || isRegistered === null || isRegistered === true) {
    return <FullScreenLoader text={isRegistered ? t('signingIn') : t('loading')} />;
  }

  // Only render the welcome screen if the user is not registered (isRegistered === false)
  // and the initial loading period is over.
  return (
    <div className="flex h-screen w-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center text-foreground p-4 sm:p-8",
            "animate-in fade-in duration-1000 ease-out"
          )}
        >
          <GradientCloudIcon className="h-32 w-32" />

          <h1 className="text-4xl font-bold font-headline bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary bg-clip-text text-transparent mb-4">
            MeetCloud
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            {t('welcomeSlogan')}
          </p>

          <Button
            size="lg"
            className="w-72 h-12 text-lg rounded-lg uppercase bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary text-primary-foreground font-bold"
            onClick={() => router.push('/auth')}
          >
            {t('getStartedButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
