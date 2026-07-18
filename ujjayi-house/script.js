/* Ujjayi House — site interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    if (!toggle || !menu) return;
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    // Close when a menu link is chosen
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { closeMenu(); }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); }
    });

    // Close if resized up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 860) { closeMenu(); }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) { header.classList.add("is-scrolled"); }
      else { header.classList.remove("is-scrolled"); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveals ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Show everything immediately, no motion
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // Gentle stagger for siblings that reveal together
    var counts = new Map();
    revealItems.forEach(function (el) {
      var parent = el.parentNode;
      var index = counts.get(parent) || 0;
      counts.set(parent, index + 1);
      el.style.setProperty("--reveal-delay", Math.min(index * 90, 360) + "ms");
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(function (el) { observer.observe(el); });
  }
})();
