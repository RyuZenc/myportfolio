import { createTimeline, scrambleText, stagger } from "animejs";

const reduceMotion = matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const overlay = document.getElementById("scramble-overlay");
const stage = overlay?.querySelector(".scramble-stage");

const initialStageHTML = stage?.innerHTML ?? "";

let closing = false;
let tl = null;

function finish() {
  if (!overlay || overlay.hidden || closing) return;
  closing = true;
  overlay.classList.add("closing");
  setTimeout(() => {
    overlay.hidden = true;
    overlay.classList.remove("closing");
    document.body.classList.remove("no-scroll");
    tl?.cancel();
    tl = null;
    closing = false;
  }, 480);
}

function showStatic() {
  const slides = [...stage.children];
  slides.forEach((slide, index) => {
    if (index !== 0) slide.style.display = "none";
  });
  slides[0].style.opacity = "1";
  slides[0]
    .querySelectorAll("p:not(.center)")
    .forEach((p) => (p.style.display = "none"));
  slides[0].querySelector("p.center").textContent = "Dhimas Admaja";
}

function buildTimeline() {
  const timeline = createTimeline({ loop: false, onComplete: finish });

  timeline.add(".scramble-stage .slide:nth-child(1)", {
    opacity: { to: 1, duration: 250, ease: "linear" },
    scale: [{ from: 0.75, to: 1, duration: 1500, ease: "inOut(3.5)" }],
    ease: "inOut(3)",
  });
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p.center",
    {
      scale: { from: 3 },
      color: { from: "var(--yellow-1)", to: "var(--orange-1)" },
      innerHTML: scrambleText({
        override: " ",
        ease: "inQuad",
        duration: 500,
        from: "center",
        cursor: "░▒▓█",
      }),
    },
    "<<",
  );
  timeline.add(
    ".scramble-overlay",
    {
      background: "var(--red-5)",
    },
    "<<+=50",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p:not(.center)",
    {
      scale: { from: 0.75 },
      color: { to: "var(--red-1)" },
      innerHTML: scrambleText({
        override: " ",
        from: "center",
        duration: 500,
        revealDelay: 250,
        cursor: "░▒▓",
        perturbation: 0.25,
      }),
    },
    stagger([250, 750], {
      grid: true,
      from: "center",
      ease: "out(3)",
      start: "<<",
    }),
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p:not(.center)",
    {
      innerHTML: scrambleText({
        text: "",
        override: false,
        from: "center",
        ease: "outQuad",
        reversed: true,
        duration: 800,
        cursor: "░▒▓",
      }),
    },
    "<+=150",
  );
  timeline.add(
    ".scramble-overlay",
    {
      background: "var(--black-1)",
    },
    "<-=600",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p.center",
    {
      scale: 1.5,
      color: { to: "var(--lime-1)" },
      ease: "inOutExpo",
      duration: 1500,
      innerHTML: scrambleText({
        text: "Dhimas Admaja",
        ease: "inQuad",
        override: false,
        from: "center",
        duration: 1000,
        perturbation: 0.25,
      }),
    },
    "<<",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p.center",
    {
      scale: 1,
      color: "var(--white-1)",
      ease: "inOutExpo",
      duration: 1150,
      innerHTML: scrambleText({
        override: false,
        text: "Mari bikin sesuatu yang keren.",
        from: "right",
        duration: 950,
        settleDuration: 500,
        ease: "inOut",
      }),
    },
    "<+=250",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(1) p.center",
    {
      innerHTML: scrambleText({
        text: "",
        override: false,
        from: "random",
        reversed: true,
        duration: 850,
        perturbation: 0.5,
      }),
    },
    "<+=500",
  );
  timeline.set(
    ".scramble-stage .slide:nth-child(2)",
    {
      opacity: 1,
    },
    "<<",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(2) p",
    {
      innerHTML: scrambleText({
        override: " ",
        from: "center",
        duration: 500,
        revealDelay: 250,
        cursor: "░▒▓",
        perturbation: 0.5,
      }),
    },
    stagger([0, 1000], {
      grid: true,
      from: "center",
      ease: "out(3)",
      start: "<<+=250",
      reversed: true,
    }),
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(2) p",
    {
      scale: [0.8, 1],
    },
    stagger([0, 150], {
      grid: true,
      from: "center",
      ease: "out(3)",
      start: "<<",
      reversed: true,
    }),
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(2) p",
    {
      innerHTML: scrambleText({
        text: "&nbsp;",
        override: false,
        from: "center",
        reversed: true,
        duration: 500,
        cursor: "░▒▓",
      }),
    },
    stagger([0, 750], {
      grid: true,
      from: "center",
      ease: "out(3)",
      start: "<+=500",
    }),
  );
  timeline.set(
    ".scramble-stage .slide:nth-child(3)",
    {
      opacity: 1,
    },
    "<<",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(3) p",
    {
      color: "var(--white-1)",
      scale: 1.5,
      ease: "inOutExpo",
      innerHTML: scrambleText({
        override: " ",
        from: "center",
        settleDuration: 500,
        revealRate: 33,
        perturbation: 0.2,
      }),
    },
    "-=250",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(3) p",
    {
      color: { to: "var(--orange-1)", duration: 750 },
      ease: "inOutExpo",
      duration: 1250,
      innerHTML: scrambleText({
        text: "bs.dhimas@gmail.com",
        override: false,
        from: "right",
        cursor: "░▒▓",
        duration: 750,
        ease: "inOut",
      }),
    },
    "<+=750",
  );
  timeline.add(
    ".scramble-stage .slide:nth-child(3) p",
    {
      color: "var(--yellow-1)",
      scale: 2,
      ease: "inOutExpo",
      duration: 750,
      innerHTML: scrambleText({
        text: " ",
        chars: "#!%░▒▓_01",
        override: false,
        duration: 750,
        ease: "out(2)",
        from: "right",
      }),
    },
    "<+=1000",
  );
  timeline.add(
    ".scramble-overlay",
    {
      background: "var(--orange-5)",
      duration: 750,
    },
    "<<",
  );
  timeline.init();

  return timeline;
}

export function openScrambleOverlay() {
  if (!overlay || !overlay.hidden) return false;
  closing = false;
  overlay.hidden = false;
  overlay.style.background = "";
  stage.innerHTML = initialStageHTML;
  document.body.classList.add("no-scroll");

  if (reduceMotion) {
    showStatic();
    setTimeout(finish, 4000);
    return true;
  }

  tl = buildTimeline();
  return true;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay && !overlay.hidden) finish();
});
