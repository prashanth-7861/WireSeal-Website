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

  // ---- 3D network-mesh hero (vanilla canvas, no Three.js) ----
  (function net() {
    var c = document.getElementById('net'); if (!c) return;
    var ctx = c.getContext('2d'); if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var N = 74, pts = [], edges = [], R, cx, cy;
    var gr = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = gr * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
      var d = pts[a][0]*pts[b][0] + pts[a][1]*pts[b][1] + pts[a][2]*pts[b][2];
      if (d > 0.55) edges.push([a, b]);
    }
    function size() {
      var w = c.clientWidth || 480, h = c.clientHeight || w;
      c.width = w * dpr; c.height = h * dpr;
      R = Math.min(w, h) * 0.36; cx = c.width / 2; cy = c.height / 2;
    }
    size(); window.addEventListener('resize', size, { passive: true });
    function project(p, ang, tilt) {
      var x = p[0], y = p[1], z = p[2];
      var x1 = x*Math.cos(ang) - z*Math.sin(ang), z1 = x*Math.sin(ang) + z*Math.cos(ang);
      var y2 = y*Math.cos(tilt) - z1*Math.sin(tilt), z2 = y*Math.sin(tilt) + z1*Math.cos(tilt);
      var s = 2.6 / (2.6 + z2);
      return [cx + x1*R*dpr*s, cy + y2*R*dpr*s, z2];
    }
    var rot = 0;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      var P = [];
      for (var i = 0; i < N; i++) P.push(project(pts[i], rot, 0.5));
      ctx.lineWidth = dpr * 0.6;
      for (var e = 0; e < edges.length; e++) {
        var p = P[edges[e][0]], q = P[edges[e][1]];
        var al = Math.max(0, (1.2 - (p[2] + q[2]) / 2) / 2.4) * 0.5;
        ctx.strokeStyle = 'rgba(45,212,191,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      for (var j = 0; j < N; j++) {
        var pt = P[j], al2 = Math.max(0.15, (1.4 - pt[2]) / 2.8), rad = dpr * (1.1 + (1.4 - pt[2]));
        var g = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], rad * 4);
        g.addColorStop(0, 'rgba(110,231,183,' + al2.toFixed(3) + ')');
        g.addColorStop(1, 'rgba(52,211,153,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt[0], pt[1], rad * 4, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(190,255,230,' + Math.min(1, al2 * 1.7).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(pt[0], pt[1], rad * 0.7, 0, 7); ctx.fill();
      }
    }
    if (reduce) { draw(); return; }
    (function loop() { rot += 0.0032; draw(); requestAnimationFrame(loop); })();
  })();

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
