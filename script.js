// Smooth scroll to features section
const scrollBtn = document.querySelector(".btn-primary");
scrollBtn?.addEventListener("click", () => {
  document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
});

// Reveal elements on scroll
const revealElements = document.querySelectorAll(".feature, .about, .contact");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

revealElements.forEach((el) => {
  el.classList.add("hidden");
  observer.observe(el);
});

// Theme toggle logic
const toggle = document.getElementById("dark-toggle");
const icon = document.getElementById("theme-icon");

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  // Actualiza el ícono dinámicamente según tema
  icon.innerHTML = theme === "dark"
    ? `<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>` // luna
    : `<circle cx="12" cy="12" r="5"/>
       <path d="M12 1v2M12 21v2
                M4.22 4.22l1.42 1.42
                M18.36 18.36l1.42 1.42
                M1 12h2M21 12h2
                M4.22 19.78l1.42-1.42
                M18.36 5.64l1.42-1.42"/>`; // sol
}


// Load stored or system preference
const userPref = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = userPref || (systemPrefersDark ? "dark" : "light");
applyTheme(initialTheme);

// Toggle theme on click
toggle?.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

// Navbar shrink on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// Preloader removal
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  if (loader) setTimeout(() => loader.remove(), 1200);
});
