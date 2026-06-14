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

  if (reduce || !('IntersectionObserver' in window)) return;

  // ---- Auto-tag below-the-fold elements for reveal ----
  // (Hero stays visible immediately to avoid an above-the-fold flash.)
  var groups = [
    ['.section-header', 0],
    ['.feature-card', 1],
    ['.how-step, .step, .step-card', 1],
    ['.comp-row, .comparison-row', 0],
    ['.download-card, .dl-card, .footer-brand', 0]
  ];
  groups.forEach(function (g) {
    var sel = g[0], stagger = g[1];
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.closest('.hero')) return;          // never hide hero content
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
