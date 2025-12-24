import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'; // Importazione corretta

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
        
        {/* NAVBAR FISSA IN ALTO */}
        <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-[#ccff00] font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
              WIBE
            </Link>
            
            <div className="flex gap-6 items-center">
              <Link href="/" className="text-sm font-medium hover:text-[#ccff00] transition-colors">
                Eventi
              </Link>
              <Link 
                href="/aggiungi-evento" 
                className="bg-[#ccff00] text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                + Pubblica
              </Link>
            </div>
          </div>
        </nav>

        {/* IL CONTENUTO DELLE PAGINE (HOME O AGGIUNGI EVENTO) */}
        {children}

      </body>
    </html>
  );
}