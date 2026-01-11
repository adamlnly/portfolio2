console.log("sign.js démarre");

/* ========= ELEMENTS ========= */
const sign      = document.getElementById("sign");
const windowEl  = document.getElementById("signWindow");
const textEl    = document.getElementById("signText");
const closeBtn  = document.getElementById("signClose");

/* ========= TEXTE ========= */
const fullText = `Adam Kassioui

Je m'appelle Adam Kassioui, je suis étudiant en début d'année MMI .
Je m’intéresse particulièrement au développement web et à la création numérique.
J’aime concevoir des interfaces interactives, expérimenter avec le code
et donner vie à des idées à travers le numérique.
`

/* ========= TYPEWRITER ========= */
let typing;

function typeText() {
  textEl.textContent = "";
  let i = 0;

  typing = setInterval(() => {
    textEl.textContent += fullText[i++] || "";
    if (i > fullText.length) clearInterval(typing);
  }, 15);
}

/* ========= OPEN / CLOSE ========= */
function openSign() {
  sign.classList.add("active");

  windowEl.style.left = (innerWidth - windowEl.offsetWidth) / 2 + "px";
  windowEl.style.top  = (innerHeight - windowEl.offsetHeight) / 2 + "px";

  typeText();
}

function closeSign() {
  sign.classList.remove("active");
  clearInterval(typing);
}

/* ========= DRAG ========= */
let drag = false, dx = 0, dy = 0;

windowEl.onmousedown = e => {
  drag = true;
  dx = e.clientX - windowEl.offsetLeft;
  dy = e.clientY - windowEl.offsetTop;
};

document.onmousemove = e => {
  if (!drag) return;
  windowEl.style.left = e.clientX - dx + "px";
  windowEl.style.top  = e.clientY - dy + "px";
};

document.onmouseup = () => drag = false;

/* ========= EVENTS ========= */
closeBtn.onclick = closeSign;

/* ========= EXPORT ========= */
window.openSign  = openSign;
window.closeSign = closeSign;

console.log("sign.js terminé");
