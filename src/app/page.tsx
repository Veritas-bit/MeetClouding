
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
  const [isAnimating, setIsAnimating] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    // This is the only place we should check registration status at startup.
    checkRegistration();
  }, [checkRegistration]);


  useEffect(() => {
    // If registration status becomes true, redirect to the main app.
    if (isRegistered === true) {
      router.replace('/main');
    } 
    // If it's false, it means we should show the welcome screen.
    else if (isRegistered === false) {
      // Start animation for a smooth transition.
      setTimeout(() => setIsAnimating(true), 100);
    }
  }, [isRegistered, router]);

  // While isRegistered is `null`, we are waiting for the store to rehydrate.
  // Show a loader to prevent flicker.
  if (isRegistered === null) {
    return <FullScreenLoader text={t('loading')} />;
  }

  // If isRegistered is true, we will be redirected, so we can show a loader as well.
  if (isRegistered === true) {
    return <FullScreenLoader text={t('signingIn')} />;
  }

  // Only render the welcome screen if the user is not registered.
  return (
    <div className="flex h-screen w-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center text-foreground p-4 sm:p-8 opacity-0 transition-opacity duration-1000 ease-out",
            isAnimating && "opacity-100 animate-fade-in-up"
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
