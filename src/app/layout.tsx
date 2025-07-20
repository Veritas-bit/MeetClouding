import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { LocationProvider } from '@/lib/location-provider';


export const metadata: Metadata = {
  title: 'MeetCloud',
  description: 'Найди компанию своему желанию',
};

const nunito = Nunito({
  subsets: ['cyrillic'],
  display: 'swap',
  variable: '--font-nunito',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cn("font-sans antialiased", nunito.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocationProvider>
            {children}
          </LocationProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
