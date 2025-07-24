
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const AUTO_THEME_INTERVAL = 1000 * 60 * 5; // Check every 5 minutes

function AutoThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, systemTheme, setTheme } = useNextTheme();

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        let interval: NodeJS.Timeout | undefined;

        const applyAutoTheme = () => {
            const hour = new Date().getHours();
            let newTheme: string;

            if (hour >= 5 && hour < 9) {
                newTheme = 'light'; // Утро
            } else if (hour >= 9 && hour < 17) {
                newTheme = 'early-morning'; // День
            } else if (hour >= 17 && hour < 21) {
                newTheme = 'evening'; // Вечер
            } else {
                newTheme = 'dark'; // Ночь
            }
            
            // Set theme using next-themes' setTheme function
            // to ensure context is updated correctly across the app.
            setTheme(newTheme);
        };

        if (theme === 'auto') {
            applyAutoTheme();
            interval = setInterval(applyAutoTheme, AUTO_THEME_INTERVAL);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [theme, setTheme]);

    return <>{children}</>;
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
      <NextThemesProvider {...props} themes={['light', 'dark', 'system', 'early-morning', 'evening', 'auto']}>
          <AutoThemeProvider>{children}</AutoThemeProvider>
      </NextThemesProvider>
  )
}
