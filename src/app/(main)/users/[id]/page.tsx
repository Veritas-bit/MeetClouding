
import Image from "next/image";
import { Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, getUserById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { UserProfileClient } from "@/components/users/UserProfileClient";
import { UserProfileTabs } from "@/components/users/UserProfileTabs";
import type { Gender } from "@/lib/profile-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MaleIcon } from "@/components/icons/gender/MaleIcon";
import { FemaleIcon } from "@/components/icons/gender/FemaleIcon";
import { NeuterIcon } from "@/components/icons/gender/NeuterIcon";


const meetingPhotos = [
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 1", hint: "people meeting" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 2", hint: "friends cafe" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 3", hint: "people concert" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 4", hint: "group selfie" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 5", hint: "friends laughing" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 6", hint: "outdoor activity" },
];

const getGenderText = (gender?: Gender) => {
    switch (gender) {
        case 'male': return 'мужской';
        case 'female': return 'женский';
        default: return 'не выбран';
    }
};

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

export default async function UserProfilePage({ params }: { params: { id: string }}) {
  const userId = params.id as string;
  const userInfo = await getUserById(userId);
  const isPremium = Math.random() > 0.5; // Mock premium status

  if (!userInfo) {
    notFound();
  }
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-4 pb-24 flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-16 w-16 bg-muted/50 border-2 border-background">
            {userInfo.avatarUrl ? (
                <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name || "User Avatar"} />
            ) : null}
            <AvatarFallback>
                <GenderAvatar gender={userInfo.gender} />
            </AvatarFallback>
        </Avatar>
        {isPremium && (
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-primary to-secondary p-1 rounded-full">
              <Gem className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h1 className="text-md font-bold text-foreground">{userInfo.name || 'Пользователь'}</h1>
        <p className="text-xs text-muted-foreground">{getGenderText(userInfo.gender)}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        <UserProfileClient userId={userId} />
        
        <Card className="bg-card/50">
          <CardContent className="px-3 pt-2 pb-3">
            <h2 className="text-sm font-semibold mt-1">О себе</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Информация не указана.
            </p>
          </CardContent>
        </Card>
        
        <UserProfileTabs photos={meetingPhotos} />

      </div>
    </div>
  );
}
