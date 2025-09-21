// FIX: Implemented useTheme hook to consume ThemeContext.
import { useThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  return useThemeContext();
};
