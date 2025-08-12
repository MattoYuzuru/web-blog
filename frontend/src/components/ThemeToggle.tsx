'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-violet-100 dark:hover:bg-violet-900"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            ) : (
                <Sun className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            )}
        </button>
    );
}