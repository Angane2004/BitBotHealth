import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-transparent">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-white/60 dark:from-black/60 dark:via-black/50 dark:to-black/70" />
            </div>
            <div className="relative z-10 flex items-center justify-center px-4 py-16">
                <Card className="glass-panel border border-black/5 dark:border-white/5 w-full max-w-md p-8 space-y-8">
                    <Link href="/" className="flex items-center justify-center">
                        <Logo size="small" />
                    </Link>
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-semibold text-black dark:text-white">Create account</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            AI-Powered Hospital Demand Forecasting
                        </p>
                    </div>
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "mx-auto w-full",
                                card: "shadow-none border border-black/5 dark:border-white/10 backdrop-blur-sm bg-white/90 dark:bg-black/50 rounded-2xl",
                            }
                        }}
                    />
                </Card>
            </div>
        </div>
    );
}
