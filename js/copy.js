/* =====================================================
   copy.js — Copy code button functionality
   FireBot R1 Documentation
   ===================================================== */

(function () {
  'use strict';

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.dataset.target;
      let text = '';

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) text = el.innerText || el.textContent;
      } else {
        // Generic: copy nearest code block
        const block = this.closest('.code-header')?.nextElementSibling
                   || this.closest('.code-block');
        if (block) text = block.innerText || block.textContent;
      }

      // Strip any leading/trailing whitespace
      text = text.trim();

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const orig = this.textContent;
        this.textContent = 'Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.textContent = orig;
          this.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);

        const orig = this.textContent;
        this.textContent = 'Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.textContent = orig;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });

})();
