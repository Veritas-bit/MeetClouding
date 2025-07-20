import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LanguagePage() {
  return (
    <div className="container mx-auto p-8 sm:p-12 lg:p-16 pt-8 pb-24 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Язык</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Здесь будет выбор языка приложения.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
