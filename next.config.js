/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'api.openweathermap.org'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.clerk.com',
            },
        ],
    },
    reactStrictMode: true,
    output: 'standalone',
};

module.exports = nextConfig;
