
"use client";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, LoaderCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore, type Gender } from "@/lib/profile-store";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { maleNicknames, femaleNicknames, neutralNicknames } from "@/lib/nicknames";
import { useTranslation } from "@/hooks/use-translation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MaleIcon } from "@/components/icons/gender/MaleIcon";
import { FemaleIcon } from "@/components/icons/gender/FemaleIcon";
import { NeuterIcon } from "@/components/icons/gender/NeuterIcon";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function EditProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation();

  const { 
    nickname: storeNickname, 
    about: storeAbout, 
    gender: storeGender, 
    avatar: storeAvatar,
    setProfile,
   } = useProfileStore();

  const [nickname, setNickname] = useState(storeNickname || '');
  const [about, setAbout] = useState(storeAbout || '');
  const [gender, setGender] = useState<Gender>(storeGender || 'unselected');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(storeAvatar);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tgNick = searchParams.get('nickname');
    const tgPhoto = searchParams.get('photo');
    if (tgNick) {
      setNickname(tgNick);
    }
    if (tgPhoto) {
      setAvatarPreview(decodeURIComponent(tgPhoto));
    }
  }, [searchParams]);

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "male", label: t('genderMaleLabel') },
    { value: "female", label: t('genderFemaleLabel') },
    { value: "unselected", label: t('genderUnselectedLabel') },
  ];

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
        event.target.value = "";
    }
  };

  const handleGenerateNickname = () => {
    setIsGenerating(true);
    let nicknamePool: string[];

    switch (gender) {
        case "male":
            nicknamePool = maleNicknames;
            break;
        case "female":
            nicknamePool = femaleNicknames;
            break;
        default:
            nicknamePool = [...maleNicknames, ...femaleNicknames, ...neutralNicknames];
            break;
    }

    const randomIndex = Math.floor(Math.random() * nicknamePool.length);
    const randomNickname = nicknamePool[randomIndex];
    
    // Simulate a short delay to show the loading animation
    setTimeout(() => {
        setNickname(randomNickname);
        setIsGenerating(false);
    }, 300);
  };

  const handleSaveChanges = () => {
    // Prevent double-clicks
    if (isSaving) return;
    setIsSaving(true);
    
    // Check if it's the first time saving the profile (i.e., no nickname was stored before)
    const isFirstSave = !storeNickname;

    setProfile({
      nickname,
      about,
      gender,
      avatar: avatarPreview || '',
    });

    toast({
      title: t('profileSavedTitle'),
      description: t('profileSavedDescription'),
    });
    
    // Redirect to main page on first save, otherwise back to settings
    if (isFirstSave) {
      router.push('/main');
    } else {
      router.push('/settings');
    }
  };
  
  const selectedGenderLabel = genderOptions.find(opt => opt.value === gender)?.label || t('selectGenderPlaceholder');

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 flex flex-col items-center pb-24">
        <div className="relative mb-2">
          <Avatar className="h-20 w-20 border-4 border-background bg-muted/50">
              {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="User Avatar" />
              ) : null}
              <AvatarFallback>
                  <GenderAvatar gender={gender} />
              </AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <button
          onClick={handleAvatarChangeClick}
          className="text-sm text-primary active:underline mb-4"
        >
          {t('changePhoto')}
        </button>

        <div className="w-full max-w-md">
          <Card className="bg-card/50">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">{t('nicknameLabel')}</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('nicknamePlaceholder')}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleGenerateNickname}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {t('generate')}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">{t('aboutLabel')}</Label>
                <Textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={t('aboutPlaceholder')}
                  rows={3}
                  className="resize-none min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('yourGenderLabel')}</Label>
                <Collapsible open={isGenderOpen} onOpenChange={setIsGenderOpen} className="relative">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedGenderLabel}
                      <span className="text-muted-foreground">...</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="absolute bottom-full mb-2 w-full z-50">
                      <Card className="mt-2">
                          <CardContent className="p-2 space-y-1">
                            {genderOptions.map((option) => (
                              <Button
                                  key={option.value}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    setGender(option.value);
                                    setIsGenderOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", gender === option.value ? "opacity-100" : "opacity-0")} />
                                  {option.label}
                                </Button>
                            ))}
                          </CardContent>
                      </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <Button className="w-full" size="lg" onClick={handleSaveChanges} disabled={isSaving || !nickname}>
                  {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {t('saveChanges')}
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
