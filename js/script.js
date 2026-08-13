/* ==========================================
   GOOGLE TRANSLATE E GESTIONE COOKIE
   ========================================== */
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'it',
    includedLanguages: 'en,de,fr,es,nl',
    autoDisplay: false
  }, 'google_translate_element');
};

function impostaCookieGoogleTranslate(lang) {
  const domain = window.location.hostname;
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + domain + "; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + domain + "; path=/;";

  if (lang !== 'it') {
    document.cookie = "googtrans=/it/" + lang + "; path=/;";
    document.cookie = "googtrans=/it/" + lang + "; domain=" + domain + "; path=/;";
  }
}

window.cambiaLingua = function(codiceLingua, flagClass) {
  localStorage.setItem('lingua_selezionata', codiceLingua);
  localStorage.setItem('flag_class_selezionata', flagClass);
  localStorage.setItem('salta_splash', 'true');

  const activeFlag = document.getElementById('activeFlag');
  if (activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClass;
  }

  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) langDropdown.classList.remove('show');

  impostaCookieGoogleTranslate(codiceLingua);
  window.location.reload();
};

/* ==========================================
   SPLASH SCREEN LOGIC
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
    }, 800);
  }
};

/* ==========================================
   INIZIALIZZAZIONE EVENTI
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
  const flagClassSalvata = localStorage.getItem('flag_class_selezionata');
  const activeFlag = document.getElementById('activeFlag');
  if (flagClassSalvata && activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClassSalvata;
  }

  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
      if (!langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
        langDropdown.classList.remove('show');
      }
    });
  }

  setTimeout(nascondiSplash, 2000);
});

/* ==========================================
   COOKIE E ANALYTICS
   ========================================== */
const ANALYTICS_ID = 'G-C291PEHWM7';

function caricaAnalytics() {
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

const consenso = localStorage.getItem('consenso_cookie');
if (consenso === 'accettato') {
  caricaAnalytics();
}

/* ==========================================
   MODAL CALENDARI
   ========================================== */
window.apriCalendario = function(idDelPopup) {
  const modal = document.getElementById(idDelPopup);
  if(modal) modal.style.display = "flex";
};

window.chiudiCalendario = function(idDelPopup) {
  const modal = document.getElementById(idDelPopup);
  if(modal) modal.style.display = "none";
};

window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-calendario')) {
    event.target.style.display = "none";
  }
});

/* ==========================================
   RICHIESTA WHATSAPP
   ========================================== */
window.inviaRichiestaWA = function(nomeSuite, idCheckin, idCheckout) {
  const checkin = document.getElementById(idCheckin).value;
  const checkout = document.getElementById(idCheckout).value;

  if (!checkin || !checkout) {
    alert("Per favore, seleziona sia la data di Check-in che quella di Check-out prima di inviare!");
    return;
  }

  if (new Date(checkout) <= new Date(checkin)) {
    alert("La data di Check-out deve essere successiva a quella di Check-in!");
    return;
  }

  const dataInFormattata = new Date(checkin).toLocaleDateString('it-IT');
  const dataOutFormattata = new Date(checkout).toLocaleDateString('it-IT');

  const messaggio = `Ciao! Ho visitato il vostro sito e vorrei informazioni sulla disponibilità per la ${nomeSuite} dal ${dataInFormattata} al ${dataOutFormattata}.`;
  
  const urlWhatsApp = `https://wa.me/393477640421?text=${encodeURIComponent(messaggio)}`;
  window.open(urlWhatsApp, '_blank');
};

/* ==========================================
   11. MOTORE GALLERIE FOTO AUTOMATICO (MULTI-ESTENSIONE)
   ========================================== */

// Abbiamo rimosso "estensione" da qui, ora è tutto automatico!
const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/' },
  'corallo':  { cartella: 'image/suite-corallo/' },
  'oceano':   { cartella: 'image/suite-oceano/' }
};

// Elenco delle estensioni da provare, in ordine di priorità
const estensioniPossibili = ["jpeg", "jpg", "JPEG", "JPG", "png"];

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;
let ricercaInCorso = false; // Protezione per evitare che l'utente clicchi due volte

window.apriGalleria = function(nomeSuite) {
  if (ricercaInCorso) return; 
  ricercaInCorso = true;
  
  const config = configurazioneGallerie[nomeSuite];
  playlistFotoAttuale = [];
  indiceFotoAttuale = 0;
  
  // Blocca la pagina sotto e mostra la finestra modale
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 
  
  const contatore = document.getElementById('contatore-foto');
  const imgElement = document.getElementById('img-galleria');
  
  contatore.innerText = "Ricerca automatica foto...";
  imgElement.src = ""; // Svuota l'immagine precedente
  
  // Inizia la ricerca dalla foto numero 1, provando la primissima estensione (indice 0)
  cercaFotoInModoSicuro(config.cartella, 1, 0);
};

function cercaFotoInModoSicuro(cartella, numero, indiceEst) {
  // Se abbiamo provato TUTTE le estensioni per questo numero e nessuna funziona,
  // significa che non ci sono più foto in cartella. Abbiamo finito!
  if (indiceEst >= estensioniPossibili.length) {
    ricercaInCorso = false; 
    
    if (playlistFotoAttuale.length === 0) {
      document.getElementById('contatore-foto').innerText = "Nessuna foto trovata nella cartella.";
    } else {
      aggiornaVistaFoto(); // Imposta il contatore finale (es. "1 / 15")
    }
    return;
  }

  const estensioneCorrente = estensioniPossibili[indiceEst];
  const percorso = `${cartella}${numero}.${estensioneCorrente}`;
  const img = new Image();
  
  // CASO A: Il server risponde che la foto ESISTE!
  img.onload = function() {
    playlistFotoAttuale.push(percorso);
    
    // Mostriamo immediatamente la prima foto appena trovata per non far aspettare
    if (numero === 1) {
      aggiornaVistaFoto();
    } else {
      document.getElementById('contatore-foto').innerText = `${indiceFotoAttuale + 1} / ${playlistFotoAttuale.length}`;
    }
    
    // Ora cerchiamo la foto successiva (numero + 1), ripartendo dalla prima estensione (0)
    cercaFotoInModoSicuro(cartella, numero + 1, 0);
  };
  
  // CASO B: La foto NON ESISTE con questa estensione. Proviamo la successiva nell'elenco!
  img.onerror = function() {
    cercaFotoInModoSicuro(cartella, numero, indiceEst + 1);
  };
  
  // Questa riga fa partire la verifica sicura chiedendo la foto al server
  img.src = percorso;
}

window.cambiaFotoGalleria = function(direzione) {
  // Evita errori se l'utente clicca le frecce mentre sta ancora caricando
  if (playlistFotoAttuale.length === 0) return;

  indiceFotoAttuale += direzione;

  // Effetto "circolare": se scorri oltre l'ultima, torni alla prima
  if (indiceFotoAttuale < 0) {
    indiceFotoAttuale = playlistFotoAttuale.length - 1;
  } else if (indiceFotoAttuale >= playlistFotoAttuale.length) {
    indiceFotoAttuale = 0;
  }

  aggiornaVistaFoto();
};

window.chiudiGalleria = function() {
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'none';
  // Sblocca la pagina per poter scorrere di nuovo il sito
  document.body.style.overflow = 'auto'; 
};

function aggiornaVistaFoto() {
  const imgElement = document.getElementById('img-galleria');
  const contatore = document.getElementById('contatore-foto');
  
  imgElement.src = playlistFotoAttuale[indiceFotoAttuale];
  contatore.innerText = `${indiceFotoAttuale + 1} / ${playlistFotoAttuale.length}`;
}

// Navigazione comoda e sicura con la tastiera del computer
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('modal-galleria');
  if (modal && modal.style.display === 'flex') {
    if (event.key === 'ArrowLeft') cambiaFotoGalleria(-1);
    if (event.key === 'ArrowRight') cambiaFotoGalleria(1);
    if (event.key === 'Escape') chiudiGalleria();
  }
});
