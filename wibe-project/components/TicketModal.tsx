'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';

interface TicketProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

export default function TicketModal({ eventTitle, eventDate, eventLocation }: TicketProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  
  // Genera l'ID una volta sola all'avvio senza usare useEffect
  const [ticketId] = useState(() => 
    Math.random().toString(36).substring(2, 11).toUpperCase()
  );

  const ticketRef = useRef<HTMLDivElement>(null);
  // Cancella pure lo useEffect se lo avevi aggiunto prima

 const downloadTicket = () => {
  if (ticketRef.current === null) return;
  
  toPng(ticketRef.current, { 
    cacheBust: true,
    backgroundColor: '#ffffff', // Forza lo sfondo bianco nell'immagine finale
    pixelRatio: 2, // Rende l'immagine più nitida (Alta Definizione)
  })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `Ticket-${eventTitle}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => console.error('Errore nel download', err));
};

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#ccff00] text-black font-black py-6 rounded-2xl hover:bg-white transition-all uppercase italic tracking-tighter text-2xl shadow-[0_20px_40px_rgba(204,255,0,0.15)] active:scale-95"
      >
        Ottieni Ticket
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      
      {!isGenerated ? (
        /* FASE 1: REGISTRAZIONE */
        <div className="bg-zinc-900 p-8 rounded-[40px] border border-zinc-800 w-full max-w-md shadow-2xl">
          <div className="mb-8">
            <h2 className="text-[#ccff00] font-black italic uppercase text-3xl tracking-tighter">Registration</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Inserisci i tuoi dati per il check-in</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] font-black uppercase ml-1">
            Nome e Cognome
            </label>
              <input 
                type="text" 
                placeholder="ES. MARCO ROSSI" 
                className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white font-bold focus:border-[#ccff00] transition-colors outline-none uppercase"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            
            <button 
              disabled={!userName || userName.length < 3}
              onClick={() => setIsGenerated(true)}
              className="w-full bg-[#ccff00] text-black font-black py-5 rounded-2xl disabled:opacity-30 uppercase italic tracking-tighter text-xl transition-all"
            >
              Genera Biglietto
            </button>
            <button onClick={() => setIsOpen(false)} className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              Annulla e Torna Indietro
            </button>
          </div>
        </div>
      ) : (
        /* FASE 2: BIGLIETTO FINALE */
        <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-in fade-in zoom-in duration-300">
          
          {/* AREA DI STAMPA */}
          <div ref={ticketRef} className="bg-white w-full rounded-[35px] overflow-hidden text-black shadow-2xl">
            {/* Header */}
            <div className="bg-black p-7 text-center">
              <p className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Official Access Pass</p>
              <h2 className="text-[#ccff00] text-3xl font-black italic uppercase tracking-tighter leading-none">
                {eventTitle}
              </h2>
            </div>
            
            <div className="p-10 flex flex-col items-center text-center">
              {/* QR Code con bordo */}
              <div className="bg-white p-3 border-[6px] border-black rounded-[25px] mb-8">
                <QRCodeSVG value={`WIBE-AUTH-${userName}-${ticketId}`} size={160} />
              </div>
              
              <div className="w-full space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1 tracking-widest">Titolare</p>
                  <p className="font-black uppercase text-2xl tracking-tight leading-none">{userName}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1 tracking-widest">Data</p>
                    <p className="font-black text-sm uppercase">{eventDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1 tracking-widest">Location</p>
                    <p className="font-black text-sm uppercase truncate">{eventLocation || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Separatore Grafico */}
            <div className="relative h-8 bg-zinc-50 flex items-center justify-between">
              <div className="w-10 h-10 bg-black rounded-full -ml-5" />
              <div className="border-t-[3px] border-dashed border-zinc-200 w-full" />
              <div className="w-10 h-10 bg-black rounded-full -mr-5" />
            </div>

            <div className="p-5 bg-zinc-50 text-center">
              <p className="text-[9px] text-zinc-400 font-mono font-bold uppercase tracking-[0.2em]">
                Digital ID: #{ticketId}
              </p>
            </div>
          </div>

          {/* Azioni Sotto il Biglietto */}
          <div className="flex flex-col w-full gap-4">
            <button 
              onClick={downloadTicket}
              className="w-full bg-[#ccff00] text-black font-black py-5 rounded-2xl uppercase italic tracking-tighter text-xl shadow-[0_10px_30px_rgba(204,255,0,0.2)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
            >
              <span>📥</span> Salva in Galleria
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
            >
              Chiudi Finestra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}