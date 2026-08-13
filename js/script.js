/* ==========================================
   1. GESTIONE LINGUA ULTRA-STABILE E VELOCE
   ========================================== */

window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'it',
    includedLanguages: 'en,de,fr,es,nl',
    autoDisplay: false
  }, 'google_translate_element');
};

window.toggleLangDropdown = function(e) {
  if (e) e.stopPropagation();
  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) {
    langDropdown.classList.toggle('show');
  }
};

document.addEventListener('click', function(e) {
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown && langBtn && !langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
    langDropdown.classList.remove('show');
  }
});

function gestisciCookieTranslate(lang) {
  const dominio = window.location.hostname;
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + dominio + ";";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + dominio + ";";

  if (lang && lang !== 'it') {
    document.cookie = "googtrans=/it/" + lang + "; path=/;";
    document.cookie = "googtrans=/it/" + lang + "; path=/; domain=" + dominio + ";";
  }
}

window.cambiaLingua = function(codiceLingua, flagClass) {
  localStorage.setItem('lingua_selezionata', codiceLingua);
  localStorage.setItem('flag_class_selezionata', flagClass);
  localStorage.setItem('salta_splash', 'true');

  gestisciCookieTranslate(codiceLingua);

  const activeFlag = document.getElementById('activeFlag');
  if (activeFlag) activeFlag.className = 'flag-icon ' + flagClass;

  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) langDropdown.classList.remove('show');

  if (codiceLingua === 'it') {
    window.location.reload();
    return;
  }

  const selectGoogle = document.querySelector('.goog-te-combo');
  if (selectGoogle) {
    selectGoogle.value = codiceLingua;
    selectGoogle.dispatchEvent(new Event('change'));
  } else {
    window.location.reload();
  }
};

/* ==========================================
   2. GESTIONE SPLASH SCREEN ED EVENTI AVVIO
   ========================================== */
window.nascondiSplash = function() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  if (localStorage.getItem('salta_splash') === 'true') {
    localStorage.removeItem('salta_splash');
    splash.style.setProperty('display', 'none', 'important');
    return;
  }

  if (!splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.setProperty('display', 'none', 'important');
    }, 400);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const flagClassSalvata = localStorage.getItem('flag_class_selezionata');
  const activeFlag = document.getElementById('activeFlag');
  if (flagClassSalvata && activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClassSalvata;
  }

  if (localStorage.getItem('salta_splash') === 'true') {
    window.nascondiSplash();
  } else {
    setTimeout(window.nascondiSplash, 500);
  }

  // Pre-caricamento immediato e silenzioso di tutti i calendari all'avvio
  precaricaTuttiICalInSilenzio();
});

/* ==========================================
   3. COOKIE BANNER E ANALYTICS
   ========================================== */
const ANALYTICS_ID = 'G-C291PEHWM7';

function caricaAnalytics() {
  if (window.analyticsCaricato) return;
  window.analyticsCaricato = true;

  var script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ANALYTICS_ID);
}

window.accettaCookie = function() {
  localStorage.setItem('consenso_cookie', 'accettato');
  const banner = document.getElementById('cookie-banner');
  if(banner) banner.style.display = 'none';
  caricaAnalytics();
};

window.rifiutaCookie = function() {
  localStorage.setItem('consenso_cookie', 'rifiutato');
  const banner = document.getElementById('cookie-banner');
  if(banner) banner.style.display = 'none';
};

if (localStorage.getItem('consenso_cookie') === 'accettato') {
  caricaAnalytics();
}

/* ==========================================
   4. CALENDARI NATIVI ULTRA-VELOCI (TIMEOUT 2s & RENDER ISTANTANEO)
   ========================================== */

const configurazioneCalendari = {
  'centrale': {
    elementId: 'cal-centrale',
    icalUrls: [
      'https://calendar.google.com/calendar/ical/suitecentrale44@gmail.com/public/basic.ics',
      'https://calendar.google.com/calendar/ical/usn7es2f9plpcsjklc6mpmg4u5i0i4@import.calendar.google.com/public/basic.ics'
    ]
  },
  'corallo': {
    elementId: 'cal-corallo',
    icalUrls: [
      'https://calendar.google.com/calendar/ical/f118fc936bf65f97fec173ca1aec2486f030d9f175ac5177502eb3250ea1c466@group.calendar.google.com/public/basic.ics',
      'https://calendar.google.com/calendar/ical/houpucjjv0mu4cr02bk5n8cd9v6ele8o@import.calendar.google.com/public/basic.ics'
    ]
  },
  'oceano': {
    elementId: 'cal-oceano',
    icalUrls: [
      'https://calendar.google.com/calendar/ical/748b2c73f083c8ff32af24899404f64541430871f37ae98f30cda555123b2ea3@group.calendar.google.com/public/basic.ics',
      'https://calendar.google.com/calendar/ical/lmtdlre4n8fj9qhk8ksqf9lsi91qbhho@import.calendar.google.com/public/basic.ics'
    ]
  }
};

const cachePrenotazioni = {};
const statoMeseCalendario = {};

// Scarica i dati con TIMEOUT SEVERO di 2 secondi: se un proxy dorme, viene ucciso subito!
async function scaricaIcalConTimeout(urlProxy, timeoutMs = 2000) {
  const controller = new AbortController();
  const idTimer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(urlProxy, { signal: controller.signal });
    clearTimeout(idTimer);
    if (!res.ok) throw new Error("HTTP Errore");
    const text = await res.text();
    if (text && text.includes("BEGIN:VCALENDAR")) return text;
    throw new Error("Formato non valido");
  } catch (err) {
    clearTimeout(idTimer);
    throw err;
  }
}

// Prova i proxy in sequenza rapida (max 2 secondi a tentata risposta)
async function scaricaIcalVeloce(icalUrl) {
  const urlPulito = decodeURIComponent(icalUrl);
  
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(urlPulito)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlPulito)}`,
    `https://corsproxy.io/?${encodeURIComponent(urlPulito)}`
  ];

  for (const proxy of proxies) {
    try {
      const testo = await scaricaIcalConTimeout(proxy, 2000);
      if (testo) return testo;
    } catch (e) {
      // Passa istantaneamente al proxy successivo in caso di blocco/timeout
      continue;
    }
  }
  return null;
}

// Scarica e unisce le prenotazioni per la suite
async function caricaEUnisciDateSuite(nomeSuite) {
  const config = configurazioneCalendari[nomeSuite];
  if (!config) return [];

  const promesse = config.icalUrls.map(url => scaricaIcalVeloce(url));
  const risultati = await Promise.all(promesse);

  let tutteLeDate = [];
  risultati.forEach(textICS => {
    if (textICS) {
      tutteLeDate = tutteLeDate.concat(estraiDateDaICS(textICS));
    }
  });

  cachePrenotazioni[nomeSuite] = tutteLeDate;
  return tutteLeDate;
}

// Pre-caricamento silenzioso delle 3 suite subito all'avvio della pagina
async function precaricaTuttiICalInSilenzio() {
  for (const key of Object.keys(configurazioneCalendari)) {
    statoMeseCalendario[key] = new Date();
    caricaEUnisciDateSuite(key);
  }
}

// Estrattore privato: legge solo le cifre delle date YYYYMMDD
function estraiDateDaICS(icsText) {
  const intervalli = [];
  if (!icsText) return intervalli;

  const eventi = icsText.split("BEGIN:VEVENT");

  eventi.forEach(evt => {
    const startMatch = evt.match(/DTSTART[^:]*:(\d{8})/);
    const endMatch = evt.match(/DTEND[^:]*:(\d{8})/);

    if (startMatch && endMatch) {
      const s = startMatch[1];
      const e = endMatch[1];

      const da = `${s.substring(0,4)}-${s.substring(4,6)}-${s.substring(6,8)}`;
      const a = `${e.substring(0,4)}-${e.substring(4,6)}-${e.substring(6,8)}`;

      intervalli.push({ da, a });
    }
  });

  return intervalli;
}

window.apriCalendario = async function(idDelPopup, nomeSuite) {
  const modal = document.getElementById(idDelPopup);
  if (modal) modal.style.display = "flex";

  if (nomeSuite && configurazioneCalendari[nomeSuite]) {
    if (!statoMeseCalendario[nomeSuite]) {
      statoMeseCalendario[nomeSuite] = new Date();
    }

    // Mostra la griglia all'istante
    renderizzaGrigliaCalendario(nomeSuite);

    // Se le date non sono ancora scaricate, le aggiorna in sottofondo
    if (!cachePrenotazioni[nomeSuite] || cachePrenotazioni[nomeSuite].length === 0) {
      caricaEUnisciDateSuite(nomeSuite).then(() => {
        renderizzaGrigliaCalendario(nomeSuite);
      });
    }
  }
};

window.chiudiCalendario = function(idDelPopup) {
  const modal = document.getElementById(idDelPopup);
  if (modal) modal.style.display = "none";
};

window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-calendario')) {
    event.target.style.display = "none";
  }
});

function renderizzaGrigliaCalendario(nomeSuite) {
  const config = configurazioneCalendari[nomeSuite];
  const container = document.getElementById(config.elementId);
  if (!container) return;

  const dataRif = statoMeseCalendario[nomeSuite];
  const anno = dataRif.getFullYear();
  const mese = dataRif.getMonth();

  const nomiMesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  let html = `
    <div class="cal-native-container">
      <div class="cal-header">
        <button type="button" onclick="cambiaMeseSuite('${nomeSuite}', -1)">❮</button>
        <h4>${nomiMesi[mese]} ${anno}</h4>
        <button type="button" onclick="cambiaMeseSuite('${nomeSuite}', 1)">❯</button>
      </div>
      <div class="cal-weekdays">
        <span>Lun</span><span>Mar</span><span>Mer</span><span>Gio</span><span>Ven</span><span>Sab</span><span>Dom</span>
      </div>
      <div class="cal-days-grid">
  `;

  const primoGiornoMese = new Date(anno, mese, 1).getDay();
  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const offsetInizio = (primoGiornoMese === 0) ? 6 : primoGiornoMese - 1;

  for (let i = 0; i < offsetInizio; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  const prenotazioni = cachePrenotazioni[nomeSuite] || [];

  for (let g = 1; g <= giorniNelMese; g++) {
    const meseStr = String(mese + 1).padStart(2, '0');
    const gStr = String(g).padStart(2, '0');
    const dataStr = `${anno}-${meseStr}-${gStr}`;

    const occupato = prenotazioni.some(r => {
      if (r.da === r.a) return dataStr === r.da;
      return dataStr >= r.da && dataStr < r.a;
    });

    const classeStato = occupato ? 'occupato' : 'disponibile';
    html += `<div class="cal-day ${classeStato}">${g}</div>`;
  }

  html += `
      </div>
      <div class="cal-legend">
        <span><i class="dot lib"></i> Libero</span>
        <span><i class="dot occ"></i> Occupato</span>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.cambiaMeseSuite = function(nomeSuite, dir) {
  if (statoMeseCalendario[nomeSuite]) {
    statoMeseCalendario[nomeSuite].setMonth(statoMeseCalendario[nomeSuite].getMonth() + dir);
    renderizzaGrigliaCalendario(nomeSuite);
  }
};

/* ==========================================
   5. MOTORE GALLERIA ULTRA-VELOCE (LOTTI PARALLELI)
   ========================================== */

const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', titolo: 'Suite Centrale 44' },
  'corallo':  { cartella: 'image/suite-corallo/',  titolo: 'Suite Corallo' },
  'oceano':   { cartella: 'image/suite-oceano/',   titolo: 'Suite Oceano' }
};

const estensioniPossibili = ["webp", "jpg", "png", "jpeg", "WEBP", "JPG", "PNG", "JPEG"];

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;
let sessioneGalleriaId = 0;

window.apriGalleria = async function(nomeSuite) {
  const config = configurazioneGallerie[nomeSuite];
  if (!config) return;

  playlistFotoAttuale = [];
  sessioneGalleriaId++;
  const sessioneCorrente = sessioneGalleriaId;

  document.getElementById('titolo-galleria').innerText = `Galleria Foto - ${config.titolo}`;
  const griglia = document.getElementById('galleria-griglia');
  griglia.innerHTML = '<div style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">⚡ Caricamento foto...</div>';

  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  let numeroInizio = 0;
  const DIMENSIONE_LOTTO = 10;
  let continuaScansione = true;
  let trovataAlmenoUna = false;

  while (continuaScansione) {
    if (sessioneGalleriaId !== sessioneCorrente) return;

    const promesseLotto = [];
    for (let i = 0; i < DIMENSIONE_LOTTO; i++) {
      const idx = numeroInizio + i;
      promesseLotto.push(
        cercaPrimoFormatoValido(config.cartella, idx).then(percorso => ({ idx, percorso }))
      );
    }

    const risultati = await Promise.all(promesseLotto);

    if (sessioneGalleriaId !== sessioneCorrente) return;

    risultati.sort((a, b) => a.idx - b.idx);

    let trovateNelLotto = 0;

    for (const item of risultati) {
      if (item.percorso) {
        trovateNelLotto++;
        if (!trovataAlmenoUna) {
          trovataAlmenoUna = true;
          griglia.innerHTML = '';
        }

        const indexInLista = playlistFotoAttuale.length;
        playlistFotoAttuale.push(item.percorso);

        const imgThumb = document.createElement('img');
        imgThumb.src = item.percorso;
        imgThumb.loading = "lazy";
        imgThumb.decoding = "async";
        imgThumb.alt = `${config.titolo} - Foto ${item.idx}`;
        imgThumb.onclick = () => apriFotoEspansa(indexInLista);
        griglia.appendChild(imgThumb);
      } else {
        continuaScansione = false;
        break;
      }
    }

    if (trovateNelLotto < DIMENSIONE_LOTTO) {
      continuaScansione = false;
    } else {
      numeroInizio += DIMENSIONE_LOTTO;
    }
  }

  if (!trovataAlmenoUna && sessioneGalleriaId === sessioneCorrente) {
    griglia.innerHTML = '<div style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Nessuna foto trovata nella cartella.</div>';
  }
};

function cercaPrimoFormatoValido(cartella, numero) {
  const verifiche = estensioniPossibili.map(ext => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const percorso = `${cartella}${numero}.${ext}`;
      img.onload = () => resolve(percorso);
      img.onerror = () => reject();
      img.src = percorso;
    });
  });

  return Promise.any(verifiche).catch(() => null);
}

window.apriFotoEspansa = function(indice) {
  indiceFotoAttuale = indice;
  document.getElementById('galleria-espansa').style.display = 'flex';
  aggiornaVistaFoto();
};

window.chiudiFotoEspansa = function() {
  document.getElementById('galleria-espansa').style.display = 'none';
};

window.chiudiGalleria = function() {
  sessioneGalleriaId++;
  document.getElementById('modal-galleria').style.display = 'none';
  chiudiFotoEspansa();
  document.body.style.overflow = 'auto';
};

window.cambiaFotoGalleria = function(direzione) {
  if (playlistFotoAttuale.length === 0) return;
  
  indiceFotoAttuale += direzione;

  if (indiceFotoAttuale < 0) {
    indiceFotoAttuale = playlistFotoAttuale.length - 1;
  } else if (indiceFotoAttuale >= playlistFotoAttuale.length) {
    indiceFotoAttuale = 0;
  }
  aggiornaVistaFoto();
};

function aggiornaVistaFoto() {
  const imgElement = document.getElementById('img-galleria');
  const contatore = document.getElementById('contatore-foto');

  imgElement.src = playlistFotoAttuale[indiceFotoAttuale];
  contatore.innerText = `${indiceFotoAttuale + 1} / ${playlistFotoAttuale.length}`;
}

document.addEventListener('keydown', function(event) {
  const espansa = document.getElementById('galleria-espansa').style.display === 'flex';
  const griglia = document.getElementById('modal-galleria').style.display === 'flex';

  if (espansa) {
    if (event.key === 'ArrowLeft') cambiaFotoGalleria(-1);
    if (event.key === 'ArrowRight') cambiaFotoGalleria(1);
    if (event.key === 'Escape') chiudiFotoEspansa();
  } else if (griglia) {
    if (event.key === 'Escape') chiudiGalleria();
  }
});
