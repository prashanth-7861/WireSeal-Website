(function () {
  'use strict';
  var R = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Theme Toggle ──
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  var stored = localStorage.getItem('ws-theme');

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('ws-theme', t);
  }

  if (stored) {
    setTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Nav Scroll ──
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 30); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Burger Menu ──
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!burger.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
    });
  }

  if (R) return;

  // ── Hero Entrance ──
  var hero = document.querySelector('.hero');
  if (hero) {
    var els = hero.querySelectorAll('[data-rv]');
    els.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, 150 + i * 120);
    });
  }

  // ── Scroll Reveal ──
  var rvEls = document.querySelectorAll('[data-rv]');
  if (rvEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          obs.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    rvEls.forEach(function (el) { obs.observe(el); });
  }

  // ── Stagger Bento Cells ──
  var bentoGrids = document.querySelectorAll('.bento');
  bentoGrids.forEach(function (grid) {
    var cells = grid.querySelectorAll('.cell');
    cells.forEach(function (cell, idx) {
      cell.style.opacity = '0';
      cell.style.transform = 'translateY(20px)';
      cell.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1) ' + (idx * 0.07) + 's, transform 0.5s cubic-bezier(0.16,1,0.3,1) ' + (idx * 0.07) + 's';
    });

    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var c = entry.target;
          c.style.opacity = '1';
          c.style.transform = 'none';
          cObs.unobserve(c);
        }
      });
    }, { threshold: 0.05 });

    cells.forEach(function (c) { cObs.observe(c); });
  });

})();
