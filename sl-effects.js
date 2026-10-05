/* ============================================================
   sl-effects.js — Solo Leveling particle & lightning system
   ============================================================ */
(function () {
  "use strict";

  const canvas = document.getElementById("sl-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Resize ───────────────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  /* ── Particles ────────────────────────────────────────────── */
  const MAX_PARTICLES = 55;
  const particles = [];

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random(),
      da: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.8 ? 200 : 190 + Math.random() * 30,
    };
  }

  for (let i = 0; i < MAX_PARTICLES; i++) particles.push(mkParticle());

  function drawParticles() {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.a) * 0.55;
      ctx.fillStyle = `hsl(${p.hue},100%,65%)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${p.hue},100%,70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.x < -5 || p.x > canvas.width + 5 || p.y < -5 || p.y > canvas.height + 5) {
        Object.assign(p, mkParticle(), { x: Math.random() * canvas.width, y: Math.random() * canvas.height });
      }
    });
  }

  /* ── Lightning bolt ───────────────────────────────────────── */
  function lightning(x1, y1, x2, y2, depth) {
    if (depth <= 0) return;
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 40 * depth;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 40 * depth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(mx, my);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (depth > 1 && Math.random() > 0.55) {
      const bx = mx + (Math.random() - 0.5) * 60;
      const by = my + (Math.random() - 0.5) * 60;
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(bx, by); ctx.stroke();
    }
    lightning(x1, y1, mx, my, depth - 1);
    lightning(mx, my, x2, y2, depth - 1);
  }

  let lastBolt = 0;
  let nextBolt = randBoltDelay();
  let boltActive = false;
  let boltTimer = 0;
  let boltX1, boltY1, boltX2, boltY2;
  const BOLT_DURATION = 120; // ms

  function randBoltDelay() { return 3000 + Math.random() * 7000; }

  function drawBolt(now) {
    if (!boltActive) {
      if (now - lastBolt > nextBolt) {
        boltActive = true;
        boltTimer = now;
        lastBolt = now;
        nextBolt = randBoltDelay();
        // Random edge origin
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { boltX1 = Math.random() * canvas.width; boltY1 = 0; }
        else if (edge === 1) { boltX1 = canvas.width; boltY1 = Math.random() * canvas.height; }
        else if (edge === 2) { boltX1 = Math.random() * canvas.width; boltY1 = canvas.height; }
        else { boltX1 = 0; boltY1 = Math.random() * canvas.height; }
        boltX2 = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
        boltY2 = canvas.height * 0.2 + Math.random() * canvas.height * 0.6;
      }
      return;
    }
    const elapsed = now - boltTimer;
    if (elapsed > BOLT_DURATION) { boltActive = false; return; }

    const progress = elapsed / BOLT_DURATION;
    const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

    ctx.save();
    ctx.globalAlpha = alpha * 0.55;
    ctx.strokeStyle = "#4df";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(0,200,255,0.8)";
    lightning(boltX1, boltY1, boltX2, boltY2, 3);
    ctx.restore();
  }

  /* ── Edge glow ────────────────────────────────────────────── */
  function drawEdgeGlow() {
    const t = Date.now() / 4000;
    const intensity = 0.04 + 0.02 * Math.sin(t);
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0,   `rgba(0,170,255,${intensity * 2})`);
    g.addColorStop(0.3, "transparent");
    g.addColorStop(0.7, "transparent");
    g.addColorStop(1,   `rgba(0,120,200,${intensity})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // side glows
    const gl = ctx.createLinearGradient(0, 0, 80, 0);
    gl.addColorStop(0, `rgba(0,150,255,${intensity})`);
    gl.addColorStop(1, "transparent");
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, 80, canvas.height);

    const gr = ctx.createLinearGradient(canvas.width, 0, canvas.width - 80, 0);
    gr.addColorStop(0, `rgba(0,130,220,${intensity * 0.7})`);
    gr.addColorStop(1, "transparent");
    ctx.fillStyle = gr;
    ctx.fillRect(canvas.width - 80, 0, 80, canvas.height);
  }

  /* ── Main loop ────────────────────────────────────────────── */
  let raf;
  function loop(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!prefersReduced.matches) {
      drawEdgeGlow();
      drawParticles();
      drawBolt(now);
    }

    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  prefersReduced.addEventListener("change", () => {
    if (prefersReduced.matches) {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      raf = requestAnimationFrame(loop);
    }
  });

  /* ── Card tilt + glow upgrade ─────────────────────────────── */
  // Inject a glow div into each card for the radial spotlight
  function upgradeCards() {
    document.querySelectorAll(".card:not([data-sl])").forEach((card) => {
      card.dataset.sl = "1";
      const glow = document.createElement("div");
      glow.className = "card-glow";
      card.appendChild(glow);
    });
  }

  // Watch for dynamically added cards (projects loaded async)
  const cardObserver = new MutationObserver(upgradeCards);
  cardObserver.observe(document.getElementById("grid") || document.body, {
    childList: true, subtree: true,
  });
  upgradeCards();

  /* ── Typing effect on hero h1 ─────────────────────────────── */
  const h1 = document.querySelector("h1");
  if (h1 && !prefersReduced.matches) {
    const original = h1.textContent.trim();
    h1.textContent = "";
    h1.style.minHeight = "1em";
    let i = 0;
    const type = () => {
      if (i <= original.length) {
        h1.textContent = original.slice(0, i);
        i++;
        setTimeout(type, i === 1 ? 600 : 28 + Math.random() * 18);
      }
    };
    // Start after loader is gone
    const startTyping = () => {
      if (!document.getElementById("loader") || document.getElementById("loader")?.classList.contains("hide")) {
        setTimeout(type, 400);
      } else {
        setTimeout(startTyping, 200);
      }
    };
    setTimeout(startTyping, 1200);
  }

  /* ── Section header decoration ────────────────────────────── */
  document.querySelectorAll("h2").forEach((el) => {
    el.insertAdjacentHTML(
      "afterend",
      `<div class="sl-divider" aria-hidden="true"></div>`
    );
  });

  // Add sl-divider styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    .sl-divider {
      width: 100%;
      height: 1px;
      margin: 10px 0 24px;
      background: linear-gradient(90deg, var(--neon), rgba(0,170,255,0.2), transparent);
      position: relative;
    }
    .sl-divider::before {
      content: "";
      position: absolute;
      left: 0; top: -3px;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--neon);
      box-shadow: 0 0 10px var(--neon), 0 0 20px rgba(0,170,255,0.5);
    }
  `;
  document.head.appendChild(style);
})();
