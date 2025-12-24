import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TicketModal from '@/components/TicketModal';
import EventTimer from '@/components/EventTimer'; // Importa il timer

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
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="text-zinc-500 hover:text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] transition-all">
          ← TORNA ALLA HOME
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7">
            <div className="relative w-full rounded-[2.5rem] border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden h-[400px] md:h-[600px]">
              {evento.image_url ? (
                <img src={evento.image_url} alt={evento.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black uppercase text-2xl">No Visual</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="mt-10 space-y-4">
              <h3 className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em]">Descrizione</h3>
              <p className="text-xl text-zinc-400 leading-relaxed font-light italic">
                {evento.description || "Nessun dettaglio disponibile."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-10 space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]">
                {evento.title}
              </h1>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-pulse" />
                 <p className="text-[#ccff00] font-bold uppercase text-[10px] tracking-[0.3em] italic">Official Event Radar</p>
              </div>
            </div>

            {/* BOX COUNTDOWN */}
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/20">
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-4 text-center">Inizio tra</p>
              <EventTimer targetDate={evento.date} />
            </div>

            <div className="divide-y divide-zinc-800 rounded-3xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <div className="p-6 flex justify-between">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Data</span>
                <span className="font-black uppercase">{dataFormattata}</span>
              </div>
              <div className="p-6 flex justify-between bg-zinc-900/50">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Vibe Check</span>
                <span className="font-black uppercase italic text-[#ccff00]">Clear Sky & Heat</span>
              </div>
              <div className="p-6 flex justify-between items-end bg-zinc-900/80">
                <span className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Entry</span>
                <span className="text-5xl font-black text-[#ccff00] italic leading-none">{evento.price}€</span>
              </div>
            </div>

            <TicketModal 
              eventTitle={evento.title} 
              eventDate={dataFormattata} 
              eventLocation={evento.location} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}