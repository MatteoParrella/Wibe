/* ============================================================
   WIBE — main.js  (refactored & improved)
   ============================================================ */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, input, .event-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target); // fire only once
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTDOWN ──────────────────────────────────────────────
// Target: prossimo evento — 15 Aprile 2026 ore 23:00
const countdownTarget = new Date('2026-04-15T23:00:00');

function updateCountdown() {
  const diff = countdownTarget - Date.now();
  if (diff <= 0) {
    ['cd-d','cd-h','cd-m','cd-s'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-d').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── FILTRI ─────────────────────────────────────────────────
// Stato globale filtri — genre e ricerca sono sempre combinati
let activeGenre = 'all';
let activeSearch = '';

function applyFilters() {
  const q = activeSearch.toLowerCase();
  document.querySelectorAll('.event-card').forEach(card => {
    const matchGenre  = activeGenre === 'all' || card.dataset.cat === activeGenre;
    const matchSearch = !q || card.innerText.toLowerCase().includes(q);
    card.style.display = (matchGenre && matchSearch) ? '' : 'none';
  });
}

function filterEvents(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeGenre = cat;
  applyFilters();
}

function searchEvents(q) {
  activeSearch = q;
  applyFilters();
}

// ── MODAL TICKET ───────────────────────────────────────────
let currentEvent = {};

function openModal(name, date, location) {
  currentEvent = { name, date, location };
  document.getElementById('modal-subtitle').textContent = name + ' — ' + date;
  document.getElementById('modal-name').value = '';
  clearInputError();
  document.getElementById('modal-step1').style.display = 'block';
  document.getElementById('modal-step2').style.display = 'none';
  document.getElementById('modal').classList.add('open');
  // Focus sull'input per accessibilità
  setTimeout(() => document.getElementById('modal-name').focus(), 100);
  return false;
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

// ESC per chiudere modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── VALIDAZIONE INPUT ──────────────────────────────────────
function showInputError(msg) {
  const input = document.getElementById('modal-name');
  const errEl = document.getElementById('modal-name-error');
  input.classList.add('input-error');
  if (errEl) errEl.textContent = msg;
}

function clearInputError() {
  const input = document.getElementById('modal-name');
  const errEl = document.getElementById('modal-name-error');
  input.classList.remove('input-error');
  if (errEl) errEl.textContent = '';
}

// ── SANITIZZAZIONE INPUT (prevenzione XSS) ─────────────────
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str; // textContent non esegue HTML
  return div.textContent;
}

// ── GENERA TICKET ──────────────────────────────────────────
function generateTicket() {
  const rawName = document.getElementById('modal-name').value.trim();
  if (!rawName || rawName.length < 3) {
    showInputError('Inserisci il tuo nome completo (min. 3 caratteri)');
    return;
  }
  clearInputError();

  const name = sanitize(rawName);
  const id   = 'WIBE-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  // Aggiorna UI del ticket (tutti via textContent — nessun XSS possibile)
  document.getElementById('ticket-event-name').textContent = currentEvent.name;
  document.getElementById('ticket-holder').textContent     = name.toUpperCase();
  document.getElementById('ticket-meta').textContent       = currentEvent.location + ' — ' + currentEvent.date;
  document.getElementById('ticket-id').textContent         = 'Digital ID: #' + id;

  document.getElementById('modal-step1').style.display = 'none';
  document.getElementById('modal-step2').style.display = 'block';
}

// ── DOWNLOAD TICKET (Canvas API) ───────────────────────────
function downloadTicket() {
  const canvas  = document.createElement('canvas');
  const DPR     = window.devicePixelRatio || 1;
  const W       = 420, H = 580;
  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  // Sfondo nero (header ticket)
  ctx.fillStyle = '#050505';
  ctx.roundRect(0, 0, W, H, 24);
  ctx.fill();

  // Header strip
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, 110);

  // Body bianco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 110, W, H - 160);

  // Footer grigio
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, H - 50, W, 50);

  // Label "Official Access Pass"
  ctx.fillStyle = 'rgba(212,255,0,0.7)';
  ctx.font = '10px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.4em';
  ctx.fillText('OFFICIAL ACCESS PASS', W / 2, 40);

  // Nome evento
  ctx.fillStyle = '#d4ff00';
  ctx.font      = 'bold 38px "Bebas Neue", sans-serif';
  ctx.fillText(
    (document.getElementById('ticket-event-name').textContent || 'WIBE EVENT').toUpperCase(),
    W / 2, 85
  );

  // QR semplificato (pattern grafico)
  drawQRPlaceholder(ctx, W / 2 - 55, 130, 110);

  // Nome holder
  ctx.fillStyle = '#111111';
  ctx.font      = 'bold 22px "Bebas Neue", sans-serif';
  ctx.fillText(
    document.getElementById('ticket-holder').textContent || '',
    W / 2, 280
  );

  // Meta
  ctx.fillStyle = '#999999';
  ctx.font      = '10px "DM Mono", monospace';
  ctx.fillText(
    document.getElementById('ticket-meta').textContent || '',
    W / 2, 302
  );

  // Linea tratteggiata separatrice
  ctx.strokeStyle = '#dddddd';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(24, 340);
  ctx.lineTo(W - 24, 340);
  ctx.stroke();
  ctx.setLineDash([]);

  // Footer ID
  ctx.fillStyle = '#999999';
  ctx.font      = '9px "DM Mono", monospace';
  ctx.fillText(
    document.getElementById('ticket-id').textContent || '',
    W / 2, H - 20
  );

  // Download
  const link    = document.createElement('a');
  link.download = 'wibe-ticket.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

/** Disegna un QR placeholder grafico sul canvas */
function drawQRPlaceholder(ctx, x, y, size) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, size, size);

  const cell = size / 21;
  ctx.fillStyle = '#ffffff';

  // Pattern fisso (simula QR corners + data cells)
  const pattern = [
    [0,0,7,7], [14,0,7,7], [0,14,7,7], // corner squares
  ];
  pattern.forEach(([cx, cy, cw, ch]) => {
    ctx.fillRect(x + cx * cell, y + cy * cell, cw * cell, ch * cell);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + (cx+1)*cell, y + (cy+1)*cell, (cw-2)*cell, (ch-2)*cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + (cx+2)*cell, y + (cy+2)*cell, (cw-4)*cell, (ch-4)*cell);
    ctx.fillStyle = '#000000';
  });

  // Alcune celle data casuali per realismo
  const dataCells = [
    [9,0],[10,0],[9,4],[11,4],[9,9],[10,9],[11,9],[13,9],[14,9],
    [9,13],[11,14],[13,14],[14,13],[16,14],[17,18],[12,17],[5,9],
    [3,10],[4,10],[3,12],[6,13]
  ];
  ctx.fillStyle = '#ffffff';
  dataCells.forEach(([cx, cy]) => {
    ctx.fillRect(x + cx * cell, y + cy * cell, cell, cell);
  });
}

// ── CONDIVIDI EVENTO (Web Share API) ──────────────────────
function shareEvent(eventName, eventDate, eventLocation) {
  const shareData = {
    title: `${eventName} | WIBE`,
    text:  `${eventName} — ${eventDate} @ ${eventLocation}\nScopri gli eventi esclusivi su WIBE!`,
    url:   window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      // L'utente ha annullato — silenzioso
    });
  } else {
    // Fallback: copia negli appunti
    const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast('Link copiato negli appunti!');
    }).catch(() => {
      showCopyToast('Copia questo link: ' + window.location.href);
    });
  }
  return false;
}

/** Toast non invasivo per feedback clipboard */
function showCopyToast(msg) {
  let toast = document.getElementById('wibe-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wibe-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}
