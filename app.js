// =============================================================
//  app.js: builds the page from data.js and adds the
//  interactive features and PWA bits.
//  You normally don't need to edit this file.
// =============================================================

const P = PORTFOLIO;
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

// Escape text so nothing in data.js can break the page
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const link = (href, text, cls = "") =>
  `<a href="${esc(href)}" class="${cls}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(text)}</a>`;

// Skill chips are buttons: clicking one opens the skill explorer
const chips = (items) =>
  `<ul class="chips">${items
    .map((t) => `<li><button type="button" class="chip" data-skill="${esc(t)}">${esc(t)}</button></li>`)
    .join("")}</ul>`;

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 2200);
}

// =============================================================
//  HERO: name, typing effect, links, counters
// =============================================================
$("hero-location").textContent = P.location;
$("hero-name").textContent = P.name;
$("hero-intro").textContent = P.intro;
$("role-static").textContent = P.roles[0];

(function typeRoles() {
  const el = $("typed");
  if (reducedMotion) { el.textContent = P.roles[0]; return; }
  let r = 0, i = 0, deleting = false;
  (function tick() {
    const word = P.roles[r];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
    else if (!deleting) { deleting = true; setTimeout(tick, 1800); }
    else if (i > 0) { i--; setTimeout(tick, 35); }
    else { deleting = false; r = (r + 1) % P.roles.length; setTimeout(tick, 300); }
  })();
})();

const socials = [];
if (P.github) socials.push(link(P.github, "GitHub"));
if (P.linkedin) socials.push(link(P.linkedin, "LinkedIn"));
if (P.cv) socials.push(link(P.cv, "Download CV"));
$("hero-links").innerHTML = socials.join("");

$("stats").innerHTML = P.stats
  .map((s) => `<div class="stat"><strong data-count="${s.value}">${reducedMotion ? s.value : 0}</strong><span>${esc(s.label)}</span></div>`)
  .join("");

function runCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}
if (!reducedMotion) setTimeout(runCounters, 400);

// =============================================================
//  ABOUT + SKILLS
// =============================================================
$("about-text").innerHTML = P.about.map((p) => `<p>${esc(p)}</p>`).join("");

$("skills-grid").innerHTML = P.skills
  .map((s) => `<div class="card"><h3>${esc(s.group)}</h3>${chips(s.items)}</div>`)
  .join("");

// Build an index: skill name -> everywhere it appears
const skillIndex = {};
const addUse = (skill, use) => (skillIndex[skill] = skillIndex[skill] || []).push(use);
P.projects.forEach((p, i) => p.stack.forEach((s) => addUse(s, { type: "Project", title: p.title, project: i })));
P.education.years.forEach((y, yi) =>
  y.modules.forEach((m) => m.skills.forEach((s) => addUse(s, { type: `Uni · ${y.label}`, title: m.name, year: yi })))
);

function showSkill(skill) {
  const panel = $("skill-panel");
  const uses = skillIndex[skill] || [];
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("selected", c.dataset.skill === skill));
  panel.innerHTML = `
    <h3>${esc(skill)}</h3>
    ${uses.length
      ? `<ul>${uses
          .map((u, i) => `<li><span class="badge">${esc(u.type)}</span><a data-use="${i}">${esc(u.title)}</a></li>`)
          .join("")}</ul>`
      : `<p class="empty">Learning this through self-study. Projects using it are coming soon.</p>`}`;
  panel.hidden = false;
  panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in");
  panel.querySelectorAll("[data-use]").forEach((a) =>
    a.addEventListener("click", () => {
      const u = uses[Number(a.dataset.use)];
      if (u.project !== undefined) goToProject(u.project);
      else goToModule(u.year, u.title);
    })
  );
}

// Any chip anywhere on the page opens the explorer
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  showSkill(chip.dataset.skill);
  if (!chip.closest("#skills")) $("skills").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
});

// =============================================================
//  PROJECTS: filters + "read more"
// =============================================================
function renderProjects(filter = "All") {
  const list = P.projects
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => filter === "All" || p.stack.includes(filter));
  $("projects-list").innerHTML = list.length
    ? list.map(({ p, i }) => {
        const links = [];
        if (p.live) links.push(link(p.live, "Live demo ↗", "btn btn-small"));
        if (p.code) links.push(link(p.code, "Source code", "btn btn-small btn-outline"));
        return `
          <article class="card project fade-in" id="project-${i}">
            <div class="project-top"><h3>${esc(p.title)}</h3><span class="year">${esc(p.year || "")}</span></div>
            <p class="summary">${esc(p.summary)}</p>
            <h4>The problem</h4>
            <p>${esc(p.problem)}</p>
            <div class="more" id="more-${i}" hidden>
              <h4>What I built</h4>
              <ul class="points">${p.built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
              ${p.learned ? `<h4>What I learned</h4><p>${esc(p.learned)}</p>` : ""}
            </div>
            ${chips(p.stack)}
            <div class="project-links">
              ${links.join("")}
              <button type="button" class="toggle-more" aria-expanded="false" aria-controls="more-${i}">Read the case study ▾</button>
            </div>
          </article>`;
      }).join("")
    : `<p class="empty">No projects with that technology yet.</p>`;
}

const allTags = ["All", ...new Set(P.projects.flatMap((p) => p.stack))];
$("filters").innerHTML = allTags
  .map((t) => `<button type="button" class="filter" aria-pressed="${t === "All"}" data-filter="${esc(t)}">${esc(t)}</button>`)
  .join("");
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest(".filter");
  if (!b) return;
  document.querySelectorAll(".filter").forEach((f) => f.setAttribute("aria-pressed", f === b));
  renderProjects(b.dataset.filter);
});
$("projects-list").addEventListener("click", (e) => {
  const b = e.target.closest(".toggle-more");
  if (!b) return;
  const more = $(b.getAttribute("aria-controls"));
  const open = more.hidden;
  more.hidden = !open;
  b.setAttribute("aria-expanded", open);
  b.textContent = open ? "Show less ▴" : "Read the case study ▾";
});
renderProjects();

function goToProject(i) {
  document.querySelector('.filter[data-filter="All"]').click();
  const card = $(`project-${i}`);
  const btn = card.querySelector(".toggle-more");
  if (btn.getAttribute("aria-expanded") === "false") btn.click();
  card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  card.classList.add("highlight");
  setTimeout(() => card.classList.remove("highlight"), 2000);
}

// =============================================================
//  EDUCATION: skills gained + year tabs + expandable modules
// =============================================================
const E = P.education;
$("edu-head").innerHTML = `
  <div><h3>${esc(E.degree)}</h3><p>${esc(E.school)}</p></div><p>${esc(E.dates)}</p>`;

// Every skill covered by the degree
const degreeSkills = {};
E.years.forEach((y) => y.modules.forEach((m) => m.skills.forEach((s) => (degreeSkills[s] = (degreeSkills[s] || 0) + 1))));

// Show the top 12 first (key modules count double), with a button to show the rest
const keyWeight = {};
E.years.forEach((y) => y.modules.forEach((m) => m.skills.forEach((s) => (keyWeight[s] = (keyWeight[s] || 0) + (m.key ? 2 : 1)))));
const sortedSkills = Object.keys(degreeSkills).sort((a, b) => keyWeight[b] - keyWeight[a]);
function renderEduSkills(all) {
  const list = all ? sortedSkills : sortedSkills.slice(0, 12);
  $("edu-skills").innerHTML = chips(list) + (sortedSkills.length > 12
    ? `<button type="button" class="show-all" id="show-all">${all ? "Show fewer ▴" : `Show all ${sortedSkills.length} skills ▾`}</button>` : "");
  const b = $("show-all");
  if (b) b.addEventListener("click", () => renderEduSkills(!all));
}
renderEduSkills(false);

$("year-tabs").innerHTML = E.years
  .map((y, i) => `<button type="button" class="tab" role="tab" id="tab-${i}" aria-selected="${i === 0}" data-year="${i}">${esc(y.label)} <small>${esc(y.dates)}</small></button>`)
  .join("");

function showYear(i) {
  document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.year == i));
  $("year-panel").setAttribute("aria-labelledby", `tab-${i}`);
  const mods = [...E.years[i].modules].sort((a, b) => (b.key ? 1 : 0) - (a.key ? 1 : 0));
  $("year-panel").innerHTML = `<div class="modules fade-in">${mods
    .map((m) => `
      <div class="module" role="button" tabindex="0" aria-expanded="false" data-module="${esc(m.name)}">
        <div class="module-name"><span>${m.key ? '<span class="star" title="Key module">★</span> ' : ""}${esc(m.name)}</span><span class="plus">+</span></div>
        <div class="module-more"><p>${esc(m.about)}</p>${chips(m.skills)}</div>
      </div>`)
    .join("")}</div>`;
}
$("year-tabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (t) showYear(Number(t.dataset.year));
});
$("year-tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const cur = Number(document.querySelector('.tab[aria-selected="true"]').dataset.year);
  const next = (cur + (e.key === "ArrowRight" ? 1 : -1) + E.years.length) % E.years.length;
  showYear(next);
  $(`tab-${next}`).focus();
});

function toggleModule(card, force) {
  const open = force ?? card.getAttribute("aria-expanded") === "false";
  card.setAttribute("aria-expanded", open);
  card.querySelector(".plus").textContent = open ? "−" : "+";
}
$("year-panel").addEventListener("click", (e) => {
  if (e.target.closest(".chip")) return; // chips open the skill explorer instead
  const card = e.target.closest(".module");
  if (card) toggleModule(card);
});
$("year-panel").addEventListener("keydown", (e) => {
  const card = e.target.closest(".module");
  if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggleModule(card); }
});
showYear(0);

function goToModule(yearIndex, name) {
  showYear(yearIndex);
  const card = [...document.querySelectorAll(".module")].find((m) => m.dataset.module === name);
  if (!card) return;
  toggleModule(card, true);
  card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  card.focus();
}

// =============================================================
//  CONTACT
// =============================================================
const contact = [
  link(`mailto:${P.email}`, "Email me", "btn"),
  `<button type="button" class="btn btn-outline" id="copy-email">Copy email</button>`,
];
if (P.linkedin) contact.push(link(P.linkedin, "LinkedIn", "btn btn-outline"));
if (P.github) contact.push(link(P.github, "GitHub", "btn btn-outline"));
$("contact-links").innerHTML = contact.join("");
$("copy-email").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(P.email); toast("Email copied ✓"); }
  catch (_) { toast(P.email); }
});
$("year").textContent = new Date().getFullYear();

// =============================================================
//  MINI TERMINAL
// =============================================================
const out = $("term-out");
const scrollTo = (id) => $(id).scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
function print(html) { out.insertAdjacentHTML("beforeend", html + "\n"); out.scrollTop = out.scrollHeight; }

const commands = {
  help: () => print(
    "Available commands:\n" +
    "  about      who I am\n  skills     what I work with\n  projects   things I've built\n" +
    "  education  my degree\n  contact    get in touch\n  github     open my GitHub\n" +
    "  cv         download my CV\n  theme      switch light/dark\n  clear      clear the screen"),
  about: () => { print(esc(P.about[0])); scrollTo("about"); },
  skills: () => { print(P.skills.map((s) => `${esc(s.group)}: ${s.items.map(esc).join(", ")}`).join("\n")); scrollTo("skills"); },
  projects: () => { print(P.projects.map((p, i) => `[${i + 1}] ${esc(p.title)}`).join("\n")); scrollTo("projects"); },
  education: () => { print(`${esc(E.degree)}\n${esc(E.school)}, ${esc(E.dates)}`); scrollTo("education"); },
  contact: () => { print(`Email: ${esc(P.email)}`); scrollTo("contact"); },
  github: () => { print("Opening GitHub…"); window.open(P.github, "_blank", "noopener"); },
  cv: () => {
    if (P.cv) { print("Opening CV…"); window.open(P.cv, "_blank"); }
    else print('<span class="muted">CV coming soon. Type "contact" to reach me.</span>');
  },
  theme: () => { toggleTheme(); print(`Theme: ${document.documentElement.dataset.theme}`); },
  clear: () => (out.innerHTML = ""),
  sudo: () => print("Nice try 😄 You'll need to hire me first."),
};

print(`<span class="muted">Welcome! Type <span class="cmd">help</span> to explore.</span>`);
const history = [];
let hIndex = 0;
$("term-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("term-in");
  const raw = input.value.trim();
  input.value = "";
  if (!raw) return;
  history.push(raw); hIndex = history.length;
  print(`<span class="cmd">&gt; ${esc(raw)}</span>`);
  const cmd = raw.toLowerCase().split(" ")[0];
  (commands[cmd] || (() => print(`Command not found: ${esc(cmd)}. Type "help".`)))();
});
$("term-in").addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && hIndex > 0) { hIndex--; e.target.value = history[hIndex]; e.preventDefault(); }
  if (e.key === "ArrowDown") { hIndex = Math.min(hIndex + 1, history.length); e.target.value = history[hIndex] || ""; }
});

// =============================================================
//  THEME, MENU, SCROLL EFFECTS
// =============================================================
const setThemeIcon = () => ($("theme-btn").textContent = document.documentElement.dataset.theme === "light" ? "☾" : "☀");
function toggleTheme() {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (_) {}
  setThemeIcon();
}
$("theme-btn").addEventListener("click", toggleTheme);
setThemeIcon();

const menuBtn = $("menu-btn"), navLinks = $("nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && navLinks.classList.contains("open")) menuBtn.click();
});

// Fade sections in as you scroll
const revealer = new IntersectionObserver((entries) =>
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); revealer.unobserve(en.target); } }),
  { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

// Highlight the menu link for the section on screen
const navMap = {};
document.querySelectorAll(".nav-links a").forEach((a) => (navMap[a.getAttribute("href").slice(1)] = a));
const spy = new IntersectionObserver((entries) =>
  entries.forEach((en) => {
    if (en.isIntersecting && navMap[en.target.id]) {
      Object.values(navMap).forEach((a) => a.classList.remove("active"));
      navMap[en.target.id].classList.add("active");
    }
  }), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

// Progress bar + back-to-top button
const topBtn = $("top-btn");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  $("progress").style.width = pct + "%";
  topBtn.hidden = h.scrollTop < 600;
}, { passive: true });
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

// =============================================================
//  PWA: service worker + install button
// =============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => console.warn("SW failed:", err));
  });
}

let deferredPrompt = null;
const installBtn = $("install-btn");
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});
window.addEventListener("appinstalled", () => (installBtn.hidden = true));

// iPhone / iPad: Safari has no install button, so show a one-time hint
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
let hintSeen = false;
try { hintSeen = localStorage.getItem("iosHintSeen") === "1"; } catch (_) {}
if (isIOS && !isStandalone && !hintSeen) setTimeout(() => ($("ios-hint").hidden = false), 5000);
$("ios-hint-close").addEventListener("click", () => {
  $("ios-hint").hidden = true;
  try { localStorage.setItem("iosHintSeen", "1"); } catch (_) {}
});