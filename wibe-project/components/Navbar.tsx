'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    /* MODIFICA 1: z-[100] per stare sopra la mappa e fixed invece di sticky per evitare buchi bianchi */
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-[#ccff00] font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
          WIBE
        </Link>
        
        <div className="flex gap-6 items-center">
          {/* LINK EVENTI */}
          <Link href="/" className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-[#ccff00] transition-colors">
            Eventi
          </Link>
          
          {/* TASTO PUBBLICA */}
          <Link 
            href="/aggiungi-evento" 
            className="bg-[#ccff00] text-black px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)]"
          >
            + Pubblica
          </Link>

          {/* SEZIONE UTENTE / LOGIN */}
          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-zinc-800/50">
              <Link href="/profile" className="hidden md:flex flex-col items-end group cursor-pointer">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] group-hover:text-[#ccff00] transition-colors">Member</span>
                <span className="text-xs font-bold text-white group-hover:text-zinc-300 transition-colors lowercase italic">{user.email?.split('@')[0]}</span>
              </Link>
              
              {/* AVATAR */}
              <div className="relative group">
                <Link 
                  href="/profile"
                  className="w-11 h-11 bg-gradient-to-tr from-[#ccff00] to-green-400 rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg hover:scale-105 transition-all active:scale-95 border-2 border-transparent hover:border-white/20"
                >
                  {user.email?.[0].toUpperCase()}
                </Link>
                
                {/* MENU DROP DOWN LOGOUT */}
                <button 
                  onClick={handleLogout}
                  className="absolute -bottom-12 right-0 bg-white text-black text-[10px] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-black uppercase tracking-tighter hover:bg-[#ccff00] whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] border border-[#ccff00]/30 px-6 py-2.5 rounded-full hover:bg-[#ccff00] hover:text-black transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}