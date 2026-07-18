(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---- Header scrolled state ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) { header.classList.add('scrolled'); }
      else { header.classList.remove('scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Count-up helper ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }
    if (reduceMotion) { el.textContent = String(target); return; }
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (start === null) { start = ts; }
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) { requestAnimationFrame(step); }
      else { el.textContent = String(target); }
    }
    requestAnimationFrame(step);
  }

  /* ---- Reveal + counters + meters via IntersectionObserver ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.count').forEach(function (c) {
      c.textContent = c.getAttribute('data-count') || c.textContent;
    });
    document.querySelectorAll('.meter-fill').forEach(function (m) { m.classList.add('run'); });
    return;
  }

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      var el = entry.target;
      el.classList.add('in');

      el.querySelectorAll('.count').forEach(function (c) {
        if (!c.dataset.done) { c.dataset.done = '1'; countUp(c); }
      });
      el.querySelectorAll('.meter-fill').forEach(function (m) { m.classList.add('run'); });
      if (el.classList.contains('meter-fill')) { el.classList.add('run'); }

      obs.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(function (el) { io.observe(el); });

  /* Observe standalone meters/counts not wrapped in a reveal element */
  var extra = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      var el = entry.target;
      if (el.classList.contains('meter-fill')) { el.classList.add('run'); }
      if (el.classList.contains('count') && !el.dataset.done) { el.dataset.done = '1'; countUp(el); }
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.meter-fill').forEach(function (m) { extra.observe(m); });

})();
