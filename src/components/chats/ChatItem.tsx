
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/lib/profile-store";
import { cn } from "@/lib/utils";
import { MaleIcon } from "../icons/gender/MaleIcon";
import { FemaleIcon } from "../icons/gender/FemaleIcon";
import { NeuterIcon } from "../icons/gender/NeuterIcon";

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

export function ChatItem({ id, avatarUrl, name, lastMessage, timestamp, unreadCount, avatarHint, isOnline, gender }: ChatItemProps) {
  return (
    <div className="flex p-4 border-b transition-colors active:bg-muted/50 items-center h-20">
      <div className="relative">
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
              <p className="font-semibold text-foreground text-lg truncate">{name}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timestamp}</span>
          </div>
          <div className="flex justify-between items-start">
              <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
              {unreadCount && unreadCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold shrink-0">
                  {unreadCount}
              </span>
              )}
          </div>
      </div>
    </div>
  );
}
