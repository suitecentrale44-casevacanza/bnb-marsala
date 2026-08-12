/* ==========================================
   WEB COMPONENT: AIRBNB BUTTON
   ========================================== */
class AirbnbBtn extends HTMLElement {
  connectedCallback() {
    const url = this.getAttribute('url') || '#';
    this.innerHTML = `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-airbnb-official">
        <svg class="airbnb-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025 1.954 3.83 6.114 12.57c.712 1.464.913 2.861.571 4.08-.34 1.22-1.22 2.198-2.502 2.772l-.398.163c-1.32.488-2.827.42-4.17-.213l-.448-.225-3.08-1.682-1.07-.604c-.396-.226-.856-.345-1.323-.345s-.927.119-1.323.345l-1.07.604-3.08 1.682c-1.32.721-2.883.82-4.283.284l-.335-.142c-1.282-.574-2.162-1.552-2.502-2.772-.342-1.219-.141-2.616.571-4.08l6.114-12.57 1.954-3.83.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.222.651-3.152 2.376l-.372.736-1.921 3.766-6.082 12.503c-.515 1.06-.615 1.97-.375 2.827.24.856.883 1.503 1.802 1.913l.265.105c.952.348 2.02.268 2.946-.237l.321-.186 3.08-1.682 1.107-.625c.783-.442 1.683-.675 2.597-.675s1.814.233 2.597.675l1.107.625 3.08 1.682c.983.537 2.115.603 3.123.197l.144-.061c.919-.41 1.562-1.057 1.802-1.913.24-.857.14-1.767-.375-2.827l-6.082-12.503-1.921-3.766-.372-.736C18.222 3.651 17.239 3 16 3zm0 8c2.761 0 5 2.239 5 5 0 2.223-1.45 4.108-3.468 4.757l-.37.105c-.381.096-.777.138-1.162.138-.385 0-.781-.042-1.162-.138l-.37-.105C12.45 20.108 11 18.223 11 16c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.272.793 2.358 1.912 2.782l.21.068c.284.072.578.103.878.103.3 0 .594-.031.878-.103l.21-.068C18.207 18.358 19 17.272 19 16c0-1.657-1.343-3-3-3z"/>
        </svg>
        <span>Airbnb</span>
      </a>
    `;
  }
}
customElements.define('airbnb-button', AirbnbBtn);

/* ==========================================
   GOOGLE TRANSLATE E LINGUA
   ========================================== */
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'it',
    includedLanguages: 'en,de,fr,es,nl',
    autoDisplay: false
  }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', function() {
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
  
  // Timer di fallback per lo splash screen
  setTimeout(nascondiSplash, 2000);
});

window.cambiaLingua = function(codiceLingua, flagEmoji) {
  const activeFlag = document.getElementById('activeFlag');
  const langDropdown = document.getElementById('langDropdown');

  if (activeFlag) activeFlag.textContent = flagEmoji;
  if (langDropdown) langDropdown.classList.remove('show');

  if (codiceLingua === 'it') {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
    window.location.reload();
  } else {
    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = codiceLingua;
      selectElem.dispatchEvent(new Event('change'));
    }
  }
}

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
}

window.rifiutaCookie = function() {
  localStorage.setItem('consenso_cookie', 'rifiutato');
  const banner = document.getElementById('cookie-banner');
  if(banner) banner.style.display = 'none';
}

// Inizializzazione banner
const consenso = localStorage.getItem('consenso_cookie');
if (consenso === 'accettato') {
  const banner = document.getElementById('cookie-banner');
  if(banner) banner.style.display = 'none';
  caricaAnalytics();
} else if (consenso === 'rifiutato') {
  const banner = document.getElementById('cookie-banner');
  if(banner) banner.style.display = 'none';
}

/* ==========================================
   SPLASH SCREEN LOGIC
   ========================================== */
window.nascondiSplash = function() {
  const splash = document.getElementById('splash-screen');
  if (splash && !splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 800);
  }
}

/* ==========================================
   MODAL CALENDARI LOGIC
   ========================================== */
window.apriCalendario = function(idDelPopup) {
  const modal = document.getElementById(idDelPopup);
  if(modal) modal.style.display = "flex";
}

window.chiudiCalendario = function(idDelPopup) {
  const modal = document.getElementById(idDelPopup);
  if(modal) modal.style.display = "none";
}

window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-calendario')) {
    event.target.style.display = "none";
  }
});

/* ==========================================
   RICHIESTA WHATSAPP LOGIC
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
}
