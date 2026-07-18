/* ==========================================================================
   Kinetic Lab — interactions
   Vanilla JS, no dependencies. Motion guarded by prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    var openNav = function () {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) { closeNav(); } else { openNav(); }
    });

    /* Close after tapping a link */
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { closeNav(); }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        toggle.focus();
      }
    });

    /* Reset nav state when leaving mobile breakpoint */
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 821px)');
      var handleMq = function (ev) { if (ev.matches) { closeNav(); } };
      if (mq.addEventListener) { mq.addEventListener('change', handleMq); }
      else if (mq.addListener) { mq.addListener(handleMq); }
    }
  }

  /* ---- Scroll reveals ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Count-up numbers (motion-safe) ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) { return; }

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      /* easeOutCubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      /* keep integers clean, allow one decimal for small targets */
      el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
      else { el.textContent = target + suffix; }
    }
    requestAnimationFrame(step);
  }

  /* ---- Meter fills (motion-safe) ---- */
  function fillMeter(el) {
    var target = el.getAttribute('data-fill');
    if (target === null) { return; }
    if (reduceMotion) { el.style.transition = 'none'; }
    el.style.width = target + '%';
  }

  var countEls = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var meterEls = Array.prototype.slice.call(document.querySelectorAll('[data-fill]'));

  if (!('IntersectionObserver' in window)) {
    countEls.forEach(animateCount);
    meterEls.forEach(fillMeter);
  } else {
    var numObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-count')) { animateCount(entry.target); }
          if (entry.target.hasAttribute('data-fill')) { fillMeter(entry.target); }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(function (el) { numObserver.observe(el); });
    meterEls.forEach(function (el) { numObserver.observe(el); });
  }
})();
