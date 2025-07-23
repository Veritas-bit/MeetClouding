
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const notificationSettings = [
  { id: "new-messages", label: "Новые сообщения в чатах" },
  { id: "new-responses", label: "Отклики на ваши желания" },
  { id: "friend-requests", label: "Запросы в друзья"},
  { id: "nearby-wishes", label: "Новые 'облачка' рядом с вами" },
  { id: "special-offers", label: "Специальные предложения и акции" },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    "new-messages": true,
    "new-responses": true,
    "friend-requests": true,
    "nearby-wishes": false,
    "special-offers": true,
  });

  const handleToggle = (id: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-24 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Управление уведомлениями</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationSettings.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between space-x-2 py-2">
                      <Label htmlFor={item.id} className="font-normal flex-1 cursor-pointer">
                        {item.label}
                      </Label>
                      <Switch
                        id={item.id}
                        checked={settings[item.id as keyof typeof settings]}
                        onCheckedChange={() => handleToggle(item.id as keyof typeof settings)}
                      />
                    </div>
                    {index < notificationSettings.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
