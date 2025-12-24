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
    // Recupera la sessione attuale al caricamento
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Resta in ascolto di cambiamenti (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-[#ccff00] font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
          WIBE
        </Link>
        
        <div className="flex gap-6 items-center">
          {/* LINK EVENTI */}
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-[#ccff00] transition-colors">
            Eventi
          </Link>
          
          {/* TASTO PUBBLICA (visibile a tutti, ma protetto dal middleware) */}
          <Link 
            href="/aggiungi-evento" 
            className="bg-[#ccff00] text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            + Pubblica
          </Link>

          {/* SEZIONE UTENTE / LOGIN */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Profile</span>
                <span className="text-xs font-medium text-white">{user.email?.split('@')[0]}</span>
              </div>
              
              {/* AVATAR CIRCULAR */}
              <div className="group relative w-10 h-10 bg-gradient-to-tr from-[#ccff00] to-green-500 rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg cursor-pointer">
                {user.email?.[0].toUpperCase()}
                
                {/* MENU DROP DOWN LOGOUT (al passaggio del mouse o semplice click) */}
                <button 
                  onClick={handleLogout}
                  className="absolute -bottom-10 right-0 bg-red-600 text-white text-[10px] px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-bold text-[#ccff00] border border-[#ccff00] px-4 py-2 rounded-full hover:bg-[#ccff00] hover:text-black transition-all">
              Accedi
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}