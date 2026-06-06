import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaRegistrar from "@/components/pwa-registrar";
import SplashScreen from "@/components/splash-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "EduFlow — Transform YouTube Into Structured Courses",
  description:
    "AI-powered learning platform that transforms YouTube playlists and channels into structured courses with notes, quizzes, flashcards, and progress tracking.",
  keywords: ["learning", "youtube", "courses", "AI", "education", "flashcards", "quizzes"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduFlow",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegistrar />
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
