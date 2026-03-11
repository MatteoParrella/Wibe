# CLAUDE.md — Wibe Project

Documento di riferimento per Claude su come migliorare, ottimizzare e rendere professionale il progetto Wibe.

---

## Contesto del Progetto

**Wibe** è una piattaforma di eventi notturni esclusivi costruita su:
- **Next.js 16** (App Router, Turbopack)
- **Supabase** (auth, database PostgreSQL)
- **Tailwind CSS v4**
- **Leaflet** per la mappa interattiva
- **TypeScript** strict mode

Il sito ha due ruoli utente: `clubber` (utente standard) e `pr` (chi pubblica eventi). I PR possono creare eventi, i clubber possono acquistare ticket con QR code.

---

## Priorità di Miglioramento

### 🔴 Critiche (da fare subito)

**1. Sicurezza — Row Level Security (RLS) su Supabase**
Attualmente le tabelle `Events` e `Tickets` non hanno RLS attivato. Chiunque con la anon key può leggere e scrivere tutto.
```sql
-- Abilitare RLS su Events
ALTER TABLE "Events" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lettura pubblica" ON "Events" FOR SELECT USING (true);
CREATE POLICY "Solo PR possono inserire" ON "Events" FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'pr'));

-- Abilitare RLS su Tickets
ALTER TABLE "Tickets" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utenti vedono solo i propri ticket" ON "Tickets"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Utenti inseriscono solo i propri ticket" ON "Tickets"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**2. Variabili d'ambiente — Non esporre la anon key nel client**
Usare sempre `NEXT_PUBLIC_` solo per URL e anon key (sono pubbliche by design in Supabase), ma non aggiungere mai la `service_role` key nel frontend.

**3. next.config.ts — Limitare i domini immagini**
Il wildcard `hostname: "**"` è troppo permissivo. Specificare solo i domini usati:
```ts
remotePatterns: [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "*.supabase.co" },
]
```

---

### 🟡 Importanti (migliorano qualità e UX)

**4. Upload immagini diretto — Supabase Storage**
Attualmente il PR deve incollare un URL esterno. Implementare upload diretto:
- Creare un bucket `event-covers` su Supabase Storage
- Aggiungere un input `<file>` nel form di `aggiungi-evento`
- Usare `supabase.storage.from('event-covers').upload()`
- Sostituire il campo `image_url` con l'URL pubblico restituito

**5. Paginazione o infinite scroll nella Home**
Con molti eventi, caricarli tutti in una volta è lento. Implementare:
```ts
// Paginazione: 12 eventi per volta
.from('Events').select(...).range(0, 11)
// Oppure cursor-based con .gt('created_at', lastCursor)
```

**6. Pagina evento — Mappa del singolo evento**
Aggiungere una mini-mappa nella pagina `/evento/[id]` che mostra solo il marker dell'evento corrente, centrato su di esso.

**7. Gestione errori globale**
Creare un componente `ErrorBoundary` e una pagina `app/error.tsx` per gestire gli errori Next.js in modo elegante invece del crash bianco.

**8. Loading states**
Aggiungere skeleton loader a tutte le pagine server-side (`app/profile`, `app/evento/[id]`) usando `app/loading.tsx` per ogni route.

**9. Metadati dinamici per SEO**
La pagina evento ha titolo statico. Aggiungere `generateMetadata`:
```ts
export async function generateMetadata({ params }) {
  const evento = await getEvento(params.id)
  return {
    title: `${evento.title} | WIBE`,
    description: evento.description,
    openGraph: { images: [evento.image_url] }
  }
}
```

---

### 🟢 Ottimizzazioni Performance

**10. Revalidazione dati**
La home è `'use client'` e fa fetch ad ogni visita. Valutare di tornare a Server Component con:
```ts
export const revalidate = 60 // ricarica ogni 60 secondi
```

**11. Eliminare `@supabase/auth-helpers-nextjs`**
È una dipendenza legacy. Il progetto usa già `@supabase/ssr` che è il moderno sostituto. Rimuovere da `package.json`.

**12. Font — Preload ottimizzato**
Aggiungere `display: 'swap'` a tutte le dichiarazioni font in `layout.tsx` per evitare il Flash of Invisible Text (FOIT).

**13. Immagini — Priorità**
Aggiungere `priority` alle immagini above-the-fold (prima card della grid, immagine hero dell'evento).

---

### 🔵 Funzionalità Future

**14. Dashboard PR**
Una pagina `/dashboard` visibile solo ai PR con:
- Lista degli eventi pubblicati
- Numero di ticket venduti per evento
- Possibilità di modificare/eliminare un evento

**15. Validazione ticket QR**
Un sistema di scan per i PR che permette di verificare l'autenticità di un ticket scansionando il QR all'ingresso, controllando il record nella tabella `Tickets`.

**16. Notifiche email**
Dopo l'acquisto di un ticket, inviare una mail di conferma con il QR allegato usando Supabase Edge Functions + Resend.

**17. Filtro eventi per data**
Aggiungere alla home un date picker per filtrare gli eventi per periodo.

**18. Pagina profilo — Storico eventi**
Separare i ticket in "upcoming" e "past" nella pagina `/profile`.

---

## Convenzioni di Codice

- Tutti i componenti client devono avere `'use client'` in cima
- I Server Components che usano cookies devono creare un client Supabase con `createServerClient` da `@supabase/ssr`
- I Client Components usano `createBrowserClient` da `lib/supabase.ts`
- Non usare `alert()` — usare stati di errore inline con classi Tailwind
- Le props TypeScript devono avere interfacce esplicite, mai `any`
- I `select()` Supabase devono specificare esplicitamente le colonne, mai `select('*')`

---

## Struttura Cartelle

```
wibe-project/
├── app/
│   ├── aggiungi-evento/page.tsx   # Solo PR
│   ├── evento/[id]/page.tsx       # Dettaglio evento
│   ├── login/page.tsx             # Auth
│   ├── profile/page.tsx           # Profilo utente + ticket
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Home con mappa + grid
├── components/
│   ├── EventTimer.tsx             # Countdown client
│   ├── LogoutButton.tsx           # Logout client
│   ├── Map.tsx                    # Leaflet map
│   ├── MapWrapper.tsx             # Dynamic import wrapper
│   ├── Navbar.tsx                 # Nav con auth state
│   ├── QRCodeGenerator.tsx        # QR SVG
│   ├── ShareButton.tsx            # Web Share API
│   └── TicketModal.tsx            # Modal ticket + salvataggio DB
├── lib/
│   └── supabase.ts                # Browser client
└── middleware.ts                  # Protezione rotte
```

---

## Note Importanti per Claude

- La tabella eventi si chiama `Events` (con la E maiuscola) su Supabase
- La tabella profili si chiama `profiles` (minuscolo)
- La tabella ticket si chiama `Tickets` (con la T maiuscola)
- Il campo `id` di `Events` è di tipo `BIGINT`, non UUID
- Il campo `id` di `Tickets` è UUID
- Il campo `id` di `profiles` è UUID (corrisponde a `auth.users.id`)
- I ruoli validi sono esattamente: `'pr'` e `'clubber'` (minuscolo)
- Il colore accent del brand è `#ccff00` (lime)