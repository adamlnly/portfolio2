/* =========================================================
   COMPUTER — VERSION FINALE STABLE
========================================================= */

const win      = document.getElementById("win");
const desktop  = document.getElementById("desktop");
const loading  = document.getElementById("loading");
const fill     = document.getElementById("fill");

const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* =========================================================
   OPEN COMPUTER (appelé depuis main.js)
========================================================= */
function openComputer() {
  document.getElementById("computer").classList.add("active");

  win.style.display = "block";

  if (isMobile) {
    // 📱 MOBILE : FENÊTRE FIXE, IMMOBILE
    win.style.position  = "fixed";
    win.style.width     = "92vw";
    win.style.height    = "80vh";
    win.style.left      = "4vw";
    win.style.top       = "10vh";
    win.style.transform = "none";
  } else {
    // 🖥️ DESKTOP : COMPORTEMENT ORIGINAL
    win.style.position = "absolute";
    win.style.left = (innerWidth - win.offsetWidth) / 2 + "px";
    win.style.top  = (innerHeight - win.offsetHeight) / 2 + "px";
  }

  fill.style.width = "0%";
  loading.style.display = "flex";
  desktop.style.display = "none";

  let p = 0;
  clearInterval(window._pcLoader);

  window._pcLoader = setInterval(() => {
    p += 10;
    fill.style.width = p + "%";

    if (p >= 100) {
      clearInterval(window._pcLoader);
      loading.style.display = "none";
      desktop.style.display = "block";
      pushFoldersOnResize();
      pushWindowsOnResize();
    }
  }, 120);
}

/* =========================================================
   CLOSE
========================================================= */
document.getElementById("closeWin").onclick = () => {
  win.style.display = "none";
  document.getElementById("computer").classList.remove("active");
};

/* =========================================================
   DRAG MAIN WINDOW
========================================================= */
let wx = 0, wy = 0, dragWin = false;

document.getElementById("winBar").onmousedown = e => {
  if (isMobile) return; // 📱 BLOQUÉ
  dragWin = true;
  wx = e.clientX - win.offsetLeft;
  wy = e.clientY - win.offsetTop;
};

document.addEventListener("mousemove", e => {
  if (!dragWin) return;
  win.style.left = (e.clientX - wx) + "px";
  win.style.top  = (e.clientY - wy) + "px";
});

document.addEventListener("mouseup", () => dragWin = false);

/* =========================================================
   RESIZE MAIN WINDOW
========================================================= */
document.querySelectorAll(".resizer").forEach(r => {
  r.onmousedown = e => {
    if (isMobile) return; // 📱 BLOQUÉ

    const w = win.offsetWidth;
    const h = win.offsetHeight;
    const x = e.clientX;
    const y = e.clientY;

    function move(ev) {
      if (r.classList.contains("right"))
        win.style.width = w + (ev.clientX - x) + "px";

      if (r.classList.contains("bottom"))
        win.style.height = h + (ev.clientY - y) + "px";

      if (r.classList.contains("corner")) {
        win.style.width  = w + (ev.clientX - x) + "px";
        win.style.height = h + (ev.clientY - y) + "px";
      }

      pushFoldersOnResize();
      pushWindowsOnResize();
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      pushFoldersOnResize();
      pushWindowsOnResize();
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop, { once: true });
  };
});

/* =========================================================
   DRAG DOSSIERS
========================================================= */
document.querySelectorAll(".folder").forEach(folder => {
  let dragging = false;
  let ox = 0, oy = 0;

  folder.addEventListener("mousedown", e => {
    if (isMobile) return; // 📱 PAS DE DRAG
    dragging = true;

    const fRect = folder.getBoundingClientRect();
    ox = e.clientX - fRect.left;
    oy = e.clientY - fRect.top;

    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dRect = desktop.getBoundingClientRect();

    let x = e.clientX - dRect.left - ox;
    let y = e.clientY - dRect.top  - oy;

    const maxX = dRect.width  - folder.offsetWidth;
    const maxY = dRect.height - folder.offsetHeight;

    folder.style.left = Math.max(0, Math.min(x, maxX)) + "px";
    folder.style.top  = Math.max(0, Math.min(y, maxY)) + "px";
  });

  document.addEventListener("mouseup", () => dragging = false);

  // 📱 TAP / 🖥️ DOUBLE CLIC
  const openFolder = () => {
    document.querySelectorAll(".folder-window")
      .forEach(w => w.style.display = "none");

    const target = document.getElementById("folder-" + folder.dataset.folder);
    if (target) target.style.display = "block";
  };

  if (isMobile) {
    folder.addEventListener("click", openFolder);
  } else {
    folder.addEventListener("dblclick", openFolder);
  }
});

/* =========================================================
   DRAG FENÊTRES INTERNES
========================================================= */
document.querySelectorAll(".folder-window").forEach(winBox => {
  const bar = winBox.querySelector(".folder-bar");
  let dragging = false;
  let ox = 0, oy = 0;

  bar.addEventListener("mousedown", e => {
    if (isMobile) return; // 📱 BLOQUÉ
    dragging = true;

    const wRect = winBox.getBoundingClientRect();
    ox = e.clientX - wRect.left;
    oy = e.clientY - wRect.top;

    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dRect = desktop.getBoundingClientRect();

    let x = e.clientX - dRect.left - ox;
    let y = e.clientY - dRect.top  - oy;

    const maxX = dRect.width  - winBox.offsetWidth;
    const maxY = dRect.height - winBox.offsetHeight;

    winBox.style.left = Math.max(0, Math.min(x, maxX)) + "px";
    winBox.style.top  = Math.max(0, Math.min(y, maxY)) + "px";
  });

  document.addEventListener("mouseup", () => dragging = false);

  winBox.querySelector(".folder-close").onclick = () => {
    winBox.style.display = "none";
  };
});

/* =========================================================
   COLLISIONS AU RESIZE
========================================================= */
function pushFoldersOnResize() {
  const dRect = desktop.getBoundingClientRect();

  document.querySelectorAll(".folder").forEach(folder => {
    const maxX = dRect.width  - folder.offsetWidth;
    const maxY = dRect.height - folder.offsetHeight;

    folder.style.left = Math.max(0, Math.min(folder.offsetLeft, maxX)) + "px";
    folder.style.top  = Math.max(0, Math.min(folder.offsetTop,  maxY)) + "px";
  });
}

function pushWindowsOnResize() {
  const dRect = desktop.getBoundingClientRect();

  document.querySelectorAll(".folder-window").forEach(winBox => {
    const maxX = dRect.width  - winBox.offsetWidth;
    const maxY = dRect.height - winBox.offsetHeight;

    winBox.style.left = Math.max(0, Math.min(winBox.offsetLeft, maxX)) + "px";
    winBox.style.top  = Math.max(0, Math.min(winBox.offsetTop,  maxY)) + "px";
  });
}

/* =========================================================
   TEXT VIEWER
========================================================= */
const viewer = document.getElementById("text-viewer");
const textTitle = document.getElementById("text-title");
const textContent = document.getElementById("text-content");

document.getElementById("close-text").onclick = () => {
  viewer.style.display = "none";
};

document.querySelectorAll(".file").forEach(file => {
  file.onclick = () => {
    textTitle.textContent = file.dataset.title;
    textContent.textContent = file.dataset.text.trim();
    viewer.style.display = "block";
  };
});
