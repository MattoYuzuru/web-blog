import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            KeykoMI Lib
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Блог о моей жизни, учебе, карьере...
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Contact
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="mailto:matveyryabushkin@gmail.com"
                                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                <span>matveyryabushkin@gmail.com</span>
                            </a>
                            <a
                                href="https://t.me/Keyko_Mi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                <Send className="h-4 w-4" />
                                <span>@Keyko_Mi</span>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Quick Links
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/privacy"
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} KeykoMI Lib. All rights reserved. Built with Next.js and Spring.
                    </p>
                </div>
            </div>
        </footer>
    );
}