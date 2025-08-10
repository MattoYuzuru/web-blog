import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {ThemeProvider} from '@/contexts/ThemeContext';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'KeykoMI Lib - Life Tech Travel',
    description: 'Блог о жизни, айтишке и путешествиях.',
    keywords: ['programming', 'life', 'tech', 'blog', 'travel'],
    authors: [{name: 'KeykoMI'}],
    viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
                <Header/>
                <main className="flex-1">
                    {children}
                </main>
                <Footer/>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}