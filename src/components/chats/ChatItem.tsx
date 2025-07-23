
'use client';

import { useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Gender } from "@/lib/profile-store";
import { cn } from "@/lib/utils";
import { MaleIcon } from "../icons/gender/MaleIcon";
import { FemaleIcon } from "../icons/gender/FemaleIcon";
import { NeuterIcon } from "../icons/gender/NeuterIcon";
import { Trash2, Pin } from "lucide-react";

export interface ChatItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatarHint?: string;
  gender: Gender;
  isOnline?: boolean;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  isPinned?: boolean;
}

const GenderAvatar = ({ gender }: { gender: Gender }) => {
    const iconProps = { className: "w-full h-full p-1.5" };
    switch (gender) {
        case 'male':
            return <MaleIcon {...iconProps} />;
        case 'female':
            return <FemaleIcon {...iconProps} />;
        default:
            return <NeuterIcon {...iconProps} />;
    }
};

export function ChatItem({ id, avatarUrl, name, lastMessage, timestamp, unreadCount, avatarHint, isOnline, gender, onDelete, onPin, isPinned }: ChatItemProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [actionBackgroundWidth, setActionBackgroundWidth] = useState(0);
  const touchStartRef = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const isActionTriggeredRef = useRef(false);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    isActionTriggeredRef.current = false;
    if (itemRef.current) {
        itemRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const deltaX = e.targetTouches[0].clientX - touchStartRef.current;
    
    // Clamp the swipe distance to a maximum of 10% of the element's width
    const maxSwipe = itemRef.current ? itemRef.current.offsetWidth * 0.10 : 50;
    const clampedSwipeX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setSwipeX(clampedSwipeX);

    // Only show the background if the swipe is more than 2% of the element width
    const threshold = itemRef.current ? itemRef.current.offsetWidth * 0.02 : 0;
    if (Math.abs(clampedSwipeX) > threshold) {
        setActionBackgroundWidth(Math.abs(clampedSwipeX));
    } else {
        setActionBackgroundWidth(0);
    }
  };

  const handleTouchEnd = () => {
    if (itemRef.current) {
        itemRef.current.style.transition = 'transform 0.2s ease-out';
    }
    
    const actionThreshold = 80; // This remains the threshold to ACTUALLY trigger the action
    if (swipeX < -actionThreshold) { // Swipe Left (Delete)
      if (!isActionTriggeredRef.current) {
        isActionTriggeredRef.current = true;
        setSwipeX(-window.innerWidth); // Animate out
        setTimeout(() => onDelete(id), 200);
      }
    } else if (swipeX > actionThreshold) { // Swipe Right (Pin)
       if (!isActionTriggeredRef.current) {
        isActionTriggeredRef.current = true;
        onPin(id);
      }
    } 
    
    // Always animate back to 0 at the end of the swipe if no action was taken
    setSwipeX(0);
    setActionBackgroundWidth(0);
  };

  return (
    <div className="relative overflow-hidden bg-background">
       {/* Delete Background - only shows on left swipe */}
       <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-destructive pr-6" style={{ width: `${swipeX < 0 ? actionBackgroundWidth : 0}px` }}>
            <Trash2 className="h-6 w-6 text-destructive-foreground" />
       </div>
       {/* Pin Background - only shows on right swipe */}
       <div className="absolute inset-y-0 left-0 flex items-center justify-start bg-primary pl-6" style={{ width: `${swipeX > 0 ? actionBackgroundWidth : 0}px` }}>
            <Pin className="h-6 w-6 text-primary-foreground" />
       </div>


      <div
        ref={itemRef}
        className={cn(
            "flex p-4 border-b transition-colors bg-background active:bg-muted/50 items-center h-20 relative z-10",
            isPinned && "bg-primary/10"
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={`/chats/${id}`} passHref className="flex-grow flex items-center min-w-0">
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 bg-muted/50">
                {avatarUrl ? (
                    <AvatarImage 
                        src={avatarUrl} 
                        alt={name} 
                    />
                ) : null}
                <AvatarFallback>
                    <GenderAvatar gender={gender} />
                </AvatarFallback>
            </Avatar>
            {isOnline && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
            )}
          </div>
          <div className="ml-4 flex-grow overflow-hidden flex flex-col justify-center">
              <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-lg truncate">{name}</p>
                    {isPinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 shrink-0">{timestamp}</span>
              </div>
              <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground truncate max-w-[50vw]">{lastMessage}</p>
                  {unreadCount && unreadCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold shrink-0">
                      {unreadCount}
                  </span>
                  )}
              </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
