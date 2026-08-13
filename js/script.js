/* ==========================================
   1. GESTIONE LINGUA OTTIMIZZATA
   ========================================== */

window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'it',
    includedLanguages: 'en,de,fr,es,nl',
    autoDisplay: false
  }, 'google_translate_element');
};

// Apre e chiude il menu a tendina delle bandiere
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

function impostaCookieGoogleTranslate(lang) {
  const domain = window.location.hostname;
  // Cancella tutti i cookie di traduzione precedenti
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + domain + "; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + domain + "; path=/;";

  if (lang && lang !== 'it') {
    document.cookie = "googtrans=/it/" + lang + "; path=/;";
    document.cookie = "googtrans=/it/" + lang + "; domain=" + domain + "; path=/;";
  }
}

// CAMBIO LINGUA CORRETTO
window.cambiaLingua = function(codiceLingua, flagClass) {
  localStorage.setItem('lingua_selezionata', codiceLingua);
  localStorage.setItem('flag_class_selezionata', flagClass);

  const activeFlag = document.getElementById('activeFlag');
  if (activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClass;
  }

  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) langDropdown.classList.remove('show');

  // Pulizia/Impostazione dei cookie
  impostaCookieGoogleTranslate(codiceLingua);

  // SE SI TORNA IN ITALIANO: Ricarica pulita per ripristinare il testo originale
  if (codiceLingua === 'it') {
    window.location.reload();
    return;
  }

  // PER LE ALTRE LINGUE: Cambio dinamico istantaneo
  const selectGoogle = document.querySelector('.goog-te-combo');
  if (selectGoogle) {
    selectGoogle.value = codiceLingua;
    selectGoogle.dispatchEvent(new Event('change'));
  } else {
    window.location.reload();
  }
};

/* ==========================================
   2. SPLASH SCREEN (DISATTIVAZIONE RAPIDA)
   ========================================== */
window.nascondiSplash = function() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  if (!splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.setProperty('display', 'none', 'important');
    }, 500);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Ripristina la bandiera salvata dall'utente
  const flagClassSalvata = localStorage.getItem('flag_class_selezionata');
  const activeFlag = document.getElementById('activeFlag');
  if (flagClassSalvata && activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClassSalvata;
  }

  // Nasconde lo splash screen rapidamente (500ms)
  setTimeout(window.nascondiSplash, 500);
});

window.addEventListener('load', function() {
  setTimeout(window.nascondiSplash, 200);
});

/* ==========================================
   3. COOKIE E GOOGLE ANALYTICS
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
   5. MOTORE GALLERIE FOTO (PARALLELO AD ALTE PRESTAZIONI)
   ========================================== */
const configurazioneGallerie = {
  'centrale': { cartella: 'image/suite-centrale/', titolo: 'Suite Centrale 44' },
  'corallo':  { cartella: 'image/suite-corallo/',  titolo: 'Suite Corallo' },
  'oceano':   { cartella: 'image/suite-oceano/',   titolo: 'Suite Oceano' }
};

const estensioniPossibili = ["jpg", "jpeg", "png", "JPG", "JPEG"];
const MAX_FOTO_DA_CONTROLLARE = 30;

let playlistFotoAttuale = [];
let indiceFotoAttuale = 0;

window.apriGalleria = async function(nomeSuite) {
  const config = configurazioneGallerie[nomeSuite];
  playlistFotoAttuale = [];
  
  document.getElementById('titolo-galleria').innerText = `Galleria Foto - ${config.titolo}`;
  const griglia = document.getElementById('galleria-griglia');
  griglia.innerHTML = '<div id="stato-ricerca" style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">⚡ Caricamento rapido in corso...</div>';
  
  const modal = document.getElementById('modal-galleria');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 

  const controlli = [];
  for (let i = 1; i <= MAX_FOTO_DA_CONTROLLARE; i++) {
    controlli.push(trovaFotoEsistente(config.cartella, i));
  }

  const risultati = await Promise.all(controlli);
  playlistFotoAttuale = risultati.filter(percorso => percorso !== null);

  griglia.innerHTML = ''; 

  if (playlistFotoAttuale.length === 0) {
    griglia.innerHTML = '<div style="grid-column: 1 / -1; color:white; text-align:center; padding: 20px;">Nessuna foto trovata nella cartella.</div>';
    return;
  }

  playlistFotoAttuale.forEach((percorso, index) => {
    const imgThumb = document.createElement('img');
    imgThumb.src = percorso;
    imgThumb.loading = "lazy";
    imgThumb.onclick = () => apriFotoEspansa(index);
    griglia.appendChild(imgThumb);
  });
};

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
