'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/hooks/useAdmin';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [pin, setPin] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAdminStore();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 4 digits entered
        if (index === 3 && value) {
            const fullPin = newPin.join('');
            if (fullPin.length === 4) {
                handleSubmit(fullPin);
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);

        if (/^\d+$/.test(pastedData)) {
            const newPin = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
            setPin(newPin);

            const nextEmptyIndex = newPin.findIndex(val => !val);
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus();
            } else {
                inputRefs.current[3]?.focus();
                handleSubmit(newPin.join(''));
            }
        }
    };

    const handleSubmit = async (fullPin: string) => {
        setIsLoading(true);

        // Simulate authentication delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(fullPin);

        if (success) {
            toast.success('Access Granted', {
                description: 'Welcome to the admin dashboard',
            });
            router.push('/admin/dashboard');
        } else {
            toast.error('Access Denied', {
                description: 'Invalid PIN. Please try again.',
            });
            setPin(['', '', '', '']);
            inputRefs.current[0]?.focus();
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Minimal background elements */}
            <motion.div
                className="absolute top-20 left-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl"
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
                className="absolute bottom-20 right-20 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl"
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
                                className="mx-auto w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Shield className="h-10 w-10 text-white dark:text-black" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-3xl font-bold text-black dark:text-white">
                                    Admin Access
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                                    Enter your 4-digit PIN code
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* PIN Input Boxes */}
                                <div className="flex gap-3 justify-center">
                                    {pin.map((digit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <input
                                                ref={el => inputRefs.current[index] = el}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                disabled={isLoading}
                                                autoFocus={index === 0}
                                                className="w-16 h-16 text-center text-3xl font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white rounded-xl focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all outline-none disabled:opacity-50"
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Hint: Default PIN is 1122
                                </p>

                                <Button
                                    onClick={() => handleSubmit(pin.join(''))}
                                    className="w-full h-14 text-lg bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200 hover:scale-[1.02] active:scale-95"
                                    disabled={isLoading || pin.some(d => !d)}
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
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
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
