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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        
        {/* Usiamo il componente Navbar che abbiamo creato prima */}
        <Navbar />

        {/* IL CONTENUTO DELLE PAGINE */}
        <main className="min-screen">
          {children}
        </main>

      </body>
    </html>
  );
}