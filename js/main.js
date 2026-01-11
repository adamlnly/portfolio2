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

  // 🔔 notification
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeClose = document.getElementById("welcomeClose");

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

  window.addEventListener("resize", updateHotspots);
  updateHotspots();

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

      // active la lumière (hotspots + notif via CSS)
      document.body.classList.add("light-on");

      // 🔔 affiche la notification
      if (welcomeOverlay) {
        welcomeOverlay.style.display = "block";
      }
    });
  }

  /* ================= CROIX NOTIFICATION ================= */
  if (welcomeClose && welcomeOverlay) {
    welcomeClose.addEventListener("click", (e) => {
      e.stopPropagation();
      welcomeOverlay.style.display = "none";
    });
  }

  /* ================= HOTSPOTS ================= */
  hotspots.forEach(h => {
    h.addEventListener("click", () => {
      if (!revealed) return;

      // bloque les hotspots tant que la notif est visible
      if (welcomeOverlay && welcomeOverlay.style.display === "block") return;

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

/* =========================================================
   FORCE REFRESH SI CHANGEMENT DE DEVICE / TAILLE CRITIQUE
========================================================= */
(function () {
  const KEY = "__layout_fixed__";

  const isMobileNow = () =>
    window.matchMedia("(max-width:768px)").matches;

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
const welcomeClose = document.getElementById("welcomeClose");

if (welcomeClose) {
  welcomeClose.addEventListener("click", (e) => {
    e.stopPropagation();

    // cache la notification sans toucher à la lumière
    document.body.classList.add("welcome-hidden");
  });
}
