
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
            let newThemeClass = 'light';

            if (hour >= 5 && hour < 9) {
                newThemeClass = 'light'; // Утро
            } else if (hour >= 9 && hour < 17) {
                newThemeClass = 'early-morning'; // День
            } else if (hour >= 17 && hour < 21) {
                newThemeClass = 'evening'; // Вечер
            } else {
                newThemeClass = 'dark'; // Ночь
            }
            
            // This sets the class on the HTML element for CSS to pick up.
            const doc = document.documentElement;
            doc.classList.remove('light', 'dark', 'early-morning', 'evening');
            doc.classList.add(newThemeClass);
        };

        if (theme === 'auto') {
            applyAutoTheme();
            interval = setInterval(applyAutoTheme, AUTO_THEME_INTERVAL);
        } else {
             // When theme is not 'auto', let next-themes handle it.
             // We just need to remove our custom auto classes.
             const doc = document.documentElement;
             if(theme !== 'early-morning' && theme !== 'evening') {
                doc.classList.remove('early-morning', 'evening');
             }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [theme, systemTheme]);

    return <>{children}</>;
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
      <NextThemesProvider {...props} themes={['light', 'dark', 'system', 'early-morning', 'evening', 'auto']}>
          <AutoThemeProvider>{children}</AutoThemeProvider>
      </NextThemesProvider>
  )
}
