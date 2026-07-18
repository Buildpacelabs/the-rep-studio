/* =====================================================================
   PLATFORM 45 — interactions
   Vanilla JS · no dependencies · reduced-motion aware
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    var openNav = function () {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav();
      else openNav();
    });

    // Close when a nav link is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---- Count-up numbers ---- */
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString('en-IN'); return; }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }

  /* ---- Meter fills ---- */
  function runMeter(el) {
    var pct = parseFloat(el.getAttribute('data-meter')) || 0;
    if (reduceMotion) { el.style.width = pct + '%'; return; }
    requestAnimationFrame(function () { el.style.width = pct + '%'; });
  }

  /* ---- IntersectionObserver: reveals, counters, meters ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.classList.contains('reveal')) el.classList.add('is-visible');

        // the observed element itself may be a counter / meter
        if (el.classList.contains('count') && !el.dataset.done) {
          el.dataset.done = '1'; runCount(el);
        }
        if (el.classList.contains('meter') && !el.dataset.done) {
          el.dataset.done = '1'; runMeter(el);
        }

        // fire any counters / meters nested inside this element
        el.querySelectorAll('.count').forEach(function (c) {
          if (!c.dataset.done) { c.dataset.done = '1'; runCount(c); }
        });
        el.querySelectorAll('.meter').forEach(function (m) {
          if (!m.dataset.done) { m.dataset.done = '1'; runMeter(m); }
        });

        obs.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // Observe stand-alone count/meter hosts that aren't inside a .reveal
    document.querySelectorAll('.count').forEach(function (c) {
      if (!c.closest('.reveal')) io.observe(c);
    });
    document.querySelectorAll('.meter').forEach(function (m) {
      if (!m.closest('.reveal')) io.observe(m);
    });
  } else {
    // No IO support: show everything, snap final values
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('.count').forEach(function (c) {
      c.textContent = (parseFloat(c.getAttribute('data-count')) || 0).toLocaleString('en-IN');
    });
    document.querySelectorAll('.meter').forEach(function (m) {
      m.style.width = (parseFloat(m.getAttribute('data-meter')) || 0) + '%';
    });
  }
})();
