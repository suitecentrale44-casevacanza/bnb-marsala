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
   11. MOTORE GALLERIE FOTO (GRIGLIA + ESPANSIONE)
   ========================================== */

const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', titolo: 'Suite Centrale 44' },
  'corallo':  { cartella: 'image/suite-corallo/',  titolo: 'Suite Corallo' },
  'oceano':   { cartella: 'image/suite-oceano/',   titolo: 'Suite Oceano' }
};

const estensioniPossibili = ["jpeg", "jpg", "JPEG", "JPG", "png"];

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;
let ricercaInCorso = false;

// 1. APRE LA FINESTRA PRINCIPALE (MODALITÀ GRIGLIA)
window.apriGalleria = function(nomeSuite) {
  if (ricercaInCorso) return; 
  ricercaInCorso = true;
  
  const config = configurazioneGallerie[nomeSuite];
  playlistFotoAttuale = [];
  
  // Modifica il titolo in alto (es. "Galleria Foto - Suite Corallo")
  document.getElementById('titolo-galleria').innerText = `Galleria Foto - ${config.titolo}`;
  
  // Prepara la griglia pulendola dai caricamenti precedenti
  const griglia = document.getElementById('galleria-griglia');
  griglia.innerHTML = '<div id="stato-ricerca" style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Ricerca foto in corso, attendere...</div>';
  
  // Mostra il contenitore principale bloccando lo scroll della pagina sotto
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 
  
  // Inizia la ricerca automatica sicura (parte dalla foto 1, estensione 0)
  cercaFotoInModoSicuro(config.cartella, 1, 0);
};

// 2. FUNZIONE CHE CERCA LE FOTO NEL SERVER
function cercaFotoInModoSicuro(cartella, numero, indiceEst) {
  if (indiceEst >= estensioniPossibili.length) {
    // Abbiamo provato tutte le estensioni e fallito: le foto sono finite!
    ricercaInCorso = false; 
    const stato = document.getElementById('stato-ricerca');
    if (stato) {
      stato.innerText = playlistFotoAttuale.length === 0 ? "Nessuna foto trovata nella cartella." : "";
      if(playlistFotoAttuale.length > 0) stato.remove();
    }
    return;
  }

  const estensioneCorrente = estensioniPossibili[indiceEst];
  const percorso = `${cartella}${numero}.${estensioneCorrente}`;
  const img = new Image();
  
  // CASO A: La foto ESISTE
  img.onload = function() {
    // Rimuove la scritta "Ricerca in corso" appena trova la prima foto
    const stato = document.getElementById('stato-ricerca');
    if(stato) stato.remove();

    // Aggiunge il percorso alla nostra playlist
    const indiceAssegnato = playlistFotoAttuale.length;
    playlistFotoAttuale.push(percorso);
    
    // Crea la miniatura da mettere nella griglia!
    const griglia = document.getElementById('galleria-griglia');
    const imgThumb = document.createElement('img');
    imgThumb.src = percorso;
    imgThumb.loading = "lazy"; // Ottimizzazione prestazioni
    
    // Quando clicco sulla miniatura, si apre la modalità "Espansa"
    imgThumb.onclick = function() {
      apriFotoEspansa(indiceAssegnato);
    };
    
    griglia.appendChild(imgThumb);
    
    // Cerca la foto successiva
    cercaFotoInModoSicuro(cartella, numero + 1, 0);
  };
  
  // CASO B: La foto NON ESISTE, provo la prossima estensione
  img.onerror = function() {
    cercaFotoInModoSicuro(cartella, numero, indiceEst + 1);
  };
  
  img.src = percorso;
}

// 3. APRE LA FOTO SINGOLA INGRANDITA
window.apriFotoEspansa = function(indice) {
  indiceFotoAttuale = indice;
  const contenitoreEspanso = document.getElementById('galleria-espansa');
  contenitoreEspanso.style.display = 'flex';
  aggiornaVistaFoto();
};

// 4. CHIUDE LA FOTO INGRANDITA (TORNA ALLA GRIGLIA)
window.chiudiFotoEspansa = function() {
  const contenitoreEspanso = document.getElementById('galleria-espansa');
  contenitoreEspanso.style.display = 'none';
};

// 5. CHIUDE TUTTA LA GALLERIA (TORNA AL SITO)
window.chiudiGalleria = function() {
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'none';
  // Chiude anche quella espansa, per sicurezza, se era aperta
  chiudiFotoEspansa();
  document.body.style.overflow = 'auto'; // Riattiva lo scroll del sito
};

// 6. SCORRE LE FOTO QUANDO SONO INGRANDITE
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

// 7. AGGIORNA IMMAGINE E CONTATORE
function aggiornaVistaFoto() {
  const imgElement = document.getElementById('img-galleria');
  const contatore = document.getElementById('contatore-foto');
  
  imgElement.src = playlistFotoAttuale[indiceFotoAttuale];
  contatore.innerText = `${indiceFotoAttuale + 1} / ${playlistFotoAttuale.length}`;
}

// 8. COMANDI DA TASTIERA
document.addEventListener('keydown', function(event) {
  const espansaAperta = document.getElementById('galleria-espansa').style.display === 'flex';
  const grigliaAperta = document.getElementById('modal-galleria').style.display === 'flex';
  
  // Se stiamo guardando la foto ingrandita:
  if (espansaAperta) {
    if (event.key === 'ArrowLeft') cambiaFotoGalleria(-1);
    if (event.key === 'ArrowRight') cambiaFotoGalleria(1);
    if (event.key === 'Escape') chiudiFotoEspansa(); // L'ESC torna alla griglia
  } 
  // Se stiamo guardando la griglia (ma non la foto espansa):
  else if (grigliaAperta) {
    if (event.key === 'Escape') chiudiGalleria(); // L'ESC torna al sito
  }
});
