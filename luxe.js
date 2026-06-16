/* WireSeal luxe — motion & interactions. Vanilla, no deps. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Sticky nav state ----
  var nav = document.getElementById('nav');
  function navState() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 20); }
  navState();
  window.addEventListener('scroll', navState, { passive: true });

  // ---- Mobile nav ----
  var burger = document.getElementById('burger');
  var links = document.getElementById('links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  if (reduce) {
    document.querySelectorAll('[data-rv], .reveal-line').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  // ---- Scroll reveals (incl. line masks) ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    document.querySelectorAll('[data-rv], .reveal-line').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-rv], .reveal-line').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Parallax (rAF-throttled) ----
  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (px.length) {
    var ticking = false;
    function frame() {
      var y = window.scrollY;
      px.forEach(function (el) {
        var s = parseFloat(el.getAttribute('data-speed')) || 0.1;
        el.style.transform = 'translate3d(0,' + (y * s).toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(frame); ticking = true; }
    }, { passive: true });
    frame();
  }

  // ---- Magnetic primary buttons ----
  document.querySelectorAll('.btn--primary').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      var mx = e.clientX - r.left - r.width / 2;
      var my = e.clientY - r.top - r.height / 2;
      b.style.transform = 'translate(' + (mx * 0.18).toFixed(1) + 'px,' + (my * 0.28 - 2).toFixed(1) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
})();
