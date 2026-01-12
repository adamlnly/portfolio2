/*
  NOTE :
  Le calcul du scale de la scène, le positionnement
  dynamique des hotspots selon la taille de l’écran
  et la gestion des changements de taille/orientation
  étaient très complexes pour moi.
  Je me suis aidé de l’IA pour générer cette structure,
  puis je l’ai comprise et adaptée à mon projet.
*/

document.addEventListener("DOMContentLoaded", () => {

  const IMG_W = 1920;
  const IMG_H = 1080;

  let revealed = false;

  const scene = document.getElementById("scene");
  const hotspots = document.querySelectorAll(".hotspot");
  const lamp = document.getElementById("lamp");
  const cursorLight = document.getElementById("cursorLight");
  const bgDay = document.getElementById("bgDay");
  const mainLight = document.getElementById("mainLight");
  const quote = document.getElementById("quote");
  const words = document.querySelectorAll(".quote span");

  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeClose = document.getElementById("welcomeClose");

  /* ================= TABLET / MOBILE ================= */
  function isTabletOrMobile() {
    return window.matchMedia("(max-width:1024px)").matches;
  }

  /* ================= HOTSPOTS SCALE ================= */
  function updateHotspots() {
    if (!scene) return;

    const W = scene.clientWidth;
    const H = scene.clientHeight;

    const scale = Math.max(W / IMG_W, H / IMG_H);
    const scaledW = IMG_W * scale;
    const scaledH = IMG_H * scale;

    const offsetX = (W - scaledW) / 2;
    const offsetY = (H - scaledH) / 2;

    hotspots.forEach(h => {
      h.style.left   = offsetX + h.dataset.x * scale + "px";
      h.style.top    = offsetY + h.dataset.y * scale + "px";
      h.style.width  = h.dataset.w * scale + "px";
      h.style.height = h.dataset.h * scale + "px";
    });
  }

  /* ================= PANNEAU (DESKTOP ONLY) ================= */
  function updateSignHotspot() {
    const signHotspot = document.querySelector(
      '.hotspot[data-label="Pancarte"]'
    );

    if (!signHotspot) return;

    if (isTabletOrMobile()) {
      signHotspot.style.display = "none";
    } else {
      signHotspot.style.display = "block";
    }
  }

  window.addEventListener("resize", () => {
    updateHotspots();
    updateSignHotspot();
  });

  updateHotspots();
  updateSignHotspot();

  /* ================= CURSOR LIGHT ================= */
  document.addEventListener("mousemove", e => {
    if (revealed || !cursorLight) return;

    cursorLight.style.setProperty("--x", e.clientX + "px");
    cursorLight.style.setProperty("--y", e.clientY + "px");

    words.forEach(word => {
      const r = word.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      word.style.opacity = d < 80 ? 0 : 1;
    });
  });

  /* ================= LAMP ================= */
  if (lamp) {
    lamp.addEventListener("click", () => {
      if (revealed) return;
      revealed = true;

      if (quote) quote.style.opacity = 0;
      if (cursorLight) cursorLight.style.opacity = 0;

      lamp.src = "assets/images/lampe_ON.png";
      if (mainLight) mainLight.style.opacity = 1;
      if (bgDay) bgDay.style.opacity = 1;

      document.body.classList.add("light-on");

      if (welcomeOverlay) {
        welcomeOverlay.style.display = "block";
      }
    });
  }

  /* ================= WELCOME CLOSE ================= */
  if (welcomeClose && welcomeOverlay) {
    welcomeClose.addEventListener("click", e => {
      e.stopPropagation();
      document.body.classList.add("welcome-hidden");
    });
  }

  /* ================= HOTSPOTS ACTIONS ================= */
  hotspots.forEach(h => {
    h.addEventListener("click", () => {
      if (!revealed) return;

      if (
        welcomeOverlay &&
        !document.body.classList.contains("welcome-hidden")
      ) return;

      if (h.dataset.label === "PC") {
        window.openComputer?.();
      }

      if (h.dataset.label === "Téléphone") {
        window.openPhone?.();
      }

      if (h.dataset.label === "Pancarte") {
        window.openSign?.();
      }
    });
  });

});


/* Reload de sécurité en cas de changement critique
   (orientation / resize important) */
(function () {

  const KEY = "__layout_fixed__";

  const isMobileNow = () =>
    window.matchMedia("(max-width:1024px)").matches;

  const initialState = {
    mobile: isMobileNow(),
    w: window.innerWidth,
    h: window.innerHeight
  };

  if (sessionStorage.getItem(KEY)) return;

  function needsRefresh() {
    const mobile = isMobileNow();
    const dw = Math.abs(window.innerWidth - initialState.w);
    const dh = Math.abs(window.innerHeight - initialState.h);

    return (
      mobile !== initialState.mobile ||
      dw > 120 ||
      dh > 120
    );
  }

  window.addEventListener("resize", () => {
    if (needsRefresh()) {
      sessionStorage.setItem(KEY, "1");
      location.reload();
    }
  });

  window.addEventListener("orientationchange", () => {
    sessionStorage.setItem(KEY, "1");
    location.reload();
  });

})();
