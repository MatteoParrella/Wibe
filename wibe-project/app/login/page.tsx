'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('clubber') // Ruolo selezionato nel menu
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // REGISTRAZIONE
  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { role: role } // Salva il ruolo nei metadati di Auth
      }
    })
    
    if (error) {
      alert(error.message)
    } else {
      alert('Registrazione effettuata! Controlla la mail per confermare.')
    }
    setLoading(false)
  }

  // LOGIN CON CONTROLLO RUOLO RIGIDO
  const handleLogin = async () => {
    setLoading(true)
    
    // 1. Tenta il login con le credenziali
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (authError || !user) {
      alert(authError?.message || "Credenziali errate")
      setLoading(false)
      return
    }

    // 2. Recupera il ruolo REALE dal database (tabella profiles)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      alert("Errore nel recupero del profilo. Riprova.")
      setLoading(false)
      return
    }

    // 3. VERIFICA COERENZA: Il ruolo scelto nel select deve coincidere con quello nel DB
    if (profile.role !== role) {
      await supabase.auth.signOut() // Forza il logout se il ruolo è sbagliato
      alert(`Accesso negato: Questo account è registrato come ${profile.role.toUpperCase()}. Seleziona il ruolo corretto per accedere.`)
      setLoading(false)
      return
    }

    // 4. Se tutto è corretto, vai al Radar
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-black mb-10 italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-green-500">
        WIBE LOGIN
      </h1>
      
      <div className="w-full max-w-sm space-y-5 bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-zinc-500">Email Address</label>
          <input 
            type="email" placeholder="nome@esempio.com" 
            className="w-full p-4 bg-black border border-zinc-800 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-zinc-500">Security Key</label>
          <input 
            type="password" placeholder="••••••" 
            className="w-full p-4 bg-black border border-zinc-800 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-zinc-500">Access Mode</label>
          <select 
            className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-[#ccff00] appearance-none cursor-pointer font-bold italic text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="clubber">🕺 SONO UN CLUBBER</option>
            <option value="pr">🔑 SONO UN PR</option>
          </select>
        </div>

        <div className="pt-4 space-y-3">
          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full p-4 bg-[#ccff00] text-black font-black rounded-2xl hover:bg-white transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? 'Verifica in corso...' : 'ACCEDI'}
          </button>
          
          <button 
            onClick={handleSignUp}
            disabled={loading}
            className="w-full p-4 border border-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-xs"
          >
            REGISTRATI
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
        Wibe — Secure Access System
      </p>
    </div>
  )
}