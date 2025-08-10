'use client';

import { useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import ArticleContent from './ArticleContent';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${
                        activeTab === 'write'
                            ? 'text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-700 border-b-2 border-violet-600 dark:border-violet-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    <Edit className="h-4 w-4" />
                    <span>Write</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${
                        activeTab === 'preview'
                            ? 'text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-700 border-b-2 border-violet-600 dark:border-violet-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'write' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder || "Write your article in Markdown..."}
                        className="w-full h-[400px] p-4 border-none resize-none focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace' }}
                    />
                ) : (
                    <div className="p-4 bg-white dark:bg-gray-700 min-h-[400px]">
                        {value.trim() ? (
                            <ArticleContent content={value} />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">
                                Nothing to preview. Start writing in the Write tab.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Markdown Help */}
            {activeTab === 'write' && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Markdown tips:</span>
                    <span className="ml-2">
            **bold** *italic* `code` [link](url) # heading ## subheading - list item > quote
          </span>
                </div>
            )}
        </div>
    );
}