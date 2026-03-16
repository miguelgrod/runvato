(function () {
  var CONSENT_KEY = 'runvato_cookie_consent';
  var GTM_ID = 'GTM-KDDHTXZL';

  function loadGTM() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  function hideBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) {
      el.style.transform = 'translateY(120%)';
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
    }
  }

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBanner();
    loadGTM();
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    hideBanner();
  }

  function showBanner(cookiesPath) {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:9999', 'background:#111', 'border:1px solid #222',
      'border-radius:12px', 'padding:16px 20px', 'max-width:520px', 'width:calc(100% - 32px)',
      'display:flex', 'gap:16px', 'align-items:center', 'flex-wrap:wrap',
      'font-family:Lexend,sans-serif', 'font-size:13px', 'color:#aaa',
      'box-shadow:0 8px 32px rgba(0,0,0,0.6)',
      'transition:transform 0.4s ease,opacity 0.4s ease'
    ].join(';');
    banner.innerHTML =
      '<span style="flex:1;min-width:180px">' +
        'Usamos cookies de analítica (Google Analytics) para mejorar la experiencia. ' +
        '<a href="' + cookiesPath + '" style="color:#D1FF00;text-decoration:none">Más info</a>' +
      '</span>' +
      '<div style="display:flex;gap:8px;flex-shrink:0">' +
        '<button onclick="cookieConsent.reject()" style="' +
          'background:transparent;border:1px solid #333;color:#aaa;' +
          'border-radius:6px;padding:7px 14px;cursor:pointer;font-family:Lexend,sans-serif;font-size:12px' +
        '">Rechazar</button>' +
        '<button onclick="cookieConsent.accept()" style="' +
          'background:#D1FF00;border:none;color:#000;font-weight:700;' +
          'border-radius:6px;padding:7px 14px;cursor:pointer;font-family:Lexend,sans-serif;font-size:12px' +
        '">Aceptar</button>' +
      '</div>';
    document.body.appendChild(banner);
  }

  window.cookieConsent = { accept: accept, reject: reject };

  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadGTM();
  } else if (!consent) {
    // Detect relative path to cookies.html based on current page depth
    var path = window.location.pathname;
    var depth = (path.match(/\//g) || []).length - 1;
    var prefix = depth <= 1 ? '' : '../';
    var cookiesPath = prefix + 'web/cookies.html';

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { showBanner(cookiesPath); });
    } else {
      showBanner(cookiesPath);
    }
  }
})();
