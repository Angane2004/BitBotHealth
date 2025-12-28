'use client';

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center space-y-6 p-8">
                        <h1 className="text-9xl font-bold text-black">500</h1>
                        <h2 className="text-2xl font-semibold text-black">Something went wrong</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            An error occurred. Please try again.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
