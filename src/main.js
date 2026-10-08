import { animate, scrambleText, stagger, utils } from "animejs";
import { openScrambleOverlay } from "./scramble-overlay.js";
import "./style.css";

const reduceMotion = matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- menu ---------- */

const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- salam kenal sound ---------- */

const stickerBtn = document.querySelector(".sticker-btn");

if (stickerBtn) {
  const hello = new Audio("sounds/salam-kenal/obi-wan-hello-there.mp3");
  const labels = [
    [3, "Hello!"],
    [6, "Hello?!"],
    [Infinity, "Halo?!"],
  ];
  let presses = 0;
  const needed = 10; // 10 tekan

  stickerBtn.addEventListener("click", () => {
    hello.currentTime = 0;
    hello.play().catch(() => {});

    presses += 1;
    stickerBtn.textContent = labels.find(([limit]) => presses < limit)[1];

    if (presses >= needed) {
      presses = 0;
      stickerBtn.textContent = "Hello!";
      openScrambleOverlay();
    }
  });
}

/* ---------- smooth scroll ---------- */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ---------- scroll progress ---------- */

const progressBar = document.querySelector(".scroll-progress");

if (progressBar) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? doc.scrollTop / max : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();
}

/* ---------- marquee glitch ---------- */

const marquee = document.querySelector(".marquee");
const GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#%&$@01";
const marqueeSpans = marquee ? [...marquee.querySelectorAll("span")] : [];

function freezeMarqueeWidths() {
  marqueeSpans.forEach((span) => {
    if (!span.classList.contains("glitching")) span.style.width = "";
  });
  requestAnimationFrame(() => {
    marqueeSpans.forEach((span) => {
      if (!span.classList.contains("glitching")) {
        span.style.width = `${span.offsetWidth}px`;
      }
    });
  });
}

(document.fonts?.ready ?? Promise.resolve()).then(freezeMarqueeWidths);

let marqueeResizeTimer;
addEventListener("resize", () => {
  clearTimeout(marqueeResizeTimer);
  marqueeResizeTimer = setTimeout(freezeMarqueeWidths, 150);
});

function glitchSpan(span) {
  if (!span || span.classList.contains("glitching")) return;
  if (!span.dataset.text) span.dataset.text = span.textContent;

  span.classList.add("glitching");
  animate(span, {
    innerHTML: scrambleText({
      text: span.dataset.text,
      chars: GLITCH_CHARS,
      from: "random",
      perturbation: 1,
      duration: 450,
      ease: "out(2)",
    }),
  });
  setTimeout(() => span.classList.remove("glitching"), 520);
}

function scheduleMarqueeGlitch() {
  const delay = 6000 + Math.random() * 9000;
  setTimeout(() => {
    glitchSpan(marqueeSpans[Math.floor(Math.random() * marqueeSpans.length)]);

    if (Math.random() < 0.2) {
      glitchSpan(marqueeSpans[Math.floor(Math.random() * marqueeSpans.length)]);
    }

    if (Math.random() < 0.15) {
      marquee.classList.add("glitching");
      setTimeout(() => marquee.classList.remove("glitching"), 150);
    }

    scheduleMarqueeGlitch();
  }, delay);
}

if (marquee && !reduceMotion) scheduleMarqueeGlitch();

/* ---------- hero intro ---------- */

function splitLetters(root) {
  [...root.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (!text) return;
      const word = document.createElement("span");
      word.className = "word";
      [...text].forEach((ch) => {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = ch === " " ? "\u00A0" : ch;
        word.appendChild(letter);
      });
      root.replaceChild(word, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      splitLetters(child);
    }
  });
}

async function intro() {
  if (reduceMotion) return;

  const h1 = document.querySelector("#home h1");
  splitLetters(h1);

  utils.set(".letter", { opacity: 0, y: 90 });
  utils.set("#home .lead", { opacity: 0, y: 24 });
  utils.set("#home .actions", { opacity: 0, y: 24 });
  utils.set(".photo", { opacity: 0, scale: 1.35, rotate: 10 });
  utils.set(".sticker", { opacity: 0, scale: 0, rotate: 30 });

  await Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 2000)),
  ]);

  animate(".letter", {
    opacity: [0, 1],
    y: [90, 0],
    duration: 950,
    delay: stagger(38),
    ease: "outExpo",
  });
  animate("#home .lead", {
    opacity: [0, 1],
    y: [24, 0],
    duration: 700,
    delay: 560,
    ease: "outExpo",
  });
  animate("#home .actions", {
    opacity: [0, 1],
    y: [24, 0],
    duration: 700,
    delay: 680,
    ease: "outExpo",
  });
  animate(".photo", {
    opacity: [0, 1],
    scale: [1.35, 1],
    rotate: [10, 1.5],
    duration: 900,
    delay: 240,
    ease: "outBack",
  });
  animate(".sticker", {
    opacity: [0, 1],
    scale: [0, 1],
    rotate: [30, -10],
    duration: 850,
    delay: 1080,
    ease: "outElastic",
  });
}

/* ---------- scroll reveals ---------- */

function setupReveals() {
  if (reduceMotion) return;

  const singles = [...document.querySelectorAll("[data-reveal]")];
  const staggers = [
    ...document.querySelectorAll("[data-reveal-stagger]"),
  ];

  singles.forEach((el) => utils.set(el, { opacity: 0, y: 30 }));
  staggers.forEach((el) =>
    utils.set([...el.children], { opacity: 0, y: 30 })
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const targets = el.hasAttribute("data-reveal-stagger")
          ? [...el.children]
          : [el];
        animate(targets, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 750,
          delay: stagger(110),
          ease: "outExpo",
        });
      });
    },
    { threshold: 0.2 }
  );

  singles.forEach((el) => io.observe(el));
  staggers.forEach((el) => io.observe(el));
}

/* ---------- projects ---------- */

async function loadProjects() {
  const container = document.getElementById("projects-list");
  if (!container) return;

  try {
    const [projectsRes, tagColorsRes] = await Promise.all([
      fetch("json/myprojects.json"),
      fetch("json/colortags.json"),
    ]);
    if (!projectsRes.ok || !tagColorsRes.ok) {
      throw new Error("Failed to fetch project data");
    }

    const [projects, tagColors] = await Promise.all([
      projectsRes.json(),
      tagColorsRes.json(),
    ]);

    const perPage = 3;
    let page = 0;
    let busy = false;
    let revealed = false;
    const totalPages = Math.ceil(projects.length / perPage);
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    function cardsIn() {
      const cards = container.querySelectorAll(".card");
      if (!cards.length || reduceMotion) return;
      animate(cards, {
        opacity: [0, 1],
        y: [26, 0],
        duration: 700,
        delay: stagger(90),
        ease: "outExpo",
      });
    }

    function render() {
      container.innerHTML = projects
        .slice(page * perPage, page * perPage + perPage)
        .map((p) => {
          const color = tagColors[p.tag] || "#D8D4C8";
          const external = p.link.startsWith("http");
          return `
            <article class="card">
              <div class="card-icon"><i class="${p.icon}" aria-hidden="true"></i></div>
              <h3>
                <a href="${p.link}"${
                  external
                    ? ' target="_blank" rel="noopener noreferrer"'
                    : ""
                }>${p.title}</a>
              </h3>
              <p>${p.desc}</p>
              <span class="tag" style="--tag: ${color}">${p.tag}</span>
            </article>
          `;
        })
        .join("");

      if (prevBtn && nextBtn) {
        prevBtn.disabled = page === 0;
        nextBtn.disabled = page === totalPages - 1;
      }

      if (revealed) cardsIn();
      else if (!reduceMotion) utils.set(container.querySelectorAll(".card"), { opacity: 0 });
    }

    async function goTo(nextPage) {
      if (busy || nextPage < 0 || nextPage >= totalPages) return;
      busy = true;
      page = nextPage;

      if (!reduceMotion && container.children.length) {
        await animate([...container.children], {
          opacity: 0,
          y: -18,
          duration: 240,
          delay: stagger(40),
          ease: "inQuad",
        });
      }
      render();
      busy = false;
    }

    if (projects.length > perPage && prevBtn && nextBtn) {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
      prevBtn.addEventListener("click", () => goTo(page - 1));
      nextBtn.addEventListener("click", () => goTo(page + 1));
    }

    const projectsIO = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          revealed = true;
          projectsIO.disconnect();
          cardsIn();
        }
      },
      { threshold: 0.15 }
    );
    projectsIO.observe(document.getElementById("projects"));

    render();
  } catch (error) {
    console.error("Error loading projects:", error);
    container.innerHTML =
      '<p class="load-error">Project gagal dimuat. Coba muat ulang halaman.</p>';
  }
}

async function loadCertificates() {
  const container = document.getElementById("certificates-list");
  if (!container) return;

  try {
    const res = await fetch("json/certificates.json");
    if (!res.ok) throw new Error("Failed to fetch certificate data");
    const certs = await res.json();

    const perPage = 5;
    let page = 0;
    let busy = false;
    let revealed = false;
    const totalPages = Math.ceil(certs.length / perPage);
    const prevBtn = document.getElementById("cert-prev-btn");
    const nextBtn = document.getElementById("cert-next-btn");

    function rowsIn() {
      const rows = container.querySelectorAll("tbody tr");
      if (!rows.length || reduceMotion) return;
      animate(rows, {
        opacity: [0, 1],
        y: [18, 0],
        duration: 650,
        delay: stagger(70),
        ease: "outExpo",
      });
    }

    function render() {
      const rows = certs
        .slice(page * perPage, page * perPage + perPage)
        .map((c) => {
          const external = c.link && c.link.startsWith("http");
          const title = c.link
            ? `<a href="${c.link}"${
                external ? ' target="_blank" rel="noopener noreferrer"' : ""
              }>${c.title}</a>`
            : `<strong>${c.title}</strong>`;
          return `
            <tr>
              <td data-label="Sertifikat">${title}</td>
              <td data-label="Penerbit">${c.issuer}</td>
              <td data-label="Tahun" class="cert-year">${c.year}</td>
            </tr>
          `;
        })
        .join("");

      container.innerHTML = `
        <table class="cert-table">
          <thead>
            <tr>
              <th>Sertifikat</th>
              <th>Penerbit</th>
              <th>Tahun</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;

      if (prevBtn && nextBtn) {
        prevBtn.disabled = page === 0;
        nextBtn.disabled = page === totalPages - 1;
      }

      if (revealed) rowsIn();
      else if (!reduceMotion)
        utils.set(container.querySelectorAll("tbody tr"), {
          opacity: 0,
        });
    }

    async function goTo(nextPage) {
      if (busy || nextPage < 0 || nextPage >= totalPages) return;
      busy = true;
      page = nextPage;

      const current = [...container.querySelectorAll("tbody tr")];
      if (!reduceMotion && current.length) {
        await animate(current, {
          opacity: 0,
          y: -14,
          duration: 240,
          delay: stagger(40),
          ease: "inQuad",
        });
      }
      render();
      busy = false;
    }

    if (certs.length > perPage && prevBtn && nextBtn) {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
      prevBtn.addEventListener("click", () => goTo(page - 1));
      nextBtn.addEventListener("click", () => goTo(page + 1));
    }

    const certsIO = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          revealed = true;
          certsIO.disconnect();
          rowsIn();
        }
      },
      { threshold: 0.15 }
    );
    certsIO.observe(document.getElementById("certificates"));

    render();
  } catch (error) {
    console.error("Error loading certificates:", error);
    container.innerHTML =
      '<p class="load-error">Sertifikat gagal dimuat. Coba muat ulang halaman.</p>';
  }
}

intro();
setupReveals();
loadProjects();
loadCertificates();
