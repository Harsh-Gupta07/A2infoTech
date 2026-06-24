document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("animations-ready");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  const marqueeTrack = document.getElementById("marquee-track");
  const popCards = document.querySelectorAll(
    [
      ".pop-card",
      ".home-stat-card",
      ".home-service-card",
      ".tech-card",
      ".why-float",
      ".mini-stats article",
      ".process-card",
      ".process-benefits article",
      ".project-card",
      ".about-service-card",
      ".stat-card",
      ".card",
    ].join(", "),
  );
  const techCards = document.querySelectorAll(".tech-card");
  const statNumbers = document.querySelectorAll(".home-stat-card strong");

  function countStat(el) {
    if (!el || el.dataset.counted === "true") return;
    el.dataset.counted = "true";
    const original = el.textContent.trim();
    const target = parseFloat(original.replace(/[^0-9.]/g, ""));
    const suffix = original.replace(/[0-9.]/g, "");
    if (!Number.isFinite(target)) return;

    if (window.gsap) {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${Math.round(counter.value)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = original;
        },
      });
      return;
    }

    const startedAt = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = original;
    };
    requestAnimationFrame(tick);
  }

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    statNumbers.forEach((number) => countStat(number));
    return;
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".reveal", {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
      },
      duration: 0.01,
      onComplete: () => {
        document.querySelectorAll(".hero .reveal, .page-hero .reveal").forEach((item, index) => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.78,
            delay: index * 0.08,
            ease: "power3.out",
            onStart: () => item.classList.add("is-visible"),
          });
        });
      },
    });

    revealItems.forEach((item) => {
      if (item.closest(".hero") || item.closest(".page-hero")) return;
      ScrollTrigger.create({
        trigger: item,
        start: "top 88%",
        once: true,
        onEnter: () => {
          item.classList.add("is-visible");
          if (item.matches(".about-stats, .about-service-grid, .tech-card-grid, .process-card-row, .portfolio-scroll")) {
            gsap.from(item.children, {
              y: 34,
              opacity: 0,
              scale: 0.94,
              stagger: 0.07,
              duration: 0.6,
              ease: "back.out(1.45)",
            });
          }
        },
      });
    });

    if (marqueeTrack) {
      marqueeTrack.innerHTML += marqueeTrack.innerHTML;
      const distance = marqueeTrack.scrollWidth / 2;
      const tween = gsap.to(marqueeTrack, {
        x: -distance,
        duration: Math.max(distance / 58, 18),
        ease: "none",
        repeat: -1,
      });
      marqueeTrack.addEventListener("mouseenter", () => tween.pause());
      marqueeTrack.addEventListener("mouseleave", () => tween.resume());
    }

    const primaryButton = document.getElementById("btn-primary");
    if (primaryButton) {
      primaryButton.addEventListener("mousemove", (event) => {
        const rect = primaryButton.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(primaryButton, { x: x * 0.16, y: y * 0.16, duration: 0.25, ease: "power2.out" });
      });
      primaryButton.addEventListener("mouseleave", () => {
        gsap.to(primaryButton, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      });
    }

    if (statNumbers.length) {
      ScrollTrigger.create({
        trigger: ".home-stats",
        start: "top 82%",
        once: true,
        onEnter: () => statNumbers.forEach((number) => countStat(number)),
      });
    }

    popCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -6,
          scale: 1.01,
          duration: 0.28,
          ease: "power3.out",
          overwrite: true,
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      });
    });

    techCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        techCards.forEach((item) => item.classList.remove("is-hot"));
        card.classList.add("is-hot");
      });
      card.addEventListener("mouseleave", () => card.classList.remove("is-hot"));
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    if (statNumbers.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            statNumbers.forEach((number) => countStat(number));
            observer.disconnect();
          });
        },
        { threshold: 0.35 },
      );
      const statsSection = document.querySelector(".home-stats");
      if (statsSection) observer.observe(statsSection);
      else statNumbers.forEach((number) => countStat(number));
    }
  }
});
