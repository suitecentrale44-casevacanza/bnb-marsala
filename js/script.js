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

// Toggle del menu bandiere
window.toggleLangDropdown = function(e) {
  if (e) e.stopPropagation();
  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) {
    langDropdown.classList.toggle('show');
  }
};

// Chiude il menu se si clicca fuori
document.addEventListener('click', function(e) {
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown && langBtn && !langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
    langDropdown.classList.remove('show');
  }
});

// Pulizia profonda e rimozione cookie di traduzione
function gestisciCookieTranslate(lang) {
  const dominio = window.location.hostname;
  
  // Cancella i cookie da tutti i possibili percorsi e domini
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + dominio + ";";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + dominio + ";";

  // Imposta il nuovo cookie solo se la lingua NON è l'italiano
  if (lang && lang !== 'it') {
    document.cookie = "googtrans=/it/" + lang + "; path=/;";
    document.cookie = "googtrans=/it/" + lang + "; path=/; domain=" + dominio + ";";
  }
}

// CAMBIO LINGUA
window.cambiaLingua = function(codiceLingua, flagClass) {
  localStorage.setItem('lingua_selezionata', codiceLingua);
  localStorage.setItem('flag_class_selezionata', flagClass);
  localStorage.setItem('salta_splash', 'true'); // Evita di mostrare di nuovo lo splash screen

  gestisciCookieTranslate(codiceLingua);

  const activeFlag = document.getElementById('activeFlag');
  if (activeFlag) activeFlag.className = 'flag-icon ' + flagClass;

  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) langDropdown.classList.remove('show');

  // SE SI TORNA ALL'ITALIANO: ricarica rapida per ripristinare il testo pulito dal server
  if (codiceLingua === 'it') {
    window.location.reload();
    return;
  }

  // PER LE ALTRE LINGUE: applica subito la traduzione via selettore Google
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
   4. MODAL CALENDARI E WHATSAPP
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
   5. MOTORE GALLERIA ULTRA-VELOCE (LOTTI PARALLELI)
   ========================================== */

const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', titolo: 'Suite Centrale 44' },
  'corallo':  { cartella: 'image/suite-corallo/',  titolo: 'Suite Corallo' },
  'oceano':   { cartella: 'image/suite-oceano/',   titolo: 'Suite Oceano' }
};

// Formati supportati (WebP per primo perché è il più rapido da scaricare)
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

  let numeroInizio = 0; // Numerazione parte da 0
  const DIMENSIONE_LOTTO = 10; // Cerca 10 foto contemporaneamente in parallelo!
  let continuaScansione = true;
  let trovataAlmenoUna = false;

  while (continuaScansione) {
    if (sessioneGalleriaId !== sessioneCorrente) return;

    // Crea 10 richieste parallele [numeroInizio ... numeroInizio + 9]
    const promesseLotto = [];
    for (let i = 0; i < DIMENSIONE_LOTTO; i++) {
      const idx = numeroInizio + i;
      promesseLotto.push(
        cercaPrimoFormatoValido(config.cartella, idx).then(percorso => ({ idx, percorso }))
      );
    }

    // Attende tutte e 10 le verifiche nello stesso identico istante
    const risultati = await Promise.all(promesseLotto);

    if (sessioneGalleriaId !== sessioneCorrente) return;

    // Ordina per indice numerico corretto (0, 1, 2, 3...)
    risultati.sort((a, b) => a.idx - b.idx);

    let trovateNelLotto = 0;

    for (const item of risultati) {
      if (item.percorso) {
        trovateNelLotto++;
        if (!trovataAlmenoUna) {
          trovataAlmenoUna = true;
          griglia.innerHTML = ''; // Pulisce il messaggio di caricamento
        }

        const indexInLista = playlistFotoAttuale.length;
        playlistFotoAttuale.push(item.percorso);

        // Rendering immediato della miniatura
        const imgThumb = document.createElement('img');
        imgThumb.src = item.percorso;
        imgThumb.loading = "lazy";
        imgThumb.decoding = "async"; // Decodifica in background senza bloccare lo schermo
        imgThumb.alt = `${config.titolo} - Foto ${item.idx}`;
        imgThumb.onclick = () => apriFotoEspansa(indexInLista);
        griglia.appendChild(imgThumb);
      } else {
        // Appena si interrompe la sequenza numerica, fermiamo la ricerca
        continuaScansione = false;
        break;
      }
    }

    if (trovateNelLotto < DIMENSIONE_LOTTO) {
      continuaScansione = false; // Meno di 10 foto nel lotto = le foto sono finite
    } else {
      numeroInizio += DIMENSIONE_LOTTO; // Passa al lotto successivo (10-19, 20-29...)
    }
  }

  if (!trovataAlmenoUna && sessioneGalleriaId === sessioneCorrente) {
    griglia.innerHTML = '<div style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Nessuna foto trovata nella cartella.</div>';
  }
};

// Cerca tutte le estensioni dell'indice in parallelo
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
