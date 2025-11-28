import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SwasthyaSense - AI Hospital Demand Forecasting",
  description: "Agentic AI hospital weather forecast that predicts demand surges and produces operational plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  success: 'bg-green-600 text-white border-green-700',
                  error: 'bg-red-600 text-white border-red-700',
                  warning: 'bg-orange-600 text-white border-orange-700',
                  info: 'bg-blue-600 text-white border-blue-700',
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
