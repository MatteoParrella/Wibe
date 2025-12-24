import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function DettaglioEvento({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;

  const { data: evento, error } = await supabase
    .from('Events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !evento) {
    notFound();
  }

  const dataFormattata = new Date(evento.date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      
      {/* Navigazione discreta */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-all">
          ← Torna alla Home
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* COLONNA IMMAGINE (SINISTRA) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video md:aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              {evento.image_url ? (
                <Image 
                  src={evento.image_url} 
                  alt={evento.title} 
                  fill
                  className="object-cover"
                  priority // Carica questa immagine immediatamente
                  unoptimized // Manteniamo questo se l'URL viene da fonti esterne non configurate
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-black tracking-widest">
                  No visual available
                </div>
              )}
            </div>

            {/* Descrizione sotto l'immagine per pulizia visiva */}
            <div className="mt-12 space-y-6 max-w-2xl">
              <h3 className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.3em]">Concept & Dettagli</h3>
              <p className="text-xl text-zinc-400 leading-relaxed font-light italic">
                {evento.description || "Nessuna descrizione disponibile."}
              </p>
            </div>
          </div>

          {/* COLONNA INFORMAZIONI (DESTRA) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12 space-y-12">
              
              {/* Header Titolo */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
                  {evento.title}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="h-1 w-12 bg-[#ccff00]"></span>
                  <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Evento Verificato</span>
                </div>
              </div>

              {/* Box Dati Tecnici */}
              <div className="space-y-px rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
                <div className="bg-zinc-900/40 p-6 flex justify-between items-center group hover:bg-zinc-900/60 transition-colors">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Data Evento</span>
                  <span className="text-white font-black italic">{dataFormattata}</span>
                </div>
                
                <div className="bg-zinc-900/40 p-6 flex justify-between items-center group hover:bg-zinc-900/60 transition-colors">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Location</span>
                  <span className="text-white font-black italic text-right uppercase">{evento.location}</span>
                </div>

                <div className="bg-zinc-900/40 p-8 flex justify-between items-end border-t border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Costo Ingresso</span>
                  <span className="text-6xl font-black text-[#ccff00] italic leading-none">{evento.price}€</span>
                </div>
              </div>

              {/* Tasto Ticket */}
              <div className="space-y-6">
                <button className="w-full bg-[#ccff00] text-black font-black py-6 rounded-2xl hover:bg-white hover:scale-[1.01] transition-all duration-300 uppercase italic tracking-tighter text-2xl shadow-[0_20px_40px_rgba(204,255,0,0.1)]">
                  Ottieni Ticket
                </button>
                
                <div className="flex flex-col gap-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full shadow-[0_0_8px_#ccff00]" />
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Accesso digitale immediato dopo la prenotazione</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Pagamento sicuro tramite sistema crittografato</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}