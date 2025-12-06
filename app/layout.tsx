import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingDock } from '@/components/ui/floating-dock';
import { IconShoppingCart, IconSearch, IconHome, IconUser } from "@tabler/icons-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamestores app",
  description: "Gamestores ecommerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dockItems = [
    { title: "Home", icon: <IconHome className="w-5 h-5" />, href: "/" },
    { title: "Search", icon: <IconSearch className="w-5 h-5" />, href: "/search" },
    { title: "Cart", icon: <IconShoppingCart className="w-5 h-5" />, href: "/cart" },
    { title: "Account", icon: <IconUser className="w-5 h-5" />, href: "/account" },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="lg:p-6 p-2">{children}</main>
        
        {/* Floating Dock - fixed at bottom center */}
        <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <FloatingDock items={dockItems} />
          </div>
        </div>
      </body>
    </html>
  );
}
