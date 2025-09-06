'use client';

import {useState, useRef} from 'react';
import {Eye, Edit} from 'lucide-react';
import ArticleContent from './ArticleContent';
import {apiClient} from "@/lib/api";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function MarkdownEditor({value, onChange, placeholder}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function uploadFile(file: File): Promise<string | null> {
        try {
            const response = await apiClient.uploadImage(file);

            if (response.success && response.data?.url) {
                return response.data.url;
            } else {
                alert(response.message || "Ошибка загрузки файла");
                return null;
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert("Ошибка загрузки файла");
            return null;
        }
    }

    function insertAtCursor(text: string) {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + text + value.substring(end);
        onChange(newValue);

        // Восстанавливаем позицию курсора
        setTimeout(() => {
            const newPosition = start + text.length;
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
        }, 0);
    }

    async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === "file") {
                e.preventDefault();
                const file = item.getAsFile();
                if (!file) return;

                const url = await uploadFile(file);
                if (url) {
                    insertAtCursor(`![image](${url})`);
                }
            }
        }
    }

    async function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const url = await uploadFile(file);
                if (url) {
                    insertAtCursor(`![image](${url})\n`);
                }
            }
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        // Добавляем визуальную обратную связь при перетаскивании
        e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
    }

    function handleDragLeave(e: React.DragEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        // Убираем визуальную обратную связь
        e.currentTarget.style.backgroundColor = '';
    }

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
                    <Edit className="h-4 w-4"/>
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
                    <Eye className="h-4 w-4"/>
                    <span>Preview</span>
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onPaste={handlePaste}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        placeholder={placeholder || "Write your article in Markdown... Paste or drag images to upload"}
                        className="w-full h-[400px] p-4 border-none resize-none focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        style={{fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace'}}
                    />
                ) : (
                    <div className="p-4 bg-white dark:bg-gray-700 min-h-[400px]">
                        {value.trim() ? (
                            <ArticleContent content={value}/>
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
                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <span className="font-medium">Markdown tips:</span>
                            <span className="ml-2">
                                **bold** *italic* `code` [link](url) # heading ## subheading - list item {'>'} quote
                            </span>
                        </div>
                        <div className="text-violet-600 dark:text-violet-400 font-medium">
                            📎 Drag & drop or paste images to upload
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}