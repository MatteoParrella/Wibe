import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // Peschiamo i dati dalla tabella 'Events' (con la E maiuscola)
  const { data: events, error } = await supabase
    .from('Events')
    .select('*')
    .order('created_at', { ascending: false }); // Mostra i più recenti per primi

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-[#ccff00] text-2xl font-bold">Errore di connessione</h1>
        <p className="text-zinc-500">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-6xl font-black text-[#ccff00] tracking-tighter italic">
          WIBE <span className="text-white">EVENTS</span>
        </h1>
        <p className="text-zinc-500 mt-2 uppercase tracking-[0.2em] text-sm">
          Scopri i migliori club e le serate più esclusive
        </p>
      </div>

      {/* Grid Eventi */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">Nessun evento in programma. Pubblicane uno!</p>
          </div>
        ) : (
          events?.map((evento) => (
            <div 
              key={evento.id} 
              className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#ccff00] transition-all duration-500"
            >
              {/* Contenitore Immagine */}
              <div className="relative h-64 w-full overflow-hidden bg-zinc-800">
                {evento.image_url ? (
                  <Image 
                    src={evento.image_url} 
                    alt={evento.title} 
                    width={500} // Aggiungi una larghezza indicativa
                    height={300} // Aggiungi un'altezza indicativa
                    unoptimized // Necessario per link esterni non configurati
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 italic">
                    No Cover
                  </div>
                )}
                {/* Badge Prezzo */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-[#ccff00] px-3 py-1 rounded-full font-bold border border-[#ccff00]/30">
                  {evento.price}€
                </div>
              </div>

              {/* Dettagli Evento */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#ccff00] transition-colors">
                    {evento.title}
                  </h2>
                </div>
                
                <p className="text-zinc-400 text-sm line-clamp-2 mb-6 h-10">
                  {evento.description || "Nessuna descrizione disponibile per questo evento."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Location</span>
                    <span className="text-white font-medium">{evento.location}</span>
                  </div>
                  <Link 
                    href={`/evento/${evento.id}`} 
                    className="bg-white text-black text-xs font-black px-4 py-2 rounded-lg hover:bg-[#ccff00] transition-colors uppercase tracking-tighter inline-block text-center"
                  >
                    Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}