import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeSelector } from "@/components/ThemeSelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Club Content Flow",
  description: "Generate club social media content and promotional materials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
              <div className="container flex h-14 items-center">
                <h1 className="mr-auto text-xl font-bold">Club Content Flow</h1>
                <div className="ml-auto flex items-center space-x-2">
                  <ThemeSelector />
                </div>
              </div>
            </header>
            <main className="container py-6">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
