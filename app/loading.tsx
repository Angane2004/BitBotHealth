import { Activity } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-ping"></div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                            <Activity className="h-12 w-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    SwasthyaSense
                </h2>
                <p className="text-muted-foreground animate-pulse">
                    Loading hospital intelligence...
                </p>

                {/* Loading Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
