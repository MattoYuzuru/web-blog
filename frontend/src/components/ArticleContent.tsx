import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ArticleContentProps {
    content: string;
}

export default function ArticleContent({content}: ArticleContentProps) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({children}) => (
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                            {children}
                        </h1>
                    ),
                    h2: ({children}) => (
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-8">
                            {children}
                        </h2>
                    ),
                    h3: ({children}) => (
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
                            {children}
                        </h3>
                    ),
                    p: ({children}) => (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {children}
                        </p>
                    ),
                    code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="relative">
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
                            </div>
                        ) : (
                            <code
                                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                    blockquote: ({children}) => (
                        <blockquote
                            className="border-l-4 border-violet-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
                            {children}
                        </blockquote>
                    ),
                    ul: ({children}) => (
                        <ul className="list-disc list-inside mb-4 space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({children}) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2">
                            {children}
                        </ol>
                    ),
                    li: ({children}) => (
                        <li className="text-gray-700 dark:text-gray-300">
                            {children}
                        </li>
                    ),
                    a: ({href, children}) => (
                        <a
                            href={href}
                            className="text-violet-600 dark:text-violet-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    table: ({children}) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({children}) => (
                        <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left font-semibold">
                            {children}
                        </th>
                    ),
                    td: ({children}) => (
                        <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}