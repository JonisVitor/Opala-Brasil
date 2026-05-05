const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  document.body.classList.add("motion-ready");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

if (!reduceMotion) {
  const hero = document.querySelector(".hero");
  const gallery = document.querySelector(".gallery__media");
  const ambients = document.querySelectorAll(".ambient");
  let ticking = false;

  const updateMotion = () => {
    const y = window.scrollY;
    const heroProgress = Math.min(y / Math.max(hero.offsetHeight, 1), 1);
    root.style.setProperty("--scroll-progress", heroProgress.toFixed(3));

    if (gallery) {
      const rect = gallery.getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
      gallery.style.setProperty("--parallax", progress.toFixed(3));
    }

    ambients.forEach((element, index) => {
      const offset = Math.sin((y / 360) + index) * 22;
      element.style.setProperty("--float", `${offset.toFixed(1)}px`);
    });

    ticking = false;
  };

  const requestMotion = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateMotion);
      ticking = true;
    }
  };

  updateMotion();
  window.addEventListener("scroll", requestMotion, { passive: true });
  window.addEventListener("resize", requestMotion);
}

const voiceCards = Array.from(document.querySelectorAll(".voice-card"));
const prevVoice = document.querySelector("[data-voice-prev]");
const nextVoice = document.querySelector("[data-voice-next]");
let voiceIndex = 0;

const setVoice = (index) => {
  if (!voiceCards.length) return;
  voiceIndex = (index + voiceCards.length) % voiceCards.length;
  voiceCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === voiceIndex);
  });
};

prevVoice?.addEventListener("click", () => setVoice(voiceIndex - 1));
nextVoice?.addEventListener("click", () => setVoice(voiceIndex + 1));

if (!reduceMotion && voiceCards.length > 1) {
  window.setInterval(() => setVoice(voiceIndex + 1), 6500);
}
