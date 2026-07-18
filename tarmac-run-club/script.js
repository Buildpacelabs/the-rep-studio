/* Tarmac Run Club — interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- hero ready flag (unlocks the underline sweep) ---- */
  requestAnimationFrame(function () {
    document.body.classList.add("is-ready");
  });

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openNav() {
    if (!toggle || !nav) return;
    nav.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeNav() : openNav();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---- count-up numbers (motion-safe) ---- */
  function formatNum(n) {
    return n.toLocaleString("en-IN");
  }
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = formatNum(target) + suffix;
      return;
    }
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- route elevation meters (motion-safe) ---- */
  function fillMeter(el) {
    var pct = parseFloat(el.getAttribute("data-meter")) || 0;
    el.style.width = Math.max(0, Math.min(100, pct)) + "%";
  }

  /* ---- reveal on scroll + trigger counters/meters ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var meters = Array.prototype.slice.call(document.querySelectorAll(".meter__fill"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    counters.forEach(runCounter);
    meters.forEach(fillMeter);
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  function makeTrigger(items, action) {
    if (!items.length) return;
    var seen = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen) {
          seen = true;
          items.forEach(action);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(items[0]);
  }

  makeTrigger(counters, runCounter);
  makeTrigger(meters, fillMeter);
})();
