'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AggiungiEvento() {
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Inizia su true per il check sicurezza
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    price: '',
    image_url: '',
    category: 'Techno',
  })

  // --- SICUREZZA: Controllo Ruolo ---
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'pr') {
        router.push('/') // Rimbalza i Clubber alla Home
      } else {
        setLoading(false) // Solo se è PR permette di vedere il form
      }
    }
    checkRole()
  }, [router])

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
      return { lat: 45.4642, lng: 9.1900 } 
    } catch (error) {
      return { lat: 45.4642, lng: 9.1900 }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const coords = await getCoordinates(formData.location)

    const { error } = await supabase.from('Events').insert([
      { 
        ...formData,
        price: parseFloat(formData.price),
        lat: coords.lat,
        lng: coords.lng,
        date: new Date(formData.date).toISOString()
      }
    ])

    if (error) {
      alert("Errore: " + error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  // Se sta controllando il ruolo, mostriamo un caricamento nero
  if (loading && formData.title === '') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
        
        {/* COLONNA FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-zinc-900/30 p-8 md:p-12 rounded-[3rem] border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-8 bg-[#ccff00]" />
            <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase">Crea Esperienza</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Titolo Evento</label>
              <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all italic font-bold"
                placeholder="es. UNDERGROUND RAVE" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Data e Ora</label>
              <input type="datetime-local" required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all color-scheme-dark"
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Indirizzo o Nome Locale</label>
            <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all"
              placeholder="es. Via Gaudenzio Ferrari 1, Milano" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Descrizione</label>
            <textarea required rows={4} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all resize-none text-sm"
              placeholder="Descrivi l'evento..." onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">URL Immagine Cover</label>
              <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all"
                placeholder="https://..." onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Categoria</label>
              <select className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] text-white"
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Techno">TECHNO</option>
                <option value="House">HOUSE</option>
                <option value="Reggaeton">REGGAETON</option>
                <option value="Hip Hop">HIP HOP</option>
                <option value="Gala">GALA</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Prezzo Ingresso (€)</label>
            <input type="number" required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-[#ccff00] font-black text-xl"
              placeholder="30" onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-[#ccff00] text-black font-black py-6 rounded-[2rem] uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 mt-4">
            {loading ? 'CARICAMENTO...' : 'PUBBLICA ORA'}
          </button>
        </form>

        {/* COLONNA ANTEPRIMA */}
        <div className="lg:col-span-5 hidden lg:block sticky top-32">
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.4em] ml-6">Live Preview</p>
            <div className="relative group w-full aspect-[4/5] bg-zinc-900 rounded-[3.5rem] overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover opacity-70 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12 space-y-4">
                    <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">{formData.title || "TITOLO"}</h2>
                    <div className="flex justify-between items-end pt-4 border-t border-white/10">
                       <p className="text-white font-bold uppercase text-[10px] tracking-widest">{formData.location || "LOCATION"}</p>
                       <p className="text-[#ccff00] font-black text-3xl italic">{formData.price ? `€${formData.price}` : "€--"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-12 text-zinc-600 font-black uppercase italic text-lg">Incolla URL Immagine</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}