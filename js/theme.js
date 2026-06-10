/* =====================================================
   theme.js — Dark / Light mode toggle
   FireBot R1 Documentation
   ===================================================== */

(function () {
  'use strict';

  const btn  = document.getElementById('theme-toggle');
  const body = document.body;
  const KEY  = 'firebot-theme';

  const ICONS = { dark: '☀', light: '☾' };

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('light');
      if (btn) btn.textContent = ICONS.light;
    } else {
      body.classList.remove('light');
      if (btn) btn.textContent = ICONS.dark;
    }
    try { localStorage.setItem(KEY, theme); } catch (_) {}
  }

  // Load saved preference
  let saved = 'dark';
  try { saved = localStorage.getItem(KEY) || 'dark'; } catch (_) {}
  applyTheme(saved);

  // Toggle on button click
  if (btn) {
    btn.addEventListener('click', () => {
      const current = body.classList.contains('light') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

})();
