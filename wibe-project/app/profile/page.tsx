import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface EventData {
  title: string;
  date: string;
  location: string;
  image_url: string;
}

interface Ticket {
  id: string;
  event: EventData;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 1. Recupero il profilo per vedere il RUOLO
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isPR = profile?.role === 'pr';

  // 2. Recupero i Ticket
  const { data, error: ticketError } = await supabase
    .from('Tickets')
    .select(`
      id,
      event:event_id (
        title,
        date,
        location,
        image_url
      )
    `)
    .eq('user_id', user.id);

  const tickets = (data as unknown) as Ticket[];

  // 3. UNICO RETURN con tutto il design
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 pt-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con distinzione Ruolo */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-6xl font-black italic uppercase text-[#ccff00] leading-none">
              My Profile
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isPR ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {isPR ? 'Official PR' : 'Clubber'}
              </span>
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                Session Active
              </p>
            </div>
          </div>
          <Link href="/" className="text-[10px] font-black uppercase border border-zinc-800 px-6 py-3 rounded-full hover:bg-[#ccff00] hover:text-black transition-all">
            Back to Radar
          </Link>
        </div>

        {/* Card Utente e Azioni Speciali PR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center gap-6">
            <div className="w-16 h-16 bg-[#ccff00] rounded-full flex items-center justify-center text-black font-black text-2xl italic">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Account</p>
              <p className="text-xl font-bold truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>

          {/* Se l'utente è PR, mostriamo il box per pubblicare */}
          {isPR && (
            <Link href="/aggiungi-evento" className="group bg-[#ccff00] p-8 rounded-[2.5rem] flex flex-col justify-center hover:bg-white transition-all duration-500">
              <p className="text-black text-[10px] font-black uppercase tracking-widest mb-1">PR Tools</p>
              <h3 className="text-black text-2xl font-black uppercase italic leading-none">
                Create New Event +
              </h3>
            </Link>
          )}
        </div>

        {/* Lista Tickets */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8 ml-2">
            <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-ping" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">My Passes</h2>
          </div>

          {!tickets || tickets.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[2.5rem]">
              <p className="text-zinc-600 uppercase text-xs font-bold tracking-widest">No active tickets</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="group bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[#ccff00]/50 transition-all duration-500">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                    <img src={t.event.image_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic mb-2">{t.event.title}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.event.location} — {new Date(t.event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shrink-0 shadow-xl">
                  <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-black text-[10px] text-black italic">QR</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}