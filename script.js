// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave desde el botón
  const scrollBtn = document.querySelector(".btn-primary");
  scrollBtn.addEventListener("click", () => {
    document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
  });

  // Animaciones al hacer scroll
  const revealElements = document.querySelectorAll(".feature, .about, .contact");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
  });

  // Botón de modo oscuro
  const darkToggle = document.createElement("button");
  darkToggle.textContent = "🌓";
  darkToggle.style.position = "fixed";
  darkToggle.style.bottom = "20px";
  darkToggle.style.right = "20px";
  darkToggle.style.padding = "0.5rem 1rem";
  darkToggle.style.border = "none";
  darkToggle.style.borderRadius = "8px";
  darkToggle.style.cursor = "pointer";
  darkToggle.style.zIndex = "1001";
  darkToggle.style.backgroundColor = "#eee";
  document.body.appendChild(darkToggle);

  // Detectar modo del sistema o preferencia guardada
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark");
  } else if (storedTheme === "light") {
    document.body.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.body.classList.add("dark");
    }
  }

  // Guardar el estado al hacer clic
  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// Navbar shrink al hacer scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Eliminar preloader tras la carga
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  if (loader) {
    setTimeout(() => loader.remove(), 1200);
  }
});
