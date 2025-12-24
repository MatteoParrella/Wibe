'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix per l'icona del marker (spesso non appare correttamente in Next.js)
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Definiamo un'interfaccia per TypeScript per evitare errori su "events"
interface Evento {
  id: string | number;
  title: string;
  lat: number;
  lng: number;
  location?: string;
}

export default function Map({ events }: { events: Evento[] }) {
  // Centro di default: Milano
  const position: [number, number] = [45.4642, 9.1900] 

  return (
    <div className="h-[500px] w-full rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl z-0">
      <MapContainer 
        center={position} 
        zoom={12} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        {/* Tema Dark per WIBE */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />
        
        {/* Renderizziamo i marker solo se le coordinate esistono */}
        {events?.map((event) => (
          event.lat && event.lng && (
            <Marker 
              key={event.id} 
              position={[event.lat, event.lng]} 
              icon={customIcon}
            >
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-black uppercase text-black italic tracking-tighter text-lg leading-none mb-1">
                    {event.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">
                    {event.location || "Location non specificata"}
                  </p>
                  <a 
                    href={`/evento/${event.id}`} 
                    className="inline-block bg-black text-[#ccff00] text-[10px] font-black px-3 py-1 rounded-full uppercase hover:bg-zinc-800 transition-colors"
                  >
                    Vedi Evento
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  )
}