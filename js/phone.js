/* =========================================================
   PHONE.JS — VERSION STABLE
========================================================= */

const phoneOverlay = document.getElementById("phone");
const phoneWindow  = document.getElementById("phoneWindow");
const phoneBar     = document.getElementById("phoneBar");
const phoneTitle   = document.getElementById("phoneTitle");
const phoneContent = document.getElementById("phoneContent");
function isMobile(){
  return window.matchMedia("(max-width: 768px)").matches;
}


/* =========================================================
   DATA
========================================================= */
const contact = {
  mobile: "+33 7 68 07 00 76",
  email: "kassiouiadam@gmail.com",
  linkedin: "https://linkedin.com/in/adam",
  github: "https://github.com/adam"
};

/* =========================================================
   OPEN PHONE
========================================================= */
function openPhone() {
  phoneOverlay.classList.add("active");
  phoneWindow.style.display = "block";

  // centré (desktop)
  phoneWindow.style.left =
    (innerWidth - phoneWindow.offsetWidth) / 2 + "px";
  phoneWindow.style.top =
    (innerHeight - phoneWindow.offsetHeight) / 2 + "px";

  showMenu();
}

/* =========================================================
   CLOSE
========================================================= */
function closePhone() {
  phoneWindow.style.display = "none";
  phoneOverlay.classList.remove("active");
}

/* =========================================================
   MENU PRINCIPAL
========================================================= */
function showMenu(){
  phoneTitle.textContent = "MENU";
  phoneContent.innerHTML = `
    <div class="phone-line" onclick="showContacts()">> CONTACTS</div>
    <div class="phone-line phone-about">> ABOUT ME</div>
  `;

  // 🔥 on reconnecte le clic proprement
  const aboutBtn = phoneContent.querySelector(".phone-about");
  if (aboutBtn) {
    aboutBtn.addEventListener("click", showAbout);
  }
}


/* =========================================================
   CONTACTS
========================================================= */
function showContacts() {
  phoneTitle.textContent = "CONTACTS";
  phoneContent.innerHTML = `
    <div class="phone-line" id="adamBtn">> Adam</div>
    <br>
    <span class="phone-line" onclick="showMenu()">< Retour</span>
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

    <br>
    <span class="phone-line" onclick="showContacts()">< Retour</span>
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
   ABOUT ME (LONG + SCROLLABLE)
========================================================= */
function showAbout(){
  phoneTitle.textContent = "ABOUT ME";
  phoneContent.innerHTML = `
    <div class="phone-detail" style="display:block">

      <strong>Adam Kassioui</strong><br><br>

      Développeur créatif spécialisé en interfaces interactives
      et web expérimental.<br><br>

      <strong>Liens</strong><br>
      • <a href="${contact.linkedin}" target="_blank">LinkedIn</a><br>
      • <a href="${contact.github}" target="_blank">GitHub</a><br>
      • <a href="assets/cv.pdf" target="_blank">CV (PDF)</a><br><br>

      <strong>Formation</strong><br>
      Formé aux règles Opquast.<br>
      Certification prévue en mars 2026.<br><br>

      <strong>Témoignages</strong><br>
      • Maître de stage — projet web professionnel<br>
      • Camarade — projets scolaires collaboratifs<br>
      • Collègue — travail en équipe créative<br><br>

      <strong>Projets</strong><br>
      Projet Alpha — 2024<br>
      HTML / CSS / JS<br>
      Projet personnel<br><br>

      Projet Beta — 2025<br>
      Web interactif<br>
      Projet scolaire<br><br>

      <span class="phone-line" onclick="showMenu()">< Retour</span>

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
   DRAG (DESKTOP UNIQUEMENT)
========================================================= */
let dragging = false;
let ox = 0, oy = 0;

phoneBar.addEventListener("mousedown", e => {
  dragging = true;
  ox = e.clientX - phoneWindow.offsetLeft;
  oy = e.clientY - phoneWindow.offsetTop;
});

document.addEventListener("mousemove", e => {
  if (!dragging) return;
  phoneWindow.style.left = (e.clientX - ox) + "px";
  phoneWindow.style.top  = (e.clientY - oy) + "px";
});

document.addEventListener("mouseup", () => dragging = false);
