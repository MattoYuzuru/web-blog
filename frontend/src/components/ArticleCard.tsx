import Link from 'next/link';
import Image from 'next/image';
import {Article} from '@/types';
import {formatDate, formatReadCount} from '@/lib/utils';
import {Calendar, Eye} from 'lucide-react';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({article}: ArticleCardProps) {
    return (
        <article
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Image */}
            <Link href={`/api/articles/${article.id}`} className="block">
                <div className="relative h-48 w-full">
                    <Image
                        src={article.image_url || '/placeholder-article.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <Link href={`/api/articles/${article.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-3 line-clamp-2">
                        {article.title}
                    </h3>
                </Link>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4"/>
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4"/>
                            <span>{formatReadCount(article.read_count)}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-xs font-medium rounded-full"
                        >
              #{tag}
            </span>
                    ))}
                </div>
            </div>
        </article>
    );
}