import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Importiamo la Navbar dinamica

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WIBE | Exclusive Events",
  description: "Il futuro della notte",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="bg-black">
      <body className="bg-black antialiased text-white">
        <Navbar />
        <main className="min-h-screen bg-black">
          {children}
        </main>
      </body>
    </html>
  )
}