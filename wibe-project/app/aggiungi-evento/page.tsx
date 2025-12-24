'use client'; 

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AggiungiEvento() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stato per l'URL dell'immagine
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Inseriamo i dati nella tabella (usiamo 'Events' con la E maiuscola come da tuo DB)
    const { error } = await supabase.from('Events').insert([
      { 
        title, 
        description, 
        price: parseInt(price), 
        location,
        image_url: imageUrl, // Inserimento dell'URL immagine
        date: new Date().toISOString() 
      }
    ]);

    if (error) {
      alert("Errore nell'inserimento: " + error.message);
      setLoading(false);
    } else {
      alert("Evento creato con successo!");
      router.push('/'); 
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-[#ccff00] text-3xl font-bold mb-8 italic tracking-tighter">
        PUBBLICA EVENTO <span className="text-white">WIBE</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
        
        {/* Preview Immagine Dinamica */}
        {imageUrl && (
          <div className="mb-6 w-full h-40 rounded-lg overflow-hidden border border-zinc-700">
            <Image 
            src={imageUrl} 
            alt="Preview" 
            fill // Fa sì che l'immagine riempia il contenitore
            unoptimized // Fondamentale per vedere l'anteprima di link esterni subito
            className="object-cover" 
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Nome Evento</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-all"
            placeholder="Esempio: Techno Night"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Descrizione</label>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none h-24 resize-none"
            placeholder="Racconta la vibe della serata..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">URL Locandina (Link Immagine)</label>
          <input 
            type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://immagine-disco.jpg"
            className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-all"
          />
        </div>

        <div className="flex gap-4 mb-8">
          <div className="w-1/2">
            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Prezzo (€)</label>
            <input 
              type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none"
              placeholder="0"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Locale</label>
            <input 
              type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none"
              placeholder="Nome Club"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full font-black py-4 rounded-2xl transition-all uppercase italic tracking-widest ${
            loading ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-[#ccff00] text-black hover:bg-white'
          }`}
        >
          {loading ? 'Pubblicazione...' : 'Metti in lista'}
        </button>
      </form>
    </main>
  );
}