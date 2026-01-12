/*
  NOTE :
  J’ai choisi de gérer le contenu texte de la pancarte directement en JavaScript.
  À l’origine, j’avais mis en place un effet où le texte apparaissait de manière
  manuscrite, progressivement, mais cet effet provoquait trop de bugs
  (problèmes d’affichage, de timing et de performances).
  J’ai donc décidé de conserver une version plus stable et fiable.
*/

const sign      = document.getElementById("sign");
const windowEl  = document.getElementById("signWindow");
const textEl    = document.getElementById("signTextContent");
const closeBtn  = document.getElementById("signClose");
const carousel  = document.querySelector(".testimonial-box");

function clampToViewport(el, margin = 0) {
  el.style.left = Math.min(
    Math.max(el.offsetLeft, margin),
    innerWidth - el.offsetWidth - margin
  ) + "px";

  el.style.top = Math.min(
    Math.max(el.offsetTop, margin),
    innerHeight - el.offsetHeight - margin
  ) + "px";
}

const fullText = `
<div class="sign-center-title">À PROPOS DE MOI</div>

<p>
Je m’appelle Adam Kassioui, étudiant en BUT Métiers du Multimédia et de l’Internet (MMI),
avec un intérêt particulier pour le développement web et la création numérique.
</p>

<p>
J’aime concevoir des interfaces modernes, imaginer des expériences interactives
et expérimenter de nouvelles idées afin de donner vie à des projets concrets.
</p>

<p>
Je suis également formé aux bonnes pratiques du web, notamment à travers
la méthodologie <strong>Opquast</strong>, avec une attention particulière portée
à la qualité, à l’accessibilité et à l’expérience utilisateur.
</p>

<p>
Pour plus de détails sur mon parcours et mes expériences,
vous pouvez consulter
<a href="assets/images/cvadam.pdf" target="_blank">mon CV</a>.
</p>

<div class="sign-center-title">COMPÉTENCES</div>

<p>
HTML / CSS / JavaScript<br>
UI / UX Design – Figma<br>
Création numérique
</p>

<div class="sign-center-title">TÉMOIGNAGES</div>
`;

function openSign() {
  sign.classList.add("active");

  windowEl.style.left = (innerWidth - windowEl.offsetWidth) / 2 + "px";
  windowEl.style.top  = (innerHeight - windowEl.offsetHeight) / 2 + "px";

  clampToViewport(windowEl);

  carousel.style.opacity = "0";
  carousel.style.pointerEvents = "none";

  textEl.innerHTML = "";
  textEl.classList.remove("show");

  requestAnimationFrame(() => {
    textEl.innerHTML = fullText;
    textEl.classList.add("show");

    setTimeout(() => {
      carousel.style.opacity = "1";
      carousel.style.pointerEvents = "auto";
    }, 200);
  });

  testiIndex = 0;
  renderTestimonial();
}

function closeSign() {
  sign.classList.remove("active");
}

closeBtn.onclick = closeSign;
window.openSign = openSign;

let drag = false, dx = 0, dy = 0;

windowEl.addEventListener("mousedown", e => {
  drag = true;
  dx = e.clientX - windowEl.offsetLeft;
  dy = e.clientY - windowEl.offsetTop;
});

document.addEventListener("mousemove", e => {
  if (!drag) return;
  windowEl.style.left = e.clientX - dx + "px";
  windowEl.style.top  = e.clientY - dy + "px";
  clampToViewport(windowEl);
});

document.addEventListener("mouseup", () => drag = false);

const testimonials = [
  {
    name: "Mohammed",
    text: "Adam a travaillé en tant qu’intérimaire et s’est montré réactif et sérieux sur les missions qui lui étaient confiées. Toujours de bonne humeur et avec un bon esprit d’équipe, c’était très agréable de travailler avec lui."
  },
  {
    name: "Lucas",
    text: "Adam a travaillé pendant deux mois en tant qu’intérimaire et a fait un travail sérieux et efficace. Même quand certaines missions étaient compliquées, il a su bien les gérer. Son implication a été très appréciée."
  },
  {
    name: "Sabrina",
    text: "Adam a travaillé avec nous pendant deux mois et a vraiment bien travaillé. Même quand certaines missions étaient un peu compliquées, il a su gérer sans problème. Sérieux, efficace et agréable au quotidien."
  },
  {
    name: "Paul",
    text: "J’ai travaillé avec Adam sur plusieurs projets. Il était sérieux et impliqué, et même quand les tâches étaient compliquées, il a su gérer. C’était agréable de travailler avec lui."
  }
];

const testiNameEl = document.getElementById("testiName");
const testiTextEl = document.getElementById("testiText");
const prevBtn = document.querySelector(".testi-nav.prev");
const nextBtn = document.querySelector(".testi-nav.next");

let testiIndex = 0;

function renderTestimonial() {
  const t = testimonials[testiIndex];
  testiNameEl.textContent = t.name;
  testiTextEl.textContent = t.text;
}

prevBtn.onclick = () => {
  testiIndex = (testiIndex + testimonials.length - 1) % testimonials.length;
  renderTestimonial();
};

nextBtn.onclick = () => {
  testiIndex = (testiIndex + 1) % testimonials.length;
  renderTestimonial();
};
