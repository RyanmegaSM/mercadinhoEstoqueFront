import { useTheme } from '@/hooks/useTheme';
import { ThemeContext } from './theme-context-value';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeUtils = useTheme();

  return (
    <ThemeContext.Provider value={themeUtils}>
      {children}
    </ThemeContext.Provider>
  );
}