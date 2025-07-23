
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const faqItems = [
    {
        question: "Как создать 'облачко' с желанием?",
        answer: <p className="text-muted-foreground">На главном экране нажмите большую кнопку 'Найти компанию'. Вы сможете выбрать готовое желание из предложенных или написать свой собственный вариант. После этого выберите подходящую категорию и опубликуйте ваше 'облачко' на карте.</p>
    },
    {
        question: "Как найти компанию для своего желания?",
        answer: <p className="text-muted-foreground">Когда ваше желание-облачко появится на карте, другие пользователи смогут его увидеть. Если кто-то захочет присоединиться, он сможет откликнуться, и у вас начнется с ним чат. Также вы можете сами искать 'облачка' других пользователей через меню 'Поиск облачков'.</p>
    },
    {
        question: "Что происходит после того, как я нашел компанию?",
        answer: <p className="text-muted-foreground">Когда кто-то откликается на ваше желание (или вы на чужое), в разделе 'Чаты' создается новый диалог. Там вы можете обсудить все детали: время, место встречи и другие подробности.</p>
    },
    {
        question: "Как редактировать свой профиль?",
        answer: <p className="text-muted-foreground">Перейдите в раздел 'Настройки' (иконка шестеренки в нижнем меню), а затем нажмите на пункт 'Профиль'. Вы сможете изменить свой никнейм, фото и информацию о себе.</p>
    },
    {
        question: "Как связаться с поддержкой?",
        answer: (
            <div className="flex flex-col items-start gap-4">
                <p className="text-muted-foreground">По всем вопросам, связанным с работой приложения, вы можете написать в чат поддержки.</p>
                <Link href="/chats/support" className="w-full">
                    <Button className="w-full sm:w-auto">Написать в поддержку</Button>
                </Link>
            </div>
        )
    }
]

export default function HelpPage() {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-24 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Помощь и Частые вопросы</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>
                            {item.answer}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
