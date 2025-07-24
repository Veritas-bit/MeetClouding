
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlockedUsersStore } from "@/lib/blocked-users-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldX } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import type { Gender } from "@/lib/profile-store";
import { MaleIcon } from "@/components/icons/gender/MaleIcon";
import { FemaleIcon } from "@/components/icons/gender/FemaleIcon";
import { NeuterIcon } from "@/components/icons/gender/NeuterIcon";

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


export default function BlockedUsersPage() {
  const { blockedUsers, unblockUser } = useBlockedUsersStore();
  const t = useTranslation();

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-24 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldX className="h-6 w-6" />
                {t('blockedUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blockedUsers.length > 0 ? (
                <div className="space-y-4">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10 bg-muted/50">
                            {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                            ) : null}
                            <AvatarFallback>
                               <GenderAvatar gender={user.gender} />
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unblockUser(user.id)}
                      >
                        {t('unblock')}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('noBlockedUsers')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
