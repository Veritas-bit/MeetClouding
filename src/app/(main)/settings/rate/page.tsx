
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RatePage() {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-8 sm:p-12 lg:p-16 pt-8 pb-24 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Оценить приложение</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p>Здесь будет предложено оценить приложение.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
