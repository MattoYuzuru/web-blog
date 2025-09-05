'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from '@/contexts/ThemeContext';

export default function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-violet-500 hover:bg-opacity-50 dark:hover:bg-violet-700 dark:hover:bg-opacity-50"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-white dark:text-violet-300"/>
            ) : (
                <Sun className="h-5 w-5 text-yellow-300 dark:text-yellow-200"/>
            )}
        </button>
    );
}