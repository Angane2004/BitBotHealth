import { Activity } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-ping"></div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                            <Activity className="h-10 w-10 text-white" />
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <p className="text-lg font-medium text-muted-foreground animate-pulse">
                    Loading dashboard...
                </p>

                {/* Loading Dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
