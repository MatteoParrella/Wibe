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
    location: '', // Indirizzo testuale (es. Via Torino 1, Milano)
    price: '',
    image_url: ''
  })

  // FUNZIONE PER TRASFORMARE INDIRIZZO IN COORDINATE
  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
      }
      return { lat: 45.4642, lng: 9.1900 } // Default su Milano se non trova nulla
    } catch (error) {
      console.error("Errore geocoding:", error)
      return { lat: 45.4642, lng: 9.1900 }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Recupera le coordinate dall'indirizzo inserito
    const coords = await getCoordinates(formData.location)

    // 2. Salva su Supabase
    const { error } = await supabase.from('Events').insert([
      { 
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        lat: coords.lat,
        lng: coords.lng
      }
    ])

    if (error) {
      alert("Errore nel salvataggio: " + error.message)
    } else {
      alert("Evento creato con successo sul Radar!")
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-xl w-full space-y-6 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800">
        <h1 className="text-4xl font-black italic text-[#ccff00] tracking-tighter uppercase text-center mb-8">
          Nuovo Evento
        </h1>

        <div>
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Nome Evento</label>
          <input 
            required
            className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none transition-all"
            placeholder="es. TECHNO NIGHT"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Indirizzo / Locale</label>
          <input 
            required
            className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none transition-all"
            placeholder="es. Via Pantano 15, Milano"
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">Prezzo (€)</label>
            <input 
              type="number"
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none transition-all"
              placeholder="20"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-2">URL Immagine</label>
            <input 
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl mt-1 focus:border-[#ccff00] outline-none transition-all"
              placeholder="https://..."
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#ccff00] text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-white transition-all shadow-lg mt-4 disabled:opacity-50"
        >
          {loading ? 'Calcolo posizione...' : 'Pubblica nel Radar'}
        </button>
      </form>
    </main>
  )
}