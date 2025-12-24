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
    e.preventDefault() // Evita che il click propaghi al link del profilo
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
          
          {/* TASTO PUBBLICA */}
          <Link 
            href="/aggiungi-evento" 
            className="bg-[#ccff00] text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            + Pubblica
          </Link>

          {/* SEZIONE UTENTE / LOGIN */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
              {/* Link testuale al profilo */}
              <Link href="/profile" className="flex flex-col items-end group cursor-pointer">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest group-hover:text-[#ccff00] transition-colors">Il mio Profilo</span>
                <span className="text-xs font-medium text-white group-hover:text-zinc-300 transition-colors">{user.email?.split('@')[0]}</span>
              </Link>
              
              {/* AVATAR CLICCABILE */}
              <div className="relative group">
                <Link 
                  href="/profile"
                  className="w-10 h-10 bg-gradient-to-tr from-[#ccff00] to-green-500 rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                >
                  {user.email?.[0].toUpperCase()}
                </Link>
                
                {/* MENU DROP DOWN LOGOUT (appare al hover sull'avatar) */}
                <button 
                  onClick={handleLogout}
                  className="absolute -bottom-10 right-0 bg-zinc-900 border border-zinc-800 text-red-500 text-[10px] px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white"
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