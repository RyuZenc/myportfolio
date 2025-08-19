const menuBtn = document.getElementById("menu-btn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  });
}

// smooth scroll nav
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupSmoothScrolling();

  // hover effect
  document.querySelectorAll(".hover-lift").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.05)";
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Load projects from JSON and render
  fetch("js/projects.json")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("projects-list");
      if (container) {
        container.innerHTML = data
          .map(
            (project) => `
          <div class="glass p-8 rounded-2xl hover-lift transition-smooth text-center">
            <i class="${project.icon}"></i>
            <h3 class="text-xl font-semibold mb-4">${project.title}</h3>
            <p class="text-gray-400 mb-6">${project.desc}</p>
            <span class="px-4 py-2 bg-orange-500 bg-opacity-20 rounded-full text-orange-300 text-sm">${project.tag}</span>
          </div>
        `
          )
          .join("");
      }
    });
});
