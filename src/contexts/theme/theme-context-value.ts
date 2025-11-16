import { createContext } from 'react';
import type { Theme } from '@/hooks/useTheme';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);