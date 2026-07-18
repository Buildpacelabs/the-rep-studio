/* ============================================================
   Cadence Cycle — interactions
   Vanilla JS · no dependencies · motion-safe
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) { header.classList.add('scrolled'); }
      else { header.classList.remove('scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    var openMenu = function () {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };
    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) { closeMenu(); } else { openMenu(); }
    });
    // Close after tapping a link (mobile)
    menu.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A' && menu.classList.contains('open')) { closeMenu(); }
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    // Reset when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) { closeMenu(); }
    });
  }

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters (motion-safe) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var start = null;
    var duration = 1400;
    var step = function (ts) {
      if (!start) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
      else { el.textContent = target + suffix; }
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var cio = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Ride schedule tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.rides__tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
  if (tabs.length && panels.length) {
    var selectTab = function (tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.hidden = (p.id !== tab.getAttribute('aria-controls'));
      });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var idx = i;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          idx = (i + 1) % tabs.length; e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          idx = (i - 1 + tabs.length) % tabs.length; e.preventDefault();
        } else { return; }
        tabs[idx].focus();
        selectTab(tabs[idx]);
      });
    });
  }
})();
