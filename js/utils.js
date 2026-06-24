// ── utils.js
// Reusable utility functions — imported before animations.js and main.js

/**
 * Magnetic button effect
 * @param {string} selector - CSS selector for the button
 * @param {number} strength - How strong the pull is (0.1 - 0.4)
 */
function initMagneticButton(selector, strength = 0.25) {
  const el = document.querySelector(selector);
  if (!el) return;

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  });
}

/**
 * Animated counter — counts from 0 to target value
 * @param {HTMLElement} el  - Element whose textContent gets updated
 * @param {number} target   - Final number
 * @param {string} suffix   - e.g. "+" or "%"
 * @param {number} duration - seconds
 */
function animateCounter(el, target, suffix = "", duration = 2.5) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: "power2.out",
    onUpdate() {
      el.textContent = Math.round(obj.val) + suffix;
    },
  });
}

/**
 * Infinite horizontal marquee using GSAP
 * @param {string} trackSelector - selector for the inner track (duplicated items)
 * @param {number} speed         - pixels per second (higher = faster)
 * @param {string} direction     - "left" | "right"
 */
function initMarquee(trackSelector, speed = 60, direction = "left") {
  const track = document.querySelector(trackSelector);
  if (!track) return;

  // Clone the children so the loop is seamless
  const clone = track.innerHTML;
  track.innerHTML += clone;

  const totalWidth = track.scrollWidth / 2;
  const duration = totalWidth / speed;
  const xTarget = direction === "left" ? -totalWidth : totalWidth;

  gsap.to(track, {
    x: xTarget,
    duration,
    ease: "none",
    repeat: -1,
  });

  // Pause on hover
  track.addEventListener("mouseenter", () => gsap.globalTimeline.pause());
  track.addEventListener("mouseleave", () => gsap.globalTimeline.resume());
}

/**
 * Infinite horizontal marquee using GSAP
 * @param {string} trackSelector - selector for the inner track
 * @param {number} speed         - pixels per second (higher = faster)
 * @param {string} direction     - "left" | "right"
 */
function initMarquee(trackSelector, speed = 60, direction = "left") {
  const track = document.querySelector(trackSelector);
  if (!track) return;

  // Duplicate children once so the loop is seamless
  track.innerHTML += track.innerHTML;

  const loopWidth = track.scrollWidth / 2;
  const duration = loopWidth / speed;

  // Build the tween. We animate from 0 to -loopWidth (or +) then reset.
  const startX = direction === "left" ? 0 : -loopWidth;
  const endX = direction === "left" ? -loopWidth : 0;

  gsap.set(track, { x: startX });

  const tween = gsap.to(track, {
    x: endX,
    duration,
    ease: "none",
    repeat: -1,
  });

  // Pause ONLY this marquee on hover — not the global timeline
  track.addEventListener("mouseenter", () => tween.pause());
  track.addEventListener("mouseleave", () => tween.resume());

  return tween;
}
