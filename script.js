/* =========================================================
   SANOLEN — SCRIPT
   Sections: Config/Data, Utilities, Background Canvas,
   Navbar, Cycling Text, Scroll Reveal, Product Rendering,
   Card Interactions, Magnetic Buttons + Ripple,
   Smooth Scroll, Easter Eggs
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------------------
     1. PRODUCT DATA
     Add a new object here to render a new card.
     No HTML edits required.
  ----------------------------------------------------- */
  const products = [
    {
      name: "GitGreen",
      description:
        "Push your LeetCode solutions with explanations and notes, straight to your GitHub.",
      status: "Coming Soon",
      github: "",
      website: "",
      icon: "🌱",
      comingSoon: true,
    },
    {
      name: "GitID",
      description:
        "Your developer identity, beautifully organized in one place.",
      status: "Coming Soon",
      github: "",
      website: "",
      icon: "🪪",
      comingSoon: true,
    },
  ];

  /* -----------------------------------------------------
     2. UTILITIES
  ----------------------------------------------------- */
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  /* -----------------------------------------------------
     3. BACKGROUND CANVAS — soft floating particles
     Lightweight, paused when tab hidden or reduced motion.
  ----------------------------------------------------- */
  function initBackgroundCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height, rafId;
    let running = true;

    const PARTICLE_COUNT = window.innerWidth < 700 ? 30 : 60;

    function resize() {
      width = canvas.width = window.innerWidth * devicePixelRatio;
      height = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 1.4 + 0.4) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.08 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.08 * devicePixelRatio,
        alpha: Math.random() * 0.5 + 0.15,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 255, 220, ${p.alpha})`;
        ctx.fill();
      }
      if (running) rafId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    if (!prefersReducedMotion) draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden && !prefersReducedMotion;
      if (running) draw();
      else cancelAnimationFrame(rafId);
    });
  }

  /* -----------------------------------------------------
     4. NAVBAR — blur on scroll
  ----------------------------------------------------- */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -----------------------------------------------------
     5. CYCLING TEXT — hero subline
  ----------------------------------------------------- */
  function initCyclingText() {
    const el = document.getElementById("cycling-text");
    if (!el) return;

    const phrases = [
      "Building something big...",
      "Crafting developer tools.",
      "Engineering elegant software.",
      "More products are coming.",
      "Stay tuned.",
    ];

    let index = 0;

    function setPhrase(i) {
      el.textContent = phrases[i];
      if (!prefersReducedMotion) {
        el.classList.remove("cycling-enter");
        el.classList.add("cycling-enter");
      }
    }

    setPhrase(index);

    if (prefersReducedMotion) return;

    setInterval(() => {
      el.classList.remove("cycling-enter");
      el.classList.add("cycling-exit");
      setTimeout(() => {
        index = (index + 1) % phrases.length;
        setPhrase(index);
      }, 380);
    }, 3200);
  }

  /* -----------------------------------------------------
     6. SCROLL REVEAL — generic [data-reveal] + cards
  ----------------------------------------------------- */
  function initScrollReveal() {
    const revealTargets = document.querySelectorAll("[data-reveal]");
    const cardTargets = document.querySelectorAll(".product-card");

    if (prefersReducedMotion) {
      revealTargets.forEach((el) => el.classList.add("in-view"));
      cardTargets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));

    // Staggered card entrance
    cardTargets.forEach((el, i) => {
      el.style.animationDelay = `${i * 110}ms`;
      observer.observe(el);
    });
  }

  /* -----------------------------------------------------
     7. PRODUCT RENDERING — builds cards from `products`
  ----------------------------------------------------- */
  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("role", "listitem");

    const isActive = !product.comingSoon && (product.website || product.github);
    const ctaHref = product.website || product.github || "#";
    const ctaLabel = product.comingSoon ? "Coming Soon" : "View Project";

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">${product.icon || "◆"}</div>
        <span class="card-status">${product.status}</span>
      </div>
      <h3 class="card-name">${product.name}</h3>
      <p class="card-desc">${product.description}</p>
      ${
        isActive
          ? `<a class="card-cta" data-active="true" href="${ctaHref}" target="_blank" rel="noopener noreferrer">${ctaLabel}</a>`
          : `<button class="card-cta" data-active="false" disabled aria-disabled="true">${ctaLabel}</button>`
      }
    `;

    return card;
  }

  function renderProducts() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    products.forEach((product) => {
      grid.appendChild(createProductCard(product));
    });
  }

  /* -----------------------------------------------------
     8. CARD INTERACTIONS — parallax tilt + cursor glow
  ----------------------------------------------------- */
  function initCardInteractions() {
    if (prefersReducedMotion) return;
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      card.style.setProperty("--mx", `${px}%`);
      card.style.setProperty("--my", `${py}%`);

      const rotateY = clamp(((x / rect.width) - 0.5) * 10, -6, 6);
      const rotateX = clamp((0.5 - y / rect.height) * 10, -6, 6);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    grid.addEventListener(
      "mouseleave",
      (e) => {
        const cards = grid.querySelectorAll(".product-card");
        cards.forEach((c) => (c.style.transform = ""));
      },
      true
    );

    grid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------
     9. MAGNETIC BUTTONS + RIPPLE
  ----------------------------------------------------- */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll(".magnetic");

    buttons.forEach((btn) => {
      if (!prefersReducedMotion) {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.22}px, ${y * 0.35}px)`;
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "";
        });
      }

      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* -----------------------------------------------------
     10. SMOOTH SCROLL — scroll indicator
  ----------------------------------------------------- */
  function initScrollIndicator() {
    const indicator = document.getElementById("scroll-indicator");
    const products = document.getElementById("products");
    if (!indicator || !products) return;
    indicator.addEventListener("click", () => {
      products.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* -----------------------------------------------------
     11. EASTER EGGS
  ----------------------------------------------------- */
  function initEasterEggs() {
    // Console message
    console.log(
      "%cWelcome, developer.\n\nLooks like curiosity brought you here.\n\nMore is coming.",
      "color:#34d399; font-family:monospace; font-size:13px; line-height:1.6;"
    );

    // Konami code
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let progress = 0;

    window.addEventListener("keydown", (e) => {
      progress = e.key === konami[progress] ? progress + 1 : 0;
      if (progress === konami.length) {
        progress = 0;
        triggerKonami();
      }
    });

    function triggerKonami() {
      document.body.style.transition = "filter 0.6s ease";
      document.body.style.filter = "hue-rotate(160deg)";
      console.log("%cYou found it. Respect.", "color:#22d3ee; font-size:14px;");
      setTimeout(() => {
        document.body.style.filter = "";
      }, 2200);
    }

    // Logo click glow burst
    const logo = document.getElementById("hero-logo");
    if (logo) {
      let clickCount = 0;
      logo.addEventListener("click", () => {
        clickCount++;
        logo.classList.add("glow-burst");
        setTimeout(() => logo.classList.remove("glow-burst"), 900);
        if (clickCount === 5) {
          console.log(
            "%cCurious hands find curious things. Keep going.",
            "color:#a78bfa;"
          );
        }
      });

      // Tiny particle burst on hover (throttled)
      let lastBurst = 0;
      logo.addEventListener("mouseenter", () => {
        const now = Date.now();
        if (now - lastBurst < 1200 || prefersReducedMotion) return;
        lastBurst = now;
        spawnParticleBurst(logo);
      });
    }
  }

  function spawnParticleBurst(target) {
    const rect = target.getBoundingClientRect();
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
      const dot = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 10;
      const dist = 40 + Math.random() * 30;
      dot.style.position = "absolute";
      dot.style.left = `${originX}px`;
      dot.style.top = `${originY}px`;
      dot.style.width = "4px";
      dot.style.height = "4px";
      dot.style.borderRadius = "50%";
      dot.style.background = i % 2 === 0 ? "#34d399" : "#22d3ee";
      dot.style.opacity = "1";
      dot.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease";
      container.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.transform = `translate(${Math.cos(angle) * dist}px, ${
          Math.sin(angle) * dist
        }px)`;
        dot.style.opacity = "0";
      });
    }

    setTimeout(() => container.remove(), 750);
  }

  /* -----------------------------------------------------
     INIT
  ----------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    initBackgroundCanvas();
    initNavbar();
    initCyclingText();
    initScrollReveal();
    initCardInteractions();
    initMagneticButtons();
    initScrollIndicator();
    initEasterEggs();
  });
})();