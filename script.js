const links = [...document.querySelectorAll(".nav-link")];
const sections = links
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActive = (id) => {
  links.forEach(a => {
    const active = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
};

// set CSS header height automatically
const header = document.querySelector(".main-header");
const setHeaderHeight = () => {
  const h = Math.round(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-h", `${h}px`);
};
setHeaderHeight();
addEventListener("resize", setHeaderHeight);

const observer = new IntersectionObserver(
  (entries) => {
    // pick the entry closest to the center line
    const best = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];

    if (best) setActive(best.target.id);
  },
  {
    root: null,
    // shifts the "active line" to middle-ish of the viewport
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  }
);

sections.forEach(sec => observer.observe(sec));


// ===== Gallery modal (lightbox) =====
const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const closeBtn = modal.querySelector(".modal-close");

let lastFocusedEl = null;

function openModal(src, alt, captionText) {
  lastFocusedEl = document.activeElement;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  modalImg.src = src;
  modalImg.alt = alt || "";
  modalCaption.textContent = captionText || "";

  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalImg.src = "";
  modalImg.alt = "";
  modalCaption.textContent = "";

  if (lastFocusedEl) lastFocusedEl.focus();
}

// Open on click
document.querySelectorAll(".gallery-item").forEach((figure) => {
  const btn = figure.querySelector(".gallery-btn");
  const caption = figure.querySelector("figcaption")?.textContent?.trim() || "";
  if (!btn) return;

  btn.addEventListener("click", () => {
    openModal(btn.dataset.full, btn.dataset.alt, caption);
  });

  // Keyboard: Enter/Space already works on <button>
});

// Close via X
closeBtn.addEventListener("click", closeModal);

// Close when clicking backdrop (or anything with data-close)
modal.addEventListener("click", (e) => {
  if (e.target.dataset.close === "true") closeModal();
});

// Close with Esc
document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("is-open")) return;
  if (e.key === "Escape") closeModal();
});

// ===== Hero typed script label =====
(() => {
  const el = document.querySelector(".hero-script .typed");
  if (!el) return;

  const text = el.dataset.text || "Student Portfolio";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.textContent = text;
    return;
  }

  el.textContent = "";
  let i = 0;

  const type = () => {
    el.textContent += text[i];
    i += 1;
    if (i < text.length) {
      // human-ish timing
      const delay = 55 + Math.random() * 45;
      setTimeout(type, delay);
    }
  };

  // small delay so it feels intentional
  setTimeout(type, 350);
})();
