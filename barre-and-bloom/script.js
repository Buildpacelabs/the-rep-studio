/* ============================================================
   Barre & Bloom — interactions
   Vanilla JS · motion-safe · no dependencies
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var panel = document.getElementById("navPanel");
  var backdrop = document.getElementById("navBackdrop");

  function openNav() {
    if (!panel) return;
    panel.classList.add("is-open");
    if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add("is-open"); }); }
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!panel) return;
    panel.classList.remove("is-open");
    if (backdrop) {
      backdrop.classList.remove("is-open");
      window.setTimeout(function () { backdrop.hidden = true; }, 320);
    }
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") { closeNav(); }
      else { openNav(); }
    });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    // close on link tap
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    // close on escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });
    // reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && toggle.getAttribute("aria-expanded") === "true") closeNav();
    });
  }

  /* ---------- sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-stuck");
      else header.classList.remove("is-stuck");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
