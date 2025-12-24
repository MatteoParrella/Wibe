'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AggiungiEvento() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    image_url: ''
  })

  // Funzione Geocoding
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
        lng: coords.lng
      }
    ])

    if (error) {
      alert("Errore: " + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
        
        {/* COLONNA 1: FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800">
          <h1 className="text-3xl font-black italic text-[#ccff00] tracking-tighter uppercase mb-6">Crea Evento</h1>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Nome</label>
            <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none text-sm"
              placeholder="es. GALA NIGHT" onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Indirizzo / Locale</label>
            <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none text-sm"
              placeholder="es. JustMe Milano" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">URL Immagine</label>
            <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none text-sm"
              placeholder="Incolla link immagine..." onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Prezzo (€)</label>
              <input type="number" required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none"
                placeholder="25" onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <button disabled={loading} className="self-end bg-[#ccff00] text-black font-black h-[58px] rounded-2xl uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50">
              {loading ? 'Processing...' : 'Pubblica'}
            </button>
          </div>
        </form>

        {/* COLONNA 2: ANTEPRIMA LIVE */}
        <div className="hidden lg:block space-y-4">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.3em] ml-4">Live Preview</h2>
          <div className="relative group w-full h-[500px] bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-800 flex items-center justify-center">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover opacity-60" 
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Invalid+Link'}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <p className="text-[#ccff00] font-black text-4xl italic uppercase tracking-tighter">{formData.title || "Tuo Titolo"}</p>
                  <p className="text-white/60 uppercase text-xs font-bold mt-2">{formData.location || "Location"}</p>
                </div>
              </>
            ) : (
              <div className="text-zinc-700 font-black italic uppercase text-2xl text-center p-10">
                Incolla un URL per<br/>vedere l&apos;anteprima
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}