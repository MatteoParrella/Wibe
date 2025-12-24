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
    <html lang="it" className="bg-black"> {/* Forza il nero qui */}
      <body className="bg-black antialiased text-white">
        <Navbar />
        {/* Assicurati che non ci siano margini bianchi qui */}
        <main className="min-h-screen bg-black">
          {children}
        </main>
      </body>
    </html>
  )
}