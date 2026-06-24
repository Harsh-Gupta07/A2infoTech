document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const themeToggle = document.querySelector(".theme-pill");
  const loader = document.getElementById("site-loader");

  if (loader) {
    const finishLoader = () => document.documentElement.classList.add("loader-complete");
    window.addEventListener("load", () => window.setTimeout(finishLoader, 2300), { once: true });
    window.setTimeout(finishLoader, 4200);
  }

  const storedTheme = localStorage.getItem("a2-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;
  themeToggle?.setAttribute("aria-pressed", String(initialTheme === "dark"));

  const updateHeader = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("a2-theme", nextTheme);
    themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-directions-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.getAttribute("data-destination");
      if (!destination || !navigator.geolocation) return;

      event.preventDefault();
      const originalText = link.textContent;
      link.textContent = "Finding your location...";
      link.classList.add("is-loading");

      const openFallback = () => {
        link.textContent = originalText;
        link.classList.remove("is-loading");
        window.open(link.href, "_blank", "noopener");
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = `${position.coords.latitude},${position.coords.longitude}`;
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
          link.textContent = originalText;
          link.classList.remove("is-loading");
          window.open(mapsUrl, "_blank", "noopener");
        },
        openFallback,
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    });
  });
});
