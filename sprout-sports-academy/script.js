/* Sprout Sports Academy — interactions
   Vanilla JS · no dependencies · motion-safe */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) closeNav();
      else openNav();
    });
    // Close when a nav link is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        toggle.focus();
      }
    });
    // Reset nav state if resized up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Programme age-group tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.prog-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.prog-panel'));

  function selectTab(tab) {
    var target = tab.getAttribute('data-panel');
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach(function (p) {
      var show = p.getAttribute('data-panel') === target;
      p.classList.toggle('is-active', show);
      if (show) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
  }

  if (tabs.length) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      // Arrow-key navigation for the tablist
      tab.addEventListener('keydown', function (e) {
        var idx = i;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { idx = (i + 1) % tabs.length; }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { idx = (i - 1 + tabs.length) % tabs.length; }
        else if (e.key === 'Home') { idx = 0; }
        else if (e.key === 'End') { idx = tabs.length - 1; }
        else { return; }
        e.preventDefault();
        selectTab(tabs[idx]);
        tabs[idx].focus();
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Motion-safe stat counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat-num'));

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = (parseFloat(el.getAttribute('data-count')) || 0) + (el.getAttribute('data-suffix') || '');
      });
    } else {
      var co = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }
})();
