/* ================= HELPERS: query ================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ================= ELEMENTS (accept id OR class) ================= */
const win = $("#win") || $(".win");
const desktop = $("#desktop") || $(".desktop");

/* overlays / loading */
const fill = $("#fill") || $(".loading-fill");
const loading = $("#loading") || $(".loading");
const winBar = $("#winBar") || $(".bar");
const closeWin = $("#closeWin") || $(".close");

/* viewer */
const viewer = $("#text-viewer") || $(".text-viewer");
const textTitle = $("#text-title") || $(".text-title");
const closeText = $("#close-text") || $(".close-text");

const projectText  = $(".project-text", viewer)  || $("#project-text");
const projectImage = $(".project-image", viewer) || $("#project-image");
const projectLink  = $(".project-link", viewer)  || $("#project-link");

let isLoading = false;
let lastFileSourceWindow = null;

function isMobile() {
  return window.matchMedia("(max-width:768px)").matches;
}

/* ================= CLAMP VIEWPORT ================= */
function clampToViewport(el, margin = 0) {
  let x = el.offsetLeft;
  let y = el.offsetTop;

  const maxX = window.innerWidth - el.offsetWidth - margin;
  const maxY = window.innerHeight - el.offsetHeight - margin;

  if (x < margin) x = margin;
  if (y < margin) y = margin;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  el.style.left = x + "px";
  el.style.top  = y + "px";
}

/* ================= CLAMP DESKTOP ================= */
function clampToDesktop(el) {
  if (!desktop) return;
  const W = desktop.clientWidth;
  const H = desktop.clientHeight;

  let x = el.offsetLeft;
  let y = el.offsetTop;

  const maxX = W - el.offsetWidth;
  const maxY = H - el.offsetHeight;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  el.style.left = x + "px";
  el.style.top  = y + "px";
}

function centerInViewport(el) {
  el.style.left = Math.max(0, (innerWidth - el.offsetWidth) / 2) + "px";
  el.style.top  = Math.max(0, (innerHeight - el.offsetHeight) / 2) + "px";
  clampToViewport(el);
}

/* ================= VIEWER ================= */
function closeViewer() {
  if (!viewer) return;
  viewer.style.display = "none";
  if (textTitle) textTitle.textContent = "Fichier";

  if (projectText) projectText.textContent = "";
  if (projectImage) {
    projectImage.style.display = "none";
    projectImage.src = "";
  }
  if (projectLink) {
    projectLink.style.display = "none";
    projectLink.href = "";
  }
}

function closeAllFolders() {
  $$(".folder-window").forEach(w => {
    if (w !== viewer) w.style.display = "none";
  });
}

function placeViewerNearSource() {
  if (!viewer || !desktop) return;

  if (isMobile()) {
    viewer.style.left = "10px";
    viewer.style.top  = "10px";
    clampToDesktop(viewer);
    return;
  }

  if (!lastFileSourceWindow) {
    viewer.style.left = "24px";
    viewer.style.top  = "24px";
    clampToDesktop(viewer);
    return;
  }

  const src = lastFileSourceWindow;
  const gap = 16;

  let x = src.offsetLeft + src.offsetWidth + gap;
  let y = src.offsetTop;

  if (x + viewer.offsetWidth > desktop.clientWidth) {
    x = src.offsetLeft - viewer.offsetWidth - gap;
  }

  viewer.style.left = x + "px";
  viewer.style.top  = y + "px";
  clampToDesktop(viewer);
}

/* ================= OPEN COMPUTER ================= */
function openComputer() {
  $("#computer")?.classList.add("active");

  if (win) {
    win.style.display = "block";
    centerInViewport(win);
  }

  isLoading = true;

  if (fill) fill.style.width = "0%";
  if (loading) loading.style.display = "flex";
  if (desktop) desktop.style.display = "none";

  let p = 0;
  const t = setInterval(() => {
    p += 10;
    if (fill) fill.style.width = p + "%";

    if (p >= 100) {
      clearInterval(t);
      if (loading) loading.style.display = "none";
      if (desktop) desktop.style.display = "block";
      isLoading = false;

      $$(".folder, .folder-window").forEach(el => clampToDesktop(el));
      if (viewer) clampToDesktop(viewer);
    }
  }, 120);
}

window.openComputer = openComputer;

/* ================= CLOSE WIN ================= */
if (closeWin) {
  closeWin.addEventListener("pointerdown", e => e.stopPropagation());
  closeWin.onclick = e => {
    e.stopPropagation();
    if (win) win.style.display = "none";
    closeAllFolders();
    closeViewer();
  };
}

/* ================= DRAG WIN ================= */
let dragWin = false, wx = 0, wy = 0;

if (winBar && win) {
  winBar.addEventListener("pointerdown", e => {
    if (isMobile()) return;
    if (e.target.closest("button")) return;
    dragWin = true;
    wx = e.clientX - win.offsetLeft;
    wy = e.clientY - win.offsetTop;
    win.setPointerCapture?.(e.pointerId);
  });
}

document.addEventListener("pointermove", e => {
  if (!dragWin || !win) return;
  win.style.left = e.clientX - wx + "px";
  win.style.top  = e.clientY - wy + "px";
  clampToViewport(win);
});

document.addEventListener("pointerup", () => {
  dragWin = false;
});

/* ================= DRAG FOLDER WINDOWS ================= */
$$(".folder-window").forEach(w => {
  const bar = $(".folder-bar", w);
  if (!bar) return;

  let drag = false, ox = 0, oy = 0;

  bar.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    drag = true;
    ox = e.clientX - w.offsetLeft;
    oy = e.clientY - w.offsetTop;
    w.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  });

  w.addEventListener("pointermove", e => {
    if (!drag) return;
    w.style.left = (e.clientX - ox) + "px";
    w.style.top  = (e.clientY - oy) + "px";
    clampToDesktop(w);
  });

  w.addEventListener("pointerup", () => drag = false);
  w.addEventListener("pointercancel", () => drag = false);

  const closeBtn = $(".folder-close", w);
  if (closeBtn) {
    closeBtn.addEventListener("pointerdown", e => e.stopPropagation());
    closeBtn.onclick = e => {
      e.stopPropagation();
      w.style.display = "none";
      closeViewer();
    };
  }
});

/* ================= ICONS (DRAG + DOUBLE CLICK) ================= */
$$(".folder").forEach(folder => {
  let drag = false, ox = 0, oy = 0, moved = false;
  let lastUp = 0;

  folder.addEventListener("pointerdown", e => {
    drag = true;
    moved = false;
    ox = e.clientX - folder.offsetLeft;
    oy = e.clientY - folder.offsetTop;
    folder.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  folder.addEventListener("pointermove", e => {
    if (!drag) return;
    moved = true;
    folder.style.left = (e.clientX - ox) + "px";
    folder.style.top  = (e.clientY - oy) + "px";
    clampToDesktop(folder);
  });

  folder.addEventListener("pointerup", () => {
    drag = false;

    // mobile: tap opens
    if (isMobile() && !moved) {
      closeAllFolders();
      closeViewer();
      const t = $("#folder-" + folder.dataset.folder) || $(".folder-" + folder.dataset.folder);
      if (t) {
        t.style.display = "block";
        clampToDesktop(t);
      }
      return;
    }

    // desktop: manual double click (because pointer capture breaks dblclick)
    if (!moved) {
      const now = Date.now();
      if (now - lastUp < 300) {
        closeAllFolders();
        closeViewer();
        const t = $("#folder-" + folder.dataset.folder) || $(".folder-" + folder.dataset.folder);
        if (t) t.style.display = "block";
      }
      lastUp = now;
    }
  });
});

/* ================= FILES ================= */
$$(".file").forEach(file => {
  file.addEventListener("pointerdown", e => e.stopPropagation());

  file.onclick = () => {
    const title = file.dataset.title || "Fichier";
    const text  = file.dataset.text || "";
    const image = file.dataset.image;
    const link  = file.dataset.link;

    if (textTitle) textTitle.textContent = title;
    if (projectText) projectText.textContent = text;

    if (projectImage) {
      if (image) {
        projectImage.src = image;
        projectImage.style.display = "block";
      } else {
        projectImage.style.display = "none";
        projectImage.src = "";
      }
    }

    if (projectLink) {
      if (link) {
        projectLink.href = link;
        projectLink.style.display = "block";
      } else {
        projectLink.style.display = "none";
        projectLink.href = "";
      }
    }

    const parent = file.closest(".folder-window");
    if (parent && parent !== viewer) lastFileSourceWindow = parent;

    if (viewer) {
      viewer.style.display = "block";
      placeViewerNearSource();
    }
  };
});

/* stop clicks in viewer content from dragging windows etc */
$$(".text-content").forEach(el => {
  el.addEventListener("pointerdown", e => e.stopPropagation());
});

if (closeText) {
  closeText.addEventListener("pointerdown", e => e.stopPropagation());
  closeText.onclick = closeViewer;
}

window.addEventListener("pageshow", e => {
  if (isLoading || e.persisted) location.reload();
});
