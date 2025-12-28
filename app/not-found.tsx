'use client';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-black dark:text-white">404</h1>
                <h2 className="text-2xl font-semibold text-black dark:text-white">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                >
                    Return to Dashboard
                </a>
            </div>
        </div>
    );
}
