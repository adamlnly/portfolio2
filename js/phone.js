/* =========================================================
   PHONE.JS — VERSION SAINE (COPIE DU PC)
========================================================= */

const phoneOverlay = document.getElementById("phone");
const phoneWindow  = document.getElementById("phoneWindow");
const phoneBar     = document.getElementById("phoneBar");
const phoneTitle   = document.getElementById("phoneTitle");
const phoneContent = document.getElementById("phoneContent");

/* DATA */
const contact = {
  mobile: "+33 7 68 07 00 76",
  email: "kassiouiadam@gmail.com",
  linkedin: "https://linkedin.com/in/adam"
};

/* =========================================================
   OPEN PHONE (APPELÉ DEPUIS main.js)
========================================================= */
function openPhone() {

  phoneOverlay.classList.add("active");
  phoneWindow.style.display = "block";
  showMenu();

  phoneWindow.style.left =
    (innerWidth - phoneWindow.offsetWidth) / 2 + "px";
  phoneWindow.style.top =
    (innerHeight - phoneWindow.offsetHeight) / 2 + "px";

  showContacts();
}

/* =========================================================
   CLOSE
========================================================= */
function closePhone() {
  phoneWindow.style.display = "none";
  phoneOverlay.classList.remove("active");
}

/* =========================================================
   SCREENS
========================================================= */
function showContacts() {
  phoneTitle.textContent = "CONTACTS";
  phoneContent.innerHTML = `
    <div class="phone-line" id="adamBtn">> Adam</div>
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

    <div class="phone-line" id="backBtn">< Retour</div>
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

  document.getElementById("backBtn").onclick = showContacts;
}

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
   DRAG (IDENTIQUE AU PC)
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
function showMenu(){
  phoneTitle.textContent = "MENU";
  phoneContent.innerHTML = `
    <div class="phone-line" onclick="showContacts()">> Contact</div>
    <div class="phone-line" onclick="showAbout()">> À propos</div>
  `;
}

function showAbout(){
  phoneTitle.textContent = "À propos de moi";
  phoneContent.innerHTML = `
    <div class="phone-detail" style="display:block">
      Développeur créatif.<br>
      Interfaces interactives.<br>
      Web expérimental.<br><br>
      <span class="phone-line" onclick="showMenu()">< Retour</span>
    </div>
  `;
}
