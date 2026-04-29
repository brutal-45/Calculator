import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculator",
  description: "A powerful scientific calculator with exact form detection, persistent history, keyboard support, and comprehensive reference tables. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["calculator", "scientific calculator", "math", "trigonometry", "calculator app", "brutaltools"],
  authors: [{ name: "BrutalTools", url: "https://github.com/brutal-45" }],
  icons: {
    icon: "icon.svg",
    apple: "apple-touch-icon.svg",
  },
  openGraph: {
    title: "Calculator",
    description: "A beautiful scientific calculator with exact form detection and reference tables.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
