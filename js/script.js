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
   11. MOTORE GALLERIE FOTO UNIFICATO
   ========================================== */

// Configurazione delle 3 Suite. 
// Modifica "totaleFoto" con il numero esatto di foto per ogni casa.
const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', totaleFoto: 15, estensione: 'jpg' },
  'corallo':  { cartella: 'image/suite-corallo/',  totaleFoto: 15, estensione: 'jpg' },
  'oceano':   { cartella: 'image/suite-oceano/',   totaleFoto: 15, estensione: 'jpg' }
};

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;

window.apriGalleria = function(nomeSuite) {
  const config = configurazioneGallerie[nomeSuite];
  
  // Svuota la playlist e la riempie con le foto della suite cliccata
  playlistFotoAttuale = [];
  for (let i = 1; i <= config.totaleFoto; i++) {
    playlistFotoAttuale.push(`${config.cartella}${i}.${config.estensione}`);
  }

  // Resetta l'indice e mostra la finestra
  indiceFotoAttuale = 0;
  aggiornaVistaFoto();
  
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  
  // Blocca lo scorrimento della pagina di sottofondo
  document.body.style.overflow = 'hidden'; 
};

window.cambiaFotoGalleria = function(direzione) {
  indiceFotoAttuale += direzione;

  // Effetto pac-man: se vado oltre la fine, torno all'inizio e viceversa
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
  
  // Sblocca lo scorrimento della pagina
  document.body.style.overflow = 'auto'; 
};

function aggiornaVistaFoto() {
  const imgElement = document.getElementById('img-galleria');
  const contatore = document.getElementById('contatore-foto');
  
  // Mostra l'immagine
  imgElement.src = playlistFotoAttuale[indiceFotoAttuale];
  
  // Mostra il numeretto (es. 1 / 15)
  contatore.innerText = `${indiceFotoAttuale + 1} / ${playlistFotoAttuale.length}`;
}

// Supporto per la tastiera (Frecce ed ESC)
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('modal-galleria');
  if (modal && modal.style.display === 'flex') {
    if (event.key === 'ArrowLeft') cambiaFotoGalleria(-1);
    if (event.key === 'ArrowRight') cambiaFotoGalleria(1);
    if (event.key === 'Escape') chiudiGalleria();
  }
});
