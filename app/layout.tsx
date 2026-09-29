import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopFlow — Modern. Clean. Premium.",
    template: "%s | ShopFlow",
  },
  description:
    "ShopFlow — a modern e-commerce platform with curated products, seamless checkout, and a premium shopping experience.",
  keywords: ["shopping", "ecommerce", "premium", "fashion", "electronics", "deals"],
  openGraph: {
    type: "website",
    siteName: "ShopFlow",
    title: "ShopFlow — Modern. Clean. Premium.",
    description: "Curated essentials. Simple shopping experience.",
  },
};

import { QueryProvider } from "@/lib/providers/query-provider";
import { ChatWidget } from "@/components/ai/ChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-inter, var(--font-sans))" }}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <ChatWidget />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      fontFamily: "var(--font-inter, var(--font-sans))",
                      fontSize: "14px",
                      borderRadius: "10px",
                    },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
