import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SplashWrapper from '@/components/splash-wrapper'

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FLOVA - Service Bottleneck Detection System",
  description:
    "Analyze multi-stage service flows, identify bottlenecks, and optimize your operations with real-time analytics.",
  keywords: ["bottleneck detection", "service analytics", "queue management", "operations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col font-poppins antialiased" suppressHydrationWarning>
        <SplashWrapper />
        {children}
      </body>
    </html>
  );
}
