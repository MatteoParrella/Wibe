import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import MapWrapper from '@/components/MapWrapper'; // Importiamo il componente client-side

export default async function Home() {
  // Peschiamo i dati dalla tabella 'Events'
  const { data: events, error } = await supabase
    .from('Events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-[#ccff00] text-2xl font-bold uppercase tracking-tighter">Connection Error</h1>
        <p className="text-zinc-500 font-mono mt-2">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 mt-16 text-center">
        <h1 className="text-7xl md:text-9xl font-black text-[#ccff00] tracking-tighter italic leading-none">
          WIBE <span className="text-white">EVENTS</span>
        </h1>
        <p className="text-zinc-500 mt-6 uppercase tracking-[0.4em] text-[10px] font-bold">
          The most exclusive nights in the palm of your hand
        </p>
      </div>

      {/* --- SEZIONE MAPPA / RADAR --- */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-4 mb-6 ml-4">
          <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-ping" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Live Event Radar</h2>
        </div>
        {/* Usiamo MapWrapper che gestisce internamente il caricamento dinamico e ssr:false */}
        <MapWrapper events={events || []} />
      </div>
    
      {/* Grid Eventi */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10 ml-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Upcoming Experiences</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events?.length === 0 ? (
            <div className="col-span-full text-center py-32 border border-dashed border-zinc-800 rounded-[3rem]">
              <p className="text-zinc-600 uppercase tracking-widest text-xs font-bold">No events scheduled. Be the first to publish.</p>
            </div>
          ) : (
            events?.map((evento) => (
              <Link 
                href={`/evento/${evento.id}`}
                key={evento.id} 
                className="group bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden hover:border-[#ccff00]/50 hover:bg-zinc-900/40 transition-all duration-500 shadow-2xl"
              >
                {/* Immagine */}
                <div className="relative h-80 w-full overflow-hidden bg-zinc-900">
                  {evento.image_url ? (
                    <img 
                      src={evento.image_url} 
                      alt={evento.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black italic uppercase">
                      No Cover
                    </div>
                  )}
                  
                  {/* Badge Prezzo */}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl text-[#ccff00] px-4 py-2 rounded-2xl font-black border border-white/5 shadow-xl text-lg italic">
                    {evento.price}€
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                {/* Dettagli */}
                <div className="p-8">
                  <h2 className="text-3xl font-black italic tracking-tighter text-white group-hover:text-[#ccff00] transition-colors uppercase leading-none mb-4">
                    {evento.title}
                  </h2>
                  
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-8 font-light italic leading-relaxed">
                    {evento.description || "No description provided for this event."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase text-[#ccff00] font-black tracking-[0.2em]">Location</span>
                      <span className="text-white font-bold text-sm uppercase italic tracking-tight">{evento.location}</span>
                    </div>
                    
                    <div className="bg-white text-black text-[10px] font-black px-5 py-2.5 rounded-full group-hover:bg-[#ccff00] transition-colors uppercase tracking-widest">
                      Details
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}