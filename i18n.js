/* i18n.js -- Bilingual toggle for Big Ragu's spec site
   Languages: EN (default for non-Spanish browsers) / ES (primary for Spanish browsers)
   No page reload. All text lives in data-en / data-es attributes on DOM elements.
*/

const html = document.documentElement;
const toggle = document.getElementById('langToggle');

function detectLang() {
  const nav = navigator.language || navigator.userLanguage || '';
  return nav.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang === 'es' ? 'es' : 'en');

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) {
      el.innerHTML = text;
    }
  });
}

function init() {
  const stored = sessionStorage.getItem('brLang');
  const lang = stored || detectLang();
  applyLang(lang);
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-lang') || 'en';
    const next = current === 'en' ? 'es' : 'en';
    sessionStorage.setItem('brLang', next);
    applyLang(next);
  });
}

init();
