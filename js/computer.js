/* ============================================================================
   WINDOWS / DESKTOP DRAG SYSTEM — FULL SCRIPT (NO RESPONSIVE CHANGE)
   - Fix #1: gros décalage au “select/drag” (mauvais repère desktop vs viewport)
   - Fix #2: le viewer (fichier) NE DOIT PLUS être centré en desktop
             -> il doit se comporter comme une fenêtre (poussée/clamp par bordures)
             -> il doit s’ouvrir près du dossier / fenêtre source (desktop)
   - Responsive: je ne touche pas à ta logique mobile (max-width:768px), je garde
     les comportements conditionnels via isMobile().
============================================================================ */

/* =========================================================
   DOM REFERENCES
========================================================= */
const win = document.getElementById("win");
const desktop = document.getElementById("desktop");
/* =========================
   LOADING REFRESH SAFETY
========================= */
let isLoading = false;

/* =========================================================
   MOBILE CHECK (TU M’AS DIT DE NE PAS TOUCHER AU RESPONSIVE)
========================================================= */

function isMobile() {
  return window.matchMedia("(max-width:768px)").matches;
}

/* =========================================================
   UTILS: GET DESKTOP RECT
========================================================= */
function getDesktopRect() {
  return desktop.getBoundingClientRect();
}

/* =========================================================
   CLAMP (GARDE TON CONCEPT: TOUT RESTE DANS LE DESKTOP)
========================================================= */
function clampToDesktop(el) {
  const dRect = getDesktopRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  let x = el.offsetLeft;
  let y = el.offsetTop;

  const maxX = dRect.width - w;
  const maxY = dRect.height - h;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  el.style.left = x + "px";
  el.style.top = y + "px";
}

/* =========================================================
   CENTER IN DESKTOP (UTILISÉ POUR D’AUTRES FENÊTRES SI BESOIN)
========================================================= */
function centerInDesktop(el) {
  const dRect = getDesktopRect();
  el.style.left = Math.max(0, (dRect.width - el.offsetWidth) / 2) + "px";
  el.style.top = Math.max(0, (dRect.height - el.offsetHeight) / 2) + "px";
  clampToDesktop(el);
}

/* =========================================================
   VIEWER STATE
========================================================= */
const viewer = document.getElementById("text-viewer");
const textTitle = document.getElementById("text-title");
const textContent = document.getElementById("text-content");

/* =========================================================
   TRACK: DERNIÈRE SOURCE (FOLDER WINDOW) QUI A OUVERT UN FICHIER
   -> pour ouvrir le viewer près du bon dossier au lieu de centrer
========================================================= */
let lastFileSourceWindow = null;

/* =========================================================
   CLOSE VIEWER
========================================================= */
function closeViewer() {
  viewer.style.display = "none";
  textTitle.textContent = "Fichier";
  textContent.textContent = "";
}

/* =========================================================
   CLOSE ALL FOLDERS (SAUF VIEWER)
========================================================= */
function closeAllFolders() {
  document.querySelectorAll(".folder-window").forEach((w) => {
    if (w.id !== "text-viewer") w.style.display = "none";
  });
}

/* =========================================================
   (AVANT) RECENTER VIEWER ON RESIZE
   -> TU N’AIMES PAS LE CENTRAGE: on NE recentre plus en desktop.
   -> On garde un comportement propre: clamp/push uniquement.
========================================================= */

/* =========================================================
   POSITIONNER LE VIEWER PRÈS D’UNE FENÊTRE SOURCE (DESKTOP)
   - Desktop: viewer suit “l’esprit dossier”: collé/offset à côté
   - Mobile: on garde un comportement safe (centrage) sans casser ton responsive
========================================================= */
function placeViewerNearSource() {
  // Si mobile, on garde un comportement stable sans changer ta logique responsive
  if (isMobile()) {
    centerInDesktop(viewer);
    return;
  }

  const dRect = getDesktopRect();

  // Si on n’a pas de source, on évite le centré, on met une position “neutre” clampée
  if (!lastFileSourceWindow) {
    // Position neutre: un peu décalé du coin haut-gauche du desktop
    viewer.style.left = Math.max(0, 24) + "px";
    viewer.style.top = Math.max(0, 24) + "px";
    clampToDesktop(viewer);
    return;
  }

  // Position basée sur la fenêtre dossier source (même repère: offsetLeft/Top)
  const src = lastFileSourceWindow;

  // Ouvre le viewer à droite du dossier si possible, sinon à gauche
  const gap = 16;

  let proposedX = src.offsetLeft + src.offsetWidth + gap;
  let proposedY = src.offsetTop;

  // Si ça sort à droite, on essaie à gauche du dossier
  if (proposedX + viewer.offsetWidth > dRect.width) {
    proposedX = src.offsetLeft - viewer.offsetWidth - gap;
  }

  // Si ça sort toujours (ex: dossier trop à gauche), on clamp ensuite
  viewer.style.left = proposedX + "px";
  viewer.style.top = proposedY + "px";

  clampToDesktop(viewer);
}
/* =========================================================
   OPEN COMPUTER (COMME L’ANCIEN)
========================================================= */
function openComputer() {
  // état actif (CSS, overlay, etc.)
  const computer = document.getElementById("computer");
  if (computer) computer.classList.add("active");

  // ouverture fenêtre
  win.style.display = "block";
  win.style.left = (innerWidth - win.offsetWidth) / 2 + "px";
  win.style.top  = (innerHeight - win.offsetHeight) / 2 + "px";
  isLoading = true; // 🔥 on marque que le chargement est actif

  // loading
  document.getElementById("fill").style.width = "0%";
  document.getElementById("loading").style.display = "flex";
  desktop.style.display = "none";

  let p = 0;
  const t = setInterval(() => {
    p += 10;
    document.getElementById("fill").style.width = p + "%";

    if (p >= 100) {
      clearInterval(t);
      document.getElementById("loading").style.display = "none";
      desktop.style.display = "block";
      isLoading = false; // 🔥 chargement terminé
      


      if (isMobile()) {
        win.style.left = (innerWidth - win.offsetWidth) / 2 + "px";
        win.style.top  = (innerHeight - win.offsetHeight) / 2 + "px";
      }
    }
  }, 120);
}
/* =========================================================
   CLOSE MAIN WINDOW
========================================================= */
let dragWin = false;

document.getElementById("closeWin").addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

document.getElementById("closeWin").onclick = (e) => {
  e.stopPropagation();
  dragWin = false;
  win.style.display = "none";
  closeAllFolders();
  closeViewer();
};

/* =========================================================
   DRAG MAIN WINDOW (HOLD ONLY)
========================================================= */
let wx = 0,
  wy = 0;

document.getElementById("winBar").addEventListener("pointerdown", (e) => {
  if (isMobile()) return;
  if (e.target.closest("button")) return;

  dragWin = true;
  wx = e.clientX - win.offsetLeft;
  wy = e.clientY - win.offsetTop;
});

document.addEventListener("pointermove", (e) => {
  if (!dragWin) return;
  win.style.left = e.clientX - wx + "px";
  win.style.top = e.clientY - wy + "px";
});

document.addEventListener("pointerup", () => {
  dragWin = false;
});

/* =========================================================
   RESIZE + PUSH DOSSIERS + VIEWER CLAMP (SANS RECENTER)
========================================================= */
document.querySelectorAll(".resizer").forEach((r) => {
  r.onmousedown = (e) => {
    if (isMobile()) return;

    const w = win.offsetWidth;
    const h = win.offsetHeight;
    const x = e.clientX;
    const y = e.clientY;

    function move(ev) {
      if (r.classList.contains("right")) {
        win.style.width = w + (ev.clientX - x) + "px";
      }

      if (r.classList.contains("bottom")) {
        win.style.height = h + (ev.clientY - y) + "px";
      }

      if (r.classList.contains("corner")) {
        win.style.width = w + (ev.clientX - x) + "px";
        win.style.height = h + (ev.clientY - y) + "px";
      }

      pushFoldersOnResize();
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      pushFoldersOnResize();
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop, { once: true });
  };
});

/* =========================================================
   PUSH FOLDERS + CLAMP WINDOWS + CLAMP VIEWER
   ✅ Ici, on fait exactement ce que tu veux :
      - les icônes restent dans le desktop
      - les folder-windows restent dans le desktop
      - le viewer aussi (poussé/clamp), et surtout PAS centré.
========================================================= */
function pushFoldersOnResize() {
  const dRect = getDesktopRect();

  /* ---------------------------
     1) PUSH/CLAMP DES ICÔNES
  ---------------------------- */
  document.querySelectorAll(".folder").forEach((folder) => {
    let x = folder.offsetLeft;
    let y = folder.offsetTop;

    const maxX = dRect.width - folder.offsetWidth;
    const maxY = dRect.height - folder.offsetHeight;

    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;
    if (x < 0) x = 0;
    if (y < 0) y = 0;

    folder.style.left = x + "px";
    folder.style.top = y + "px";
  });

  /* ---------------------------
     2) CLAMP DE TOUTES LES FENÊTRES DOSSIERS (y compris viewer)
     -> pousse au bord, pas de “recentre”
  ---------------------------- */
  document.querySelectorAll(".folder-window").forEach((w) => {
    if (w.style.display !== "none") {
      // clamp classique basé sur offsetLeft/Top dans le desktop
      const maxX = dRect.width - w.offsetWidth;
      const maxY = dRect.height - w.offsetHeight;

      let x = w.offsetLeft;
      let y = w.offsetTop;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;

      w.style.left = x + "px";
      w.style.top = y + "px";
    }
  });
}

/* =========================================================
   DRAG FOLDER WINDOWS (HOLD BAR ONLY) — ALIGNÉ DOSSIERS
========================================================= */
document.querySelectorAll(".folder-window").forEach((w) => {
  const bar = w.querySelector(".folder-bar");
  let drag = false,
    ox = 0,
    oy = 0;

  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;

    const dRect = getDesktopRect();

    drag = true;

    // Repère cohérent desktop (même logique que tu avais sur les windows)
    ox = e.clientX - dRect.left - w.offsetLeft;
    oy = e.clientY - dRect.top - w.offsetTop;

    w.setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  });

  w.addEventListener("pointermove", (e) => {
    if (!drag) return;

    const dRect = getDesktopRect();

    let x = e.clientX - dRect.left - ox;
    let y = e.clientY - dRect.top - oy;

    const maxX = dRect.width - w.offsetWidth;
    const maxY = dRect.height - w.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    w.style.left = x + "px";
    w.style.top = y + "px";
  });

  w.addEventListener("pointerup", () => {
    drag = false;
  });

  w.addEventListener("pointercancel", () => {
    drag = false;
  });

  const closeBtn = w.querySelector(".folder-close");
  closeBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    w.style.display = "none";
    closeViewer();
  };
});

/* =========================================================
   DRAG FOLDERS ICONS
   ✅ FIX #1: GROS DÉCALAGE AU DRAG (MIX REPÈRES)
   Avant:
     ox = e.clientX - folder.offsetLeft;
     oy = e.clientY - folder.offsetTop;
   Puis:
     x = e.clientX - dRect.left - ox;
     y = e.clientY - dRect.top  - oy;
   -> ox/oy étaient en repère viewport alors que x/y utilisent desktop.
   -> Résultat: jump/offset énorme.

   Maintenant:
     ox = e.clientX - dRect.left - folder.offsetLeft;
     oy = e.clientY - dRect.top  - folder.offsetTop;
   -> EXACTEMENT comme pour les folder-windows.
========================================================= */
document.querySelectorAll(".folder").forEach((folder) => {
  let drag = false,
    ox = 0,
    oy = 0,
    moved = false;

  folder.addEventListener("pointerdown", (e) => {
    drag = true;
    moved = false;

    const dRect = getDesktopRect();

    // ✅ FIX: même repère que le move
    ox = e.clientX - dRect.left - folder.offsetLeft;
    oy = e.clientY - dRect.top - folder.offsetTop;

    folder.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  folder.addEventListener("pointermove", (e) => {
    if (!drag) return;
    moved = true;

    const dRect = getDesktopRect();

    let x = e.clientX - dRect.left - ox;
    let y = e.clientY - dRect.top - oy;

    const maxX = dRect.width - folder.offsetWidth;
    const maxY = dRect.height - folder.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    folder.style.left = x + "px";
    folder.style.top = y + "px";
  });

  folder.addEventListener("pointerup", () => {
    drag = false;

    if (isMobile() && !moved) {
      closeAllFolders();
      closeViewer();

      const t = document.getElementById("folder-" + folder.dataset.folder);
      if (t) {
        t.style.display = "block";
        clampToDesktop(t);
      }
    }
  });

  folder.addEventListener("dblclick", () => {
    if (isMobile()) return;

    closeAllFolders();
    closeViewer();

    const t = document.getElementById("folder-" + folder.dataset.folder);
    if (t) t.style.display = "block";
  });
});

/* =========================================================
   FILES : CLICK OPEN / HOLD DRAG READY
========================================================= */
document.querySelectorAll(".file, .text-content").forEach((el) => {
  el.addEventListener("pointerdown", (e) => e.stopPropagation());
});

document.getElementById("close-text").addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

document.getElementById("close-text").onclick = () => closeViewer();

/* =========================================================
   QUAND ON CLIQUE UN FICHIER:
   ✅ FIX #2: NE PLUS CENTRER LE VIEWER EN DESKTOP
   -> Le viewer se place près de la fenêtre dossier qui contient ce fichier
   -> Et ensuite il est clamp (poussé) par les bordures (resize inclus)
========================================================= */
document.querySelectorAll(".file").forEach((file) => {
  file.onclick = () => {
    // Titre + contenu
    textTitle.textContent = file.dataset.title;
    textContent.textContent = file.dataset.text.trim();

    // Trouver la fenêtre dossier parente (source)
    // (selon ton HTML, le fichier est très probablement dans .folder-window)
    const parentWindow = file.closest(".folder-window");

    // On garde la source (mais on évite de prendre le viewer lui-même)
    if (parentWindow && parentWindow.id !== "text-viewer") {
      lastFileSourceWindow = parentWindow;
    }

    // Afficher
    viewer.style.display = "block";

    // ❌ Avant: centerInDesktop(viewer);
    // ✅ Maintenant: placement “comme les dossiers”
    placeViewerNearSource();
  };
});

/* =========================================================
   BONUS STABILITÉ:
   - Si tu redimensionnes la fenêtre principale, le pushFoldersOnResize()
     clamp déjà le viewer.
   - Si tu changes la taille du viewport (resize navigateur),
     on clamp aussi (pas de recentre).
========================================================= */
window.addEventListener("resize", () => {
  // On ne casse pas le responsive.
  // Simplement: on repousse/clamp ce qui est visible
  pushFoldersOnResize();
});

/* =========================================================
   MOBILE: BLOQUE LE CLICK FANTÔME (DOUBLE OUVERTURE)
========================================================= */
const computerEl = document.getElementById("computer");
if (computerEl) {
document.getElementById("computer-icon")
  .addEventListener("click", openComputer);
};
/* =========================================================
   FORCE REFRESH SI RELOAD PENDANT LE LOADING
========================================================= */
window.addEventListener("pageshow", (e) => {
  // Si la page revient du cache ou a été reload pendant le loading
  if (isLoading || e.persisted) {
    location.reload();
  }
});
