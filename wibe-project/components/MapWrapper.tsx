'use client'

import dynamic from 'next/dynamic'

// 1. Definiamo l'interfaccia per eliminare l'errore "any"
interface Evento {
  id: string | number;
  title: string;
  lat: number;
  lng: number;
  location?: string;
  image_url?: string;
  price?: number;
}

// 2. Caricamento dinamico del componente Map
const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto h-[450px] bg-zinc-900/50 animate-pulse rounded-[3rem] border border-zinc-800 flex items-center justify-center">
       <span className="text-zinc-600 uppercase tracking-widest text-xs font-bold">Caricamento Radar...</span>
    </div>
  )
})

// 3. Esportiamo il Wrapper usando il tipo Evento[] invece di any[]
export default function MapWrapper({ events }: { events: Evento[] }) {
  return <Map events={events} />
}