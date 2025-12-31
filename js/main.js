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

  /* ================= HOTSPOTS SCALE ================= */
  function updateHotspots() {
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
    if (revealed) return;

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
/* =========================================================


  /* ================= LAMP ================= */
  lamp.addEventListener("click", () => {
    if (revealed) return;
    revealed = true;

    quote.style.opacity = 0;
    cursorLight.style.opacity = 0;

    lamp.src = "assets/images/lampe_ON.png";
    mainLight.style.opacity = 1;
    bgDay.style.opacity = 1;

    document.body.classList.add("light-on");
  });

hotspots.forEach(h => {
  h.addEventListener("click", () => {
    if (!revealed) return;

    if (h.dataset.label === "PC") {
      openComputer();
    }

    if (h.dataset.label === "Téléphone") {
      openPhone();
    }

    if (h.dataset.label === "Pancarte") {
      openOverlay("sign");
    }
  });
});

/* ================= OVERLAYS ================= */
function openOverlay(id) {
  document.getElementById(id).classList.add("active");
}

function closeOverlay(id) {
  document.getElementById(id).classList.remove("active");
}
});
