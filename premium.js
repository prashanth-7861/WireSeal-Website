/* WireSeal premium interactions — scroll reveals + nav state.
   Progressive enhancement: the site is fully usable without JS. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Glass nav: solidify on scroll ----
  var nav = document.querySelector('.navbar');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Page title entrance ----
  if (!reduce) {
    var main = document.querySelector('.setup-main, main');
    if (main) {
      var title = main.querySelector('h1');
      var desc = main.querySelector('.setup-desc, p');
      if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(24px)';
        title.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(function () {
          title.style.opacity = '1';
          title.style.transform = 'translateY(0)';
        }, 180);
      }
      if (desc) {
        desc.style.opacity = '0';
        desc.style.transform = 'translateY(16px)';
        desc.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(function () {
          desc.style.opacity = '1';
          desc.style.transform = 'translateY(0)';
        }, 320);
      }
    }
  }

  // NOTE: theme toggle + mobile nav are handled by each page's own inline
  // script. Do NOT add handlers here — a second listener double-toggles and
  // breaks them.

  if (reduce || !('IntersectionObserver' in window)) return;

  // ---- Auto-tag below-the-fold elements for reveal ----
  var groups = [
    ['.section-header', 0],
    ['.feature-card', 1],
    ['.how-step, .step, .step-card', 1],
    ['.comp-row, .comparison-row', 0],
    ['.download-card, .dl-card, .footer-brand', 0],
    ['.method-content, .os-content', 1],
    ['.req-section, .troubleshoot-card', 1],
    ['.device-card, .app-card', 1]
  ];
  groups.forEach(function (g) {
    var sel = g[0], stagger = g[1];
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.closest('.hero')) return;
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', '');
      if (stagger) el.setAttribute('data-reveal-delay', String((i % 5) + 1));
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
})();
