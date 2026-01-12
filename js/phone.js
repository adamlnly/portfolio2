/* =========================================================
   PHONE.JS — VERSION STABLE
========================================================= */

const phoneOverlay = document.getElementById("phone");
const phoneWindow  = document.getElementById("phoneWindow");
const phoneBar     = document.getElementById("phoneBar");
const phoneTitle   = document.getElementById("phoneTitle");
const phoneContent = document.getElementById("phoneContent");

/* =========================================================
   UTILS
========================================================= */
function isMobile(){
  return window.matchMedia("(max-width:768px)").matches;
}

/* =========================================================
   DATA
========================================================= */
const contact = {
  mobile: "+33 7 68 07 00 76",
  email: "kassiouiadam@gmail.com",
  linkedin: "https://www.linkedin.com/in/adam-kassioui-6b6681350/",
  github: "https://github.com/adam"
};

/* =========================================================
   OPEN / CLOSE
========================================================= */
function openPhone() {
  phoneOverlay.classList.add("active");
  phoneWindow.style.display = "block";

  phoneWindow.style.left =
    (innerWidth - phoneWindow.offsetWidth) / 2 + "px";
  phoneWindow.style.top =
    (innerHeight - phoneWindow.offsetHeight) / 2 + "px";

  showMenu();
}

function closePhone() {
  phoneWindow.style.display = "none";
  phoneOverlay.classList.remove("active");
}

/* =========================================================
   MENU
========================================================= */
function showMenu(){
  phoneTitle.textContent = "MENU";

  phoneContent.innerHTML = `
    <div class="phone-line" onclick="showContacts()">> CONTACTS</div>
    ${isMobile() ? `<div class="phone-line phone-about" onclick="showAbout()">> ABOUT ME</div>` : ``}
    <div class="phone-line phone-skills" onclick="showSkills()">> COMPÉTENCES</div>
    <div class="phone-line phone-testimonials" onclick="showTestimonials()">> TÉMOIGNAGES</div>
  `;
}

/* =========================================================
   CONTACTS
========================================================= */
function showContacts() {
  phoneTitle.textContent = "CONTACTS";
  phoneContent.innerHTML = `
    <div class="phone-line" id="adamBtn">> Adam</div>
    <span class="phone-line phone-back" onclick="showMenu()">< Retour</span>
  `;

  document.getElementById("adamBtn").onclick = showAdam;
}

function showAdam() {
  phoneTitle.textContent = "Adam";
  phoneContent.innerHTML = `
    <div class="phone-line" id="mobileBtn">> Mobile</div>
    <div class="phone-detail" id="mobileDetail">${contact.mobile}</div>

    <div class="phone-line" id="emailBtn">> Email</div>
    <div class="phone-detail" id="emailDetail">${contact.email}</div>

    <div class="phone-line" id="linkedinBtn">> LinkedIn</div>
    <div class="phone-detail" id="linkedinDetail">Voir le profil</div>

    <span class="phone-line phone-back" onclick="showContacts()">< Retour</span>
  `;

  toggle("mobileBtn", "mobileDetail", () =>
    location.href = `tel:${contact.mobile.replace(/\s/g, "")}`
  );

  toggle("emailBtn", "emailDetail", () =>
    location.href = `mailto:${contact.email}`
  );

  toggle("linkedinBtn", "linkedinDetail", () =>
    window.open(contact.linkedin, "_blank")
  );
}

/* =========================================================
   ABOUT ME — MOBILE ONLY (SAFE)
========================================================= */
function showAbout(){
  if (!isMobile()) {
    showMenu();
    return;
  }

  phoneTitle.textContent = "ABOUT ME";
  phoneContent.innerHTML = `
    <div class="phone-detail phone-only" style="display:block">

      Je m'appelle <strong>Adam Kassioui</strong>, étudiant en
      <strong>BUT Métiers du Multimédia et de l’Internet (MMI)</strong>,
      avec un intérêt particulier pour le développement web
      et la création numérique.<br><br>

      J’aime concevoir des interfaces modernes,
      imaginer des expériences interactives
      et expérimenter de nouvelles idées afin
      de donner vie à des projets concrets.<br><br>

      <strong>Orientation</strong><br>
      Développement web<br>
      Création numérique<br>
      Interfaces interactives<br><br>

      
      Je suis également formé aux bonnes pratiques du web, notamment à travers
      la méthodologie <strong>Opquast</strong>, avec une attention particulière portée
      à la qualité, à l’accessibilité et à l’expérience utilisateur.

      Pour plus de détails sur mon parcours et mes expériences,
      vous pouvez consulter
      <strong><a href="assets/images/cvadam.pdf" target="_blank" style="color: blue;">mon CV</a>.</strong> <br><br>



      <span class="phone-line phone-back" onclick="showMenu()">< Retour</span>
    </div>
  `;
}

/* =========================================================
   COMPÉTENCES — MOBILE
========================================================= */
function showSkills(){
  phoneTitle.textContent = "COMPÉTENCES";
  phoneContent.innerHTML = `
    <div class="phone-detail phone-only" style="display:block">

      <strong>Développement</strong><br>
      HTML / CSS / JavaScript<br><br>

      <strong>Design</strong><br>
      UI / UX Design<br>
      Figma<br><br>

      <strong>Création numérique</strong><br>
      Suite Adobe<br>
      Expérimentations web<br><br>

      <span class="phone-line phone-back" onclick="showMenu()">< Retour</span>
    </div>
  `;
}

/* =========================================================
   TÉMOIGNAGES — MOBILE
========================================================= */
function showTestimonials(){
  phoneTitle.textContent = "TÉMOIGNAGES";
  phoneContent.innerHTML = `
    <div class="phone-detail phone-only" style="display:block">

      <strong>Mohammed</strong><br>
      Adam a travaillé en tant qu’intérimaire et s’est montré réactif
      et sérieux sur les missions qui lui étaient confiées.
      Toujours de bonne humeur et avec un bon esprit d’équipe,
      c’était très agréable de travailler avec lui.<br><br>

      <strong>Lucas</strong><br>
      Adam a travaillé pendant deux mois en tant qu’intérimaire
      et a fait un travail sérieux et efficace.
      Même quand certaines missions étaient compliquées,
      il a su bien les gérer. Son implication a été très appréciée.<br><br>

      <strong>Sabrina</strong><br>
      Adam a travaillé avec nous pendant deux mois et a vraiment
      bien taffé. Même quand certaines missions étaient un peu
      compliquées, il a su gérer sans problème.
      Sérieux, efficace et agréable au quotidien,
      c’était cool de bosser avec lui.<br><br>

      <strong>Paul</strong><br>
      J’ai travaillé avec Adam sur plusieurs projets.
      Il était sérieux et impliqué, et même quand les tâches
      étaient compliquées, il a su gérer.
      C’était agréable de travailler avec lui.<br><br>

      <span class="phone-line phone-back" onclick="showMenu()">< Retour</span>
    </div>
  `;
}

/* =========================================================
   TOGGLE UTILS
========================================================= */
function toggle(btnId, detailId, action) {
  const btn = document.getElementById(btnId);
  const detail = document.getElementById(detailId);

  btn.onclick = () => {
    detail.style.display =
      detail.style.display === "block" ? "none" : "block";
  };

  detail.onclick = action;
}

/* =========================================================
   DRAG — DESKTOP UNIQUEMENT
========================================================= */
let dragging = false;
let ox = 0, oy = 0;

phoneBar.addEventListener("pointerdown", e => {
  if (isMobile()) return;
  dragging = true;
  ox = e.clientX - phoneWindow.offsetLeft;
  oy = e.clientY - phoneWindow.offsetTop;
});

document.addEventListener("pointermove", e => {
  if (!dragging) return;

  let x = e.clientX - ox;
  let y = e.clientY - oy;

  const maxX = window.innerWidth  - phoneWindow.offsetWidth;
  const maxY = window.innerHeight - phoneWindow.offsetHeight;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  phoneWindow.style.left = x + "px";
  phoneWindow.style.top  = y + "px";
});

document.addEventListener("pointerup", () => dragging = false);

console.log("phone.js chargé");
