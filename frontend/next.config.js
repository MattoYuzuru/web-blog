/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/:path*`,
            },
        ];
    },
    // Удалите experimental.appDir если используете App Router (он уже стабильный в Next.js 14)

    // Добавьте обработку статических файлов
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

    // Для разработки
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    }
};

module.exports = nextConfig;