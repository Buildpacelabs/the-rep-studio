/* Terrain Bootcamp — interactions
   Vanilla JS. Motion respects prefers-reduced-motion. No layout shift. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) { closeNav(); } else { openNav(); }
    });
    // Close when a nav link is tapped (mobile)
    nav.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("a")) { closeNav(); }
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeNav(); }
    });
    // Reset when resizing back to desktop
    var mqDesktop = window.matchMedia("(min-width: 901px)");
    (mqDesktop.addEventListener ? mqDesktop.addEventListener.bind(mqDesktop, "change") : mqDesktop.addListener.bind(mqDesktop))(function () {
      if (mqDesktop.matches) { closeNav(); }
    });
  }

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) { header.classList.add("is-stuck"); }
      else { header.classList.remove("is-stuck"); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll reveals ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Motion-safe count-up ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function setFinal(el) { el.textContent = String(el.getAttribute("data-count")); }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach(setFinal);
  } else {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(eased * target));
        if (progress < 1) { requestAnimationFrame(step); }
        else { setFinal(el); }
      }
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

})();
