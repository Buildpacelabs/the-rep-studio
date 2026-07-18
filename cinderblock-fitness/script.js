/* Cinderblock Fitness — interactions
   Vanilla JS. No dependencies. Motion guarded by prefers-reduced-motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  var years = document.querySelectorAll('#year');
  var now = String(new Date().getFullYear());
  years.forEach(function (el) { el.textContent = now; });

  /* ---------- mobile nav toggle ---------- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    var closeNav = function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    var openNav = function () {
      links.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };

    toggle.addEventListener('click', function () {
      if (links.classList.contains('open')) { closeNav(); } else { openNav(); }
    });

    // close when a nav link is tapped
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });

    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeNav();
        toggle.focus();
      }
    });

    // reset when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && links.classList.contains('open')) { closeNav(); }
    });
  }

  /* ---------- sticky header shadow state ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) { header.classList.add('is-stuck'); }
      else { header.classList.remove('is-stuck'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- reduced-motion: flag the marquee off ---------- */
  if (reduceMotion) {
    document.querySelectorAll('.marquee').forEach(function (m) {
      m.setAttribute('data-reduced', 'true');
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');

  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    var step = function (ts) {
      if (start === null) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
      else { el.textContent = target.toLocaleString('en-IN') + suffix; }
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var t = parseFloat(el.getAttribute('data-count')) || 0;
        el.textContent = t.toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');
      });
    } else {
      var co = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }
})();
