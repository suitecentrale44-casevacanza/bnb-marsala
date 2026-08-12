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
  
  // Imposta il flag temporaneo solo per questa sessione di cambio lingua
  sessionStorage.setItem('salta_splash', 'true');

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

  // Se è visibile, applica la dissolvenza normale
  if (splash.style.display !== 'none' && !splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 800);
  }
};

/* ==========================================
   INIZIALIZZAZIONE EVENTI DOM
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
  // Ripristina la classe della bandiera salvata
  const flagClassSalvata = localStorage.getItem('flag_class_selezionata');
  const activeFlag = document.getElementById('activeFlag');
  if (flagClassSalvata && activeFlag) {
    activeFlag.className = 'flag-icon ' + flagClassSalvata;
  }

  // Gestione menu a tendina lingua
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

  // Se lo splash è visibile (apertura normale/F5), lo chiude dopo 1.5 secondi
  setTimeout(nascondiSplash, 1500);
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
