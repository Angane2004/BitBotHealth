import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />
                <div className="absolute top-10 right-10 h-32 w-32 rounded-full border border-black/10 dark:border-white/10" style={{ animation: 'orbital-glow 16s linear infinite' }} />
            </div>

            {/* Admin Button - Bottom Left */}
            <div className="fixed bottom-8 left-8 z-50">
                <Link href="/admin/login">
                    <Button
                        variant="outline"
                        size="lg"
                        className="group border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black transition-all duration-300 shadow-xl gap-2"
                    >
                        <div className="p-1 rounded-md bg-black dark:bg-white group-hover:bg-white dark:group-hover:bg-black transition-colors">
                            <Shield className="h-4 w-4 text-white dark:text-black group-hover:text-black dark:group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-semibold">Admin Access</span>
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center px-4 py-16 min-h-screen">
                <Card className="border-2 border-black dark:border-white bg-white dark:bg-black w-full max-w-md p-8 space-y-8 shadow-2xl">
                    <Link href="/" className="flex flex-col items-center gap-3">
                        <Logo size="small" />
                        <p className="text-sm uppercase tracking-[0.45em] text-gray-500 dark:text-gray-400">Command Login</p>
                    </Link>
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-semibold text-black dark:text-white">Welcome back</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sign in to access your hospital dashboard
                        </p>
                    </div>
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "mx-auto w-full",
                                card: "shadow-none border-2 border-black dark:border-white bg-white dark:bg-black rounded-2xl",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                formButtonPrimary: "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black",
                                formFieldInput: "border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white",
                                footerActionLink: "text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300",
                            }
                        }}
                        signUpUrl="/signup"
                        forceRedirectUrl="/dashboard"
                    />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        New here?{" "}
                        <Link href="/signup" className="underline underline-offset-4 hover:text-black dark:hover:text-white font-medium">
                            Create an account
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
