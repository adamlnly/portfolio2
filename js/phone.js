/*
  NOTE :
  La gestion complète de cette fenêtre téléphone
  (navigation interne, affichage conditionnel mobile/tablette,
  drag de la fenêtre et limites à l’écran)
  était difficile à concevoir seul.
  Je me suis aidé de l’IA pour générer cette structure,
  puis je l’ai comprise et adaptée à mon projet.
*/

const phoneOverlay = document.getElementById("phone");
const phoneWindow  = document.getElementById("phoneWindow");
const phoneBar     = document.getElementById("phoneBar");
const phoneTitle   = document.getElementById("phoneTitle");
const phoneContent = document.getElementById("phoneContent");

/* ================= HELPERS ================= */
function isDesktop(){
  return window.innerWidth >= 1025;
}

/* ================= DATA ================= */
const contact = {
  mobile: "+33 7 68 07 00 76",
  email: "kassiouiadam@gmail.com",
  linkedin: "https://www.linkedin.com/in/adam-kassioui-6b6681350/"
};

/* ================= OPEN / CLOSE ================= */
function openPhone() {
  phoneOverlay.classList.add("active");
  phoneWindow.style.display = "block";

  // Centrage uniquement sur desktop
  if (isDesktop()) {
    phoneWindow.style.left =
      (innerWidth - phoneWindow.offsetWidth) / 2 + "px";
    phoneWindow.style.top =
      (innerHeight - phoneWindow.offsetHeight) / 2 + "px";
  }

  showMenu();
}

function closePhone() {
  phoneWindow.style.display = "none";
  phoneOverlay.classList.remove("active");
}

/* ================= MENU ================= */
function showMenu(){
  phoneTitle.textContent = "MENU";

  phoneContent.innerHTML = `
    <div class="phone-line" data-action="contacts">> CONTACTS</div>
    <div class="phone-line phone-only" data-action="about">> À PROPOS</div>
    <div class="phone-line phone-skills" data-action="skills">> COMPÉTENCES</div>
    <div class="phone-line phone-testimonials" data-action="testimonials">> TÉMOIGNAGES</div>
  `;
}

/* ================= CONTACTS ================= */
function showContacts() {
  phoneTitle.textContent = "CONTACTS";

  phoneContent.innerHTML = `
    <div class="phone-line" data-action="adam">> Adam</div>
    <span class="phone-line phone-back" data-action="menu">< Retour</span>
  `;
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

    <span class="phone-line phone-back" data-action="contacts">< Retour</span>
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

/* ================= À PROPOS ================= */
function showAbout(){
  phoneTitle.textContent = "À PROPOS";

  phoneContent.innerHTML = `
    <div class="phone-detail phone-only" style="display:block">
      Je m'appelle <strong>Adam Kassioui</strong>, étudiant en
      <strong>BUT Métiers du Multimédia et de l’Internet (MMI)</strong>,
      passionné par le développement web et la création numérique.<br><br>

      J’aime concevoir des interfaces modernes, imaginer des expériences
      interactives et donner vie à des projets concrets.<br><br>

      <strong>Orientation</strong><br>
      Développement web<br>
      Création numérique<br>
      Interfaces interactives<br><br>

      Formé aux bonnes pratiques du web (méthodologie <strong>Opquast</strong>).<br><br>

      <a href="assets/images/cvadam.pdf" target="_blank">Voir mon CV</a><br><br>

      <span class="phone-line phone-back" data-action="menu">< Retour</span>
    </div>
  `;
}

/* ================= COMPÉTENCES ================= */
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

      <span class="phone-line phone-back" data-action="menu">< Retour</span>
    </div>
  `;
}

/* ================= TÉMOIGNAGES ================= */
function showTestimonials(){
  phoneTitle.textContent = "TÉMOIGNAGES";

  phoneContent.innerHTML = `
    <div class="phone-detail phone-only" style="display:block">
      <strong>Mohammed</strong><br>
      Adam a travaillé en tant qu’intérimaire et s’est montré réactif
      et sérieux sur les missions qui lui étaient confiées.<br><br>

      <strong>Lucas</strong><br>
      Adam a fait un travail sérieux et efficace,
      même sur des missions complexes.<br><br>

      <strong>Sabrina</strong><br>
      Sérieux, efficace et agréable au quotidien,
      c’était cool de bosser avec lui.<br><br>

      <strong>Paul</strong><br>
      Sérieux et impliqué sur tous les projets.<br><br>

      <span class="phone-line phone-back" data-action="menu">< Retour</span>
    </div>
  `;
}

/* ================= ROUTER ================= */
phoneContent.addEventListener("click", e => {
  const line = e.target.closest("[data-action]");
  if (!line) return;

  const action = line.dataset.action;

  if (action === "menu") showMenu();
  if (action === "contacts") showContacts();
  if (action === "adam") showAdam();
  if (action === "about") showAbout();
  if (action === "skills") showSkills();
  if (action === "testimonials") showTestimonials();
});

/* ================= TOGGLE ================= */
function toggle(btnId, detailId, action) {
  const btn = document.getElementById(btnId);
  const detail = document.getElementById(detailId);

  btn.onclick = () => {
    detail.style.display =
      detail.style.display === "block" ? "none" : "block";
  };

  detail.onclick = action;
}

/* ================= DRAG (DESKTOP UNIQUEMENT) ================= */
let dragging = false;
let ox = 0, oy = 0;

phoneBar.addEventListener("pointerdown", e => {
  if (!isDesktop()) return;
  dragging = true;
  ox = e.clientX - phoneWindow.offsetLeft;
  oy = e.clientY - phoneWindow.offsetTop;
});

document.addEventListener("pointermove", e => {
  if (!dragging) return;

  phoneWindow.style.left = e.clientX - ox + "px";
  phoneWindow.style.top  = e.clientY - oy + "px";
});

document.addEventListener("pointerup", () => dragging = false);

/* ================= EXPORT ================= */
window.openPhone = openPhone;

console.log("phone.js chargé — VERSION NETTOYÉE ✅");
