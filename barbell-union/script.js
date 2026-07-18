/* ============================================================
   BARBELL UNION — behaviour
   Vanilla JS. Motion-safe. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close after tapping a link
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- Header hide-on-scroll-down / solidify ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastY = window.pageYOffset;
    var ticking = false;
    var onScroll = function () {
      var y = window.pageYOffset;
      header.classList.toggle("is-solid", y > 40);
      // Don't hide while mobile menu is open
      if (!nav || !nav.classList.contains("is-open")) {
        if (y > lastY && y > 240) {
          header.classList.add("is-hidden");
        } else {
          header.classList.remove("is-hidden");
        }
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Count-up numerals (motion-safe, layout-stable) ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  function formatNum(n, decimals) {
    if (decimals > 0) {
      return n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    return Math.round(n).toLocaleString("en-IN");
  }

  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = formatNum(target, decimals) + suffix;
      return;
    }
    var duration = 1300;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(target * eased, decimals) + suffix;
      if (p < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatNum(target, decimals) + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach(runCount);
  } else {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Ticker: pause on hover / reduced motion ---------- */
  var ticker = document.querySelector("[data-ticker]");
  if (ticker) {
    if (reduceMotion) {
      ticker.setAttribute("data-paused", "true");
    } else {
      ticker.addEventListener("mouseenter", function () { ticker.setAttribute("data-paused", "true"); });
      ticker.addEventListener("mouseleave", function () { ticker.setAttribute("data-paused", "false"); });
    }
  }

  /* ---------- Smooth active-link state (progressive, no layout impact) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkMap = {};
    navLinks.forEach(function (l) {
      var id = l.getAttribute("href").slice(1);
      if (id) linkMap[id] = l;
    });
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (link && entry.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { threshold: 0.5, rootMargin: "-20% 0px -60% 0px" });
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

})();
