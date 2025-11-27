import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-md p-8">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        SwasthyaSense
                    </span>
                </Link>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                    <p className="text-muted-foreground">
                        Start predicting hospital demand surges today
                    </p>
                </div>

                {/* Clerk Sign Up */}
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-2xl border-2",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                        }
                    }}
                    signInUrl="/login"
                    forceRedirectUrl="/dashboard"
                />

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
