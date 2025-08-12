'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { PlusCircle, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <header className="bg-violet-600 dark:bg-violet-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.svg"
                            alt="KeykoMI Logo"
                            width={40}
                            height={40}
                            className="h-10 w-auto"
                        />
                        <div>
                            <h1 className="text-xl font-bold">KeykoMI Lib</h1>
                            <p className="text-xs text-violet-200">Life Blog</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && (
                            <Link
                                href="/article/new"
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 transition-colors"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span className="hidden sm:block">Новая Статья</span>
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-violet-500 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-violet-500 transition-colors"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:block">Login</span>
                            </Link>
                        )}

                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}