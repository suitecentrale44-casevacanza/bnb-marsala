/* ==========================================
   GOOGLE TRANSLATE E GESTIONE COOKIE (OTTIMIZZATO)
   ========================================== */

// Funzione per mostrare di nuovo la pagina in sicurezza
function mostraPaginaTradotta() {
  document.documentElement.style.opacity = '1';
}

window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'it',
    includedLanguages: 'en,de,fr,es,nl',
    autoDisplay: false
  }, 'google_translate_element');

  // Appena Google Translate ha finito di caricarsi, mostriamo la pagina
  setTimeout(mostraPaginaTradotta, 100);
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
   INIZIALIZZAZIONE EVENTI E PROTEZIONE
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
  // Salva-vita: Se Google Translate impiega troppo a caricare, mostra comunque la pagina dopo 1 secondo
  setTimeout(mostraPaginaTradotta, 1000);

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
   11. MOTORE GALLERIE FOTO (PARALLELO AD ALTE PRESTAZIONI)
   ========================================== */

const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', titolo: 'Suite Centrale 44' },
  'corallo':  { cartella: 'image/suite-corallo/',  titolo: 'Suite Corallo' },
  'oceano':   { cartella: 'image/suite-oceano/',   titolo: 'Suite Oceano' }
};

const estensioniPossibili = ["jpg", "jpeg", "png", "JPG", "JPEG"];
const MAX_FOTO_DA_CONTROLLARE = 30; // Numero massimo di foto da cercare per cartella

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;

// 1. APRE LA GALLERIA E CARICA LE FOTO IN PARALLELO
window.apriGalleria = async function(nomeSuite) {
  const config = configurazioneGallerie[nomeSuite];
  playlistFotoAttuale = [];
  
  document.getElementById('titolo-galleria').innerText = `Galleria Foto - ${config.titolo}`;
  const griglia = document.getElementById('galleria-griglia');
  griglia.innerHTML = '<div id="stato-ricerca" style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Caricamento  in corso...</div>';
  
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 

  // Avvia la ricerca di TUTTE le foto contemporaneamente
  const controlli = [];
  for (let i = 1; i <= MAX_FOTO_DA_CONTROLLARE; i++) {
    controlli.push(trovaFotoEsistente(config.cartella, i));
  }

  // Attende la verifica istantanea
  const risultati = await Promise.all(controlli);
  
  // Filtra solo le foto realmente esistenti mantenendo l'ordine numerico esatto
  playlistFotoAttuale = risultati.filter(percorso => percorso !== null);

  griglia.innerHTML = ''; // Pulisce il messaggio di attesa

  if (playlistFotoAttuale.length === 0) {
    griglia.innerHTML = '<div style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Nessuna foto trovata nella cartella.</div>';
    return;
  }

  // Genera le miniature nella griglia
  playlistFotoAttuale.forEach((percorso, index) => {
    const imgThumb = document.createElement('img');
    imgThumb.src = percorso;
    imgThumb.loading = "lazy"; // Differisce il caricamento pesante delle foto fuori dallo schermo
    imgThumb.onclick = () => apriFotoEspansa(index);
    griglia.appendChild(imgThumb);
  });
};

// Funzione ausiliaria che prova le estensioni in parallelo per una singola foto
function trovaFotoEsistente(cartella, numero) {
  return new Promise((resolve) => {
    let trovata = false;
    let tentativi = 0;

    estensioniPossibili.forEach((ext) => {
      const percorso = `${cartella}${numero}.${ext}`;
      const img = new Image();

      img.onload = () => {
        if (!trovata) {
          trovata = true;
          resolve(percorso);
        }
      };

      img.onerror = () => {
        tentativi++;
        if (tentativi === estensioniPossibili.length && !trovata) {
          resolve(null);
        }
      };

      img.src = percorso;
    });
  });
}

// 2. GESTIONE FOTO INGRANDITA
window.apriFotoEspansa = function(indice) {
  indiceFotoAttuale = indice;
  document.getElementById('galleria-espansa').style.display = 'flex';
  aggiornaVistaFoto();
};

window.chiudiFotoEspansa = function() {
  document.getElementById('galleria-espansa').style.display = 'none';
};

window.chiudiGalleria = function() {
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

// Navigazione da tastiera
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
