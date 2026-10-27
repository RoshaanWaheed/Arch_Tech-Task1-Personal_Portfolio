const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---- Theme (saved in localStorage; falls back to the system preference) ----
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  const sys = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  root.dataset.theme = saved || sys;
} catch { /* storage blocked: keep default */ }
$("#theme").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

// ---- Mobile menu ----
const menu = $("#menu"), burger = $("#burger");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("open"); burger.setAttribute("aria-expanded", false);
}));

// ---- Typing effect ----
const roles = ["full stack developer", "front-end engineer", "future AppSec engineer", "lifelong learner"];
const typed = $("#typed");
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 80);
}
if (matchMedia("(prefers-reduced-motion: reduce)").matches) typed.textContent = roles[0];
else type();

// ---- Scroll progress bar ----
const bar = $("#progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

// ---- Highlight nav link of the section in view ----
const links = $$("#menu a");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting)
      links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });

// ---- Count-up stats ----
$$("[data-count]").forEach((el) => {
  const end = +el.dataset.count; let n = 0;
  const step = () => { el.textContent = ++n; if (n < end) setTimeout(step, 250); };
  setTimeout(step, 400);
});

// ---- Project filter ----
$$(".chip").forEach((chip) => chip.addEventListener("click", () => {
  $$(".chip").forEach((c) => c.classList.toggle("on", c === chip));
  $$(".card").forEach((card) => {
    card.hidden = chip.dataset.f !== "all" && card.dataset.c !== chip.dataset.f;
  });
}));

// ---- Contact form: validate, then open the visitor's email app ----
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, err = $("#err");
  const name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim();
  if (!name || !msg) { err.textContent = "Please enter your name and a message."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; return; }
  err.textContent = "";
  const body = encodeURIComponent(msg + "\n\nFrom: " + name + " (" + email + ")");
  location.href = "mailto:YOUR_EMAIL@example.com?subject=" + encodeURIComponent("Portfolio message from " + name) + "&body=" + body;
});

$("#year").textContent = new Date().getFullYear();