'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/hooks/useAdmin';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAdminStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(pin);

        if (success) {
            toast.success('Access Granted', {
                description: 'Welcome to the admin dashboard',
            });
            router.push('/admin/dashboard');
        } else {
            toast.error('Access Denied', {
                description: 'Invalid PIN. Please try again.',
            });
            setPin('');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            <div className="w-full max-w-md relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-2 border-black dark:border-white bg-white dark:bg-black shadow-2xl">
                        <CardHeader className="text-center space-y-4 pb-8">
                            <motion.div
                                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Shield className="h-10 w-10 text-white" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-3xl font-bold text-black dark:text-white">
                                    Admin Access
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                                    Enter your PIN to access the admin dashboard
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            type="password"
                                            placeholder="Enter 4-digit PIN"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.slice(0, 4))}
                                            maxLength={4}
                                            className="pl-11 h-14 text-center text-2xl tracking-widest border-2 border-black dark:border-white focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all"
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        Hint: Default PIN is 1122
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200 hover:scale-[1.02] active:scale-95"
                                    disabled={isLoading || pin.length !== 4}
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Lock className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-5 w-5" />
                                            Unlock Admin Panel
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
                                    Secure Admin Authentication
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.p
                    className="text-center text-sm text-gray-500 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Protected by PIN authentication • 120fps smooth animations
                </motion.p>
            </div>
        </div>
    );
}
