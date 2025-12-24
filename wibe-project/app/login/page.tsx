'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('clubber') // Default

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: role } }
    })
    if (error) alert(error.message)
    else alert('Controlla la tua email per confermare la registrazione!')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
        WIBE LOGIN
      </h1>
      <div className="w-full max-w-sm space-y-4">
        <input 
          type="email" placeholder="Email" 
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <select 
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg outline-none"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="clubber">Sono un Clubber</option>
          <option value="pr">Sono un PR</option>
        </select>

        <button onClick={handleLogin} className="w-full p-3 bg-white text-black font-bold rounded-lg hover:bg-purple-500 hover:text-white transition">
          ACCEDI
        </button>
        <button onClick={handleSignUp} className="w-full p-3 border border-purple-500 text-purple-500 font-bold rounded-lg hover:bg-purple-500 hover:text-white transition">
          REGISTRATI
        </button>
      </div>
    </div>
  )
}