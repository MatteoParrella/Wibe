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
    date: '', // Nuovo campo Data e Ora
    price: '',
    image_url: '',
    category: 'Techno',
  })

  // Geocoding per trasformare indirizzo in coordinate
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
        date: new Date(formData.date).toISOString() // Formattazione corretta per DB
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
    <main className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
        
        {/* COLONNA FORM (7/12) */}
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
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Dettagli dell&apos;Evento (Descrizione)</label>
            <textarea required rows={4} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all resize-none text-sm leading-relaxed"
              placeholder="Descrivi l'atmosfera, il target e la musica..." onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">URL Immagine Cover</label>
              <input required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all"
                placeholder="https://..." onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Vibe / Categoria</label>
            <select 
                className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-white transition-all appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
                <option value="Techno">TECHNO</option>
                <option value="House">HOUSE</option>
                <option value="Reggaeton">REGGAETON</option>
                <option value="Hip Hop">HIP HOP</option>
                <option value="Gala">GALA / ELEGANT</option>
                <option value="Rooftop">ROOFTOP</option>
            </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-2">Prezzo Ingresso (€)</label>
              <input type="number" required className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-[#ccff00] outline-none text-[#ccff00] font-black text-xl"
                placeholder="30" onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#ccff00] text-black font-black py-6 rounded-[2rem] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(204,255,0,0.2)] disabled:opacity-50 mt-4">
            {loading ? 'CALCOLO RADAR IN CORSO...' : 'PUBBLICA ORA'}
          </button>
        </form>

        {/* COLONNA ANTEPRIMA (5/12) */}
        <div className="lg:col-span-5 hidden lg:block sticky top-24">
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.4em] ml-6">Live Preview</p>
            <div className="relative group w-full aspect-[4/5] bg-zinc-900 rounded-[3.5rem] overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Invalid+Link'}} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-12 left-12 right-12 space-y-4">
                    <div className="bg-[#ccff00] text-black text-[9px] font-black px-3 py-1 rounded-full inline-block uppercase italic">Preview Mode</div>
                    <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">{formData.title || "TITOLO EVENTO"}</h2>
                    <p className="text-zinc-400 text-sm line-clamp-2 italic">{formData.description || "Inizia a scrivere la descrizione per vederla qui..."}</p>
                    <div className="flex justify-between items-end pt-4 border-t border-white/10">
                       <p className="text-white font-bold uppercase text-[10px] tracking-widest">{formData.location || "LOCATION"}</p>
                       <p className="text-[#ccff00] font-black text-3xl italic">{formData.price ? `€${formData.price}` : "€--"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-12 space-y-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto animate-pulse flex items-center justify-center text-3xl">🖼️</div>
                  <p className="text-zinc-600 font-black italic uppercase text-lg leading-tight">Incolla un URL Immagine<br/>per attivare il radar</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}