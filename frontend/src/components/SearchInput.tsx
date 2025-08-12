'use client';

import {Search} from 'lucide-react';
import {useState} from 'react';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchInput({onSearch, placeholder = "Найти статью..."}: SearchInputProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400"/>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 dark:text-gray-100"
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <div
                        className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md text-white font-medium transition-colors">
                        Искать
                    </div>
                </button>
            </div>
        </form>
    );
}