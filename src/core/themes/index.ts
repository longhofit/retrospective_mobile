import { default as appTheme } from './appTheme.json';
import { ThemeType } from '@kitten/theme';

interface ThemeRegistry {
  ['App Theme']: ThemeType;
}

export type ThemeKey = keyof ThemeRegistry;

export const themes: ThemeRegistry = {
  'App Theme': appTheme,
};

export {
  ThemeContext,
  ThemeContextType,
} from './themeContext';

export { ThemeStore } from './theme.store';
export { ThemeService } from './theme.service';
