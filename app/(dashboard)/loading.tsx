'use client';

import { Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-6 w-20 h-20 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-20 h-20 border-4 border-gray-200 dark:border-gray-800 rounded-full"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                    <div className="relative flex items-center justify-center h-full">
                        <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center">
                            <Activity className="h-8 w-8 text-white dark:text-black animate-heartbeat" />
                        </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-20 w-20 text-gray-300 dark:text-gray-700 animate-spin" />
                    </div>
                </div>

                {/* Loading Text */}
                <p className="text-lg font-medium text-black dark:text-white animate-pulse">
                    Loading dashboard...
                </p>

                {/* Loading Dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    <motion.div
                        className="w-2 h-2 bg-black dark:bg-white rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-black dark:bg-white rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-black dark:bg-white rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
}
