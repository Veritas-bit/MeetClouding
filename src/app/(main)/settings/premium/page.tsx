
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/lib/profile-store";
import { useToast } from "@/hooks/use-toast";
import { Gem, CheckCircle } from "lucide-react";

export default function PremiumPage() {
  const { isPremium, setProfile } = useProfileStore();
  const { toast } = useToast();

  const handleGetPremium = () => {
    setProfile({
      isPremium: true,
    });
    toast({
      title: "Поздравляем!",
      description: "Вы получили Премиум-аккаунт.",
    });
  };

  return (
    <div className="container mx-auto p-8 sm:p-12 lg:p-16 pt-8 pb-24 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              Премиум-аккаунт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p className="text-muted-foreground">Разблокируйте все возможности приложения с Премиум-подпиской.</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Расширенный поиск "облачков" по категориям и полу.</li>
                <li>Возможность вручную выбирать категорию для своего желания.</li>
                <li>Уникальный значок в профиле.</li>
                <li>Приоритетная поддержка.</li>
            </ul>

            {isPremium ? (
              <div className="flex items-center justify-center p-4 rounded-md bg-primary/10 text-primary">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-semibold">У вас уже есть Премиум-аккаунт!</p>
              </div>
            ) : (
              <Button onClick={handleGetPremium} className="w-full" size="lg">
                Получить Премиум
              </Button>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
