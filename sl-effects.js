/* ============================================================
   sl-effects.js — Solo Leveling HD System Engine
   Web Audio API SFX · Shadow Monarch Canvas · XP Bar · System Modal
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================================
     1. WEB AUDIO API — SOLO LEVELING SYSTEM SOUND ENGINE (HD)
     ============================================================ */
  let audioCtx = null;
  let isMuted = false;
  try {
    isMuted = localStorage.getItem("sl_sfx_muted") === "1";
  } catch (e) {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Pre-unlock on any user interaction
  const unlockEvents = ["click", "keydown", "touchstart", "pointerdown"];
  const unlockAudio = () => {
    getAudioContext();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, unlockAudio));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, unlockAudio, { passive: true }));

  const SOUNDS = {
    // Campanada cristalina del Sistema (idéntica a Solo Leveling)
    alert: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Nota principal: campana dual armónica (E6 + A6)
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();

      o1.type = "sine";
      o1.frequency.setValueAtTime(1318.5, now); // E6
      o2.type = "sine";
      o2.frequency.setValueAtTime(1760.0, now); // A6

      g.gain.setValueAtTime(0.28, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      o1.connect(g);
      o2.connect(g);
      g.connect(ctx.destination);

      o1.start(now);
      o2.start(now);
      o1.stop(now + 0.85);
      o2.stop(now + 0.85);

      // Segundo pulso de brillo cristalino a los 90ms (E7)
      const o3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      o3.type = "sine";
      o3.frequency.setValueAtTime(2637.0, now + 0.09); // E7
      g3.gain.setValueAtTime(0.18, now + 0.09);
      g3.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      o3.connect(g3);
      g3.connect(ctx.destination);
      o3.start(now + 0.09);
      o3.stop(now + 0.7);
    },

    // Click holográfico de UI futurista
    click: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    },

    // Micro-tick ultrasuave al pasar el cursor (hover)
    hover: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.018);
    },

    // Notificación de recompensa / link copiado
    reward: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Nota 1: C6 (1046.5Hz)
      const o1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      o1.type = "sine";
      o1.frequency.setValueAtTime(1046.5, now);
      g1.gain.setValueAtTime(0.24, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      o1.connect(g1);
      g1.connect(ctx.destination);
      o1.start(now);
      o1.stop(now + 0.22);

      // Nota 2: G6 (1567.98Hz)
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(1567.98, now + 0.1);
      g2.gain.setValueAtTime(0.28, now + 0.1);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      o2.connect(g2);
      g2.connect(ctx.destination);
      o2.start(now + 0.1);
      o2.stop(now + 0.65);
    },

    // Ascenso de Nivel / Arise
    levelup: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sub-bass impact
      const sub = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(80, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.4);
      subG.gain.setValueAtTime(0.35, now);
      subG.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      sub.connect(subG);
      subG.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.5);

      // Arpegio ascendente de maná: C5 -> E5 -> G5 -> C6
      const notas = [523.25, 659.25, 783.99, 1046.5];
      notas.forEach((freq, idx) => {
        const start = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.45);
      });
    },

    // Despliegue de ventana del sistema
    whoosh: () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    },
  };

  const SL_AUDIO = {
    play: (name) => {
      if (isMuted || prefersReduced.matches) return;
      try {
        if (SOUNDS[name]) SOUNDS[name]();
      } catch (err) {
        console.warn("[SL_AUDIO] Error reproduciendo SFX", err);
      }
    },
    toggle: () => {
      isMuted = !isMuted;
      try {
        localStorage.setItem("sl_sfx_muted", isMuted ? "1" : "0");
      } catch (e) {}
      updateSfxUI();
      if (!isMuted) SL_AUDIO.play("alert");
      return !isMuted;
    },
    isMuted: () => isMuted,
  };
  window.SL_AUDIO = SL_AUDIO;

  function updateSfxUI() {
    const btn = document.getElementById("sfx-toggle");
    if (!btn) return;
    const icon = btn.querySelector(".sfx-icon");
    const label = btn.querySelector(".sfx-label");
    if (isMuted) {
      if (icon) icon.textContent = "🔇";
      if (label) label.textContent = "SFX: OFF";
      btn.classList.add("muted");
      btn.setAttribute("aria-pressed", "false");
    } else {
      if (icon) icon.textContent = "🔊";
      if (label) label.textContent = "SFX: ON";
      btn.classList.remove("muted");
      btn.setAttribute("aria-pressed", "true");
    }
  }

  // Vincular botón de SFX
  const sfxBtn = document.getElementById("sfx-toggle");
  if (sfxBtn) {
    updateSfxUI();
    sfxBtn.addEventListener("click", () => {
      SL_AUDIO.toggle();
    });
  }

  // Delegación de sonidos de hover y click para elementos interactivos
  let lastHover = 0;
  document.addEventListener(
    "mouseenter",
    (e) => {
      const target = e.target.closest("a, button, .card, .filters button, .menu-btn");
      if (target && Date.now() - lastHover > 80) {
        lastHover = Date.now();
        SL_AUDIO.play("hover");
      }
    },
    true,
  );

  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button, .filters button, .menu-btn");
    if (target && !target.classList.contains("btn-copy")) {
      SL_AUDIO.play("click");
    }
  });

  /* ============================================================
     2. CANVAS HD — MONARCA DE LAS SOMBRAS: NIEBLA + RAYOS + ONDAS
     ============================================================ */
  const canvas = document.getElementById("sl-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  if (canvas) {
    resize();
    window.addEventListener("resize", resize, { passive: true });
  }

  /* Partículas de maná cian */
  const MAX_P = 65;
  const particles = [];
  function mkP() {
    return {
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.26,
      a: Math.random(),
      da: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.75 ? 195 : 220 + Math.random() * 40,
    };
  }
  if (canvas) for (let i = 0; i < MAX_P; i++) particles.push(mkP());

  /* Zarcillos de sombra oscura y maná del Monarca (Shadow Wisps) */
  const MAX_WISPS = 14;
  const wisps = [];
  function mkWisp() {
    return {
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: (canvas?.height || window.innerHeight) + Math.random() * 40,
      r: Math.random() * 80 + 40,
      vy: -(Math.random() * 0.45 + 0.2),
      vx: (Math.random() - 0.5) * 0.25,
      a: 0,
      maxA: Math.random() * 0.12 + 0.04,
      growing: true,
      hue: Math.random() < 0.6 ? 210 : 270, // Azul o Púrpura de sombras
    };
  }
  if (canvas) for (let i = 0; i < MAX_WISPS; i++) wisps.push(mkWisp());

  /* Ondas de choque de maná por clic */
  const shockwaves = [];
  if (canvas) {
    window.addEventListener(
      "pointerdown",
      (e) => {
        if (prefersReduced.matches) return;
        shockwaves.push({
          x: e.clientX,
          y: e.clientY,
          r: 5,
          maxR: Math.min(180, window.innerWidth * 0.22),
          a: 0.55,
        });
      },
      { passive: true },
    );
  }

  function drawWisps() {
    wisps.forEach((w) => {
      ctx.save();
      const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
      const color =
        w.hue === 270
          ? `rgba(138, 43, 226, ${w.a})`
          : `rgba(0, 170, 255, ${w.a})`;
      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      w.y += w.vy;
      w.x += w.vx;
      if (w.growing) {
        w.a += 0.0015;
        if (w.a >= w.maxA) w.growing = false;
      } else {
        w.a -= 0.001;
      }
      if (w.a <= 0 || w.y < -w.r) {
        Object.assign(w, mkWisp());
      }
    });
  }

  function drawShockwaves() {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      ctx.save();
      ctx.strokeStyle = `rgba(0, 220, 255, ${sw.a})`;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00e5ff";
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      sw.r += 4.5;
      sw.a *= 0.94;
      if (sw.a <= 0.01 || sw.r >= sw.maxR) {
        shockwaves.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.a) * 0.6;
      ctx.fillStyle = `hsl(${p.hue},100%,68%)`;
      ctx.shadowBlur = 9;
      ctx.shadowColor = `hsl(${p.hue},100%,70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.a += p.da;
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.x < -5 || p.x > canvas.width + 5 || p.y < -5 || p.y > canvas.height + 5)
        Object.assign(p, mkP(), {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        });
    });
  }

  /* Relámpagos de energía eléctrica */
  function bolt(x1, y1, x2, y2, d) {
    if (d <= 0) return;
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 44 * d;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 44 * d;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(mx, my);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (d > 1 && Math.random() > 0.55) {
      const bx = mx + (Math.random() - 0.5) * 60;
      const by = my + (Math.random() - 0.5) * 60;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    bolt(x1, y1, mx, my, d - 1);
    bolt(mx, my, x2, y2, d - 1);
  }

  let lastBolt = 0,
    nextBolt = rndDelay(),
    boltOn = false,
    boltT = 0;
  let bx1, by1, bx2, by2;
  const BOLT_DUR = 135;
  function rndDelay() {
    return 3600 + Math.random() * 6500;
  }

  function drawBolt(now) {
    if (!boltOn) {
      if (now - lastBolt > nextBolt) {
        boltOn = true;
        boltT = now;
        lastBolt = now;
        nextBolt = rndDelay();
        const e = Math.floor(Math.random() * 4);
        if (e === 0) {
          bx1 = Math.random() * canvas.width;
          by1 = 0;
        } else if (e === 1) {
          bx1 = canvas.width;
          by1 = Math.random() * canvas.height;
        } else if (e === 2) {
          bx1 = Math.random() * canvas.width;
          by1 = canvas.height;
        } else {
          bx1 = 0;
          by1 = Math.random() * canvas.height;
        }
        bx2 = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
        by2 = canvas.height * 0.2 + Math.random() * canvas.height * 0.6;
      }
      return;
    }
    const el = now - boltT;
    if (el > BOLT_DUR) {
      boltOn = false;
      return;
    }
    const p = el / BOLT_DUR;
    const a = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7;
    ctx.save();
    ctx.globalAlpha = a * 0.65;
    ctx.strokeStyle = "#6fe3ff";
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(0,229,255,0.95)";
    bolt(bx1, by1, bx2, by2, 3);
    ctx.restore();
  }

  function drawEdgeGlow() {
    const t = Date.now() / 4000,
      i = 0.045 + 0.02 * Math.sin(t);
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, `rgba(0,180,255,${i * 2.2})`);
    g.addColorStop(0.25, "transparent");
    g.addColorStop(0.75, "transparent");
    g.addColorStop(1, `rgba(0,130,220,${i})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gl = ctx.createLinearGradient(0, 0, 80, 0);
    gl.addColorStop(0, `rgba(0,170,255,${i * 1.2})`);
    gl.addColorStop(1, "transparent");
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, 80, canvas.height);
    const gr = ctx.createLinearGradient(canvas.width, 0, canvas.width - 80, 0);
    gr.addColorStop(0, `rgba(0,140,240,${i * 0.9})`);
    gr.addColorStop(1, "transparent");
    ctx.fillStyle = gr;
    ctx.fillRect(canvas.width - 80, 0, 80, canvas.height);
  }

  let raf;
  function loop(now) {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!prefersReduced.matches) {
        drawEdgeGlow();
        drawWisps();
        drawParticles();
        drawBolt(now);
        drawShockwaves();
      }
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  prefersReduced.addEventListener("change", () => {
    if (prefersReduced.matches) {
      cancelAnimationFrame(raf);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    } else raf = requestAnimationFrame(loop);
  });

  /* ============================================================
     3. XP BAR & LEVEL SYSTEM — SCROLL BASED PROGRESSION
     ============================================================ */
  const xpFill = document.getElementById("xp-fill");
  const xpPct = document.getElementById("xp-pct");
  const xpLevel = document.getElementById("xp-level");

  const LEVELS = [
    { min: 0, lv: 1, label: "LV. 1  [ APRENDIZ ]" },
    { min: 18, lv: 2, label: "LV. 2  [ DESARROLLADOR ]" },
    { min: 36, lv: 3, label: "LV. 3  [ EXPERTO WEB ]" },
    { min: 55, lv: 4, label: "LV. 4  [ HUNTER DE CÓDIGO ]" },
    { min: 74, lv: 5, label: "LV. 5  [ SHADOW MONARCH ]" },
    { min: 95, lv: 6, label: "LV. MAX [ ARISE ]" },
  ];

  let currentLv = 1;

  function showLevelUpToast(label) {
    let toast = document.querySelector(".sl-levelup-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "sl-levelup-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = `⬆ LEVEL UP! ${label}`;
    toast.classList.add("show");
    SL_AUDIO.play("levelup");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function updateXP() {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const pct = Math.min(100, Math.round((scrolled / maxScroll) * 100));
    const display = pct + "%";

    if (xpFill) xpFill.style.width = display;
    if (xpPct) xpPct.textContent = display;

    let newLv = LEVELS[0];
    for (const L of LEVELS) {
      if (pct >= L.min) newLv = L;
    }

    if (newLv.lv !== currentLv) {
      currentLv = newLv.lv;
      if (xpLevel) {
        xpLevel.textContent = newLv.label;
        xpLevel.classList.remove("levelup");
        void xpLevel.offsetWidth; // reflow
        xpLevel.classList.add("levelup");
        if (!prefersReduced.matches) showLevelUpToast(newLv.label);
      }
    }

    if (xpPct) {
      xpPct.style.color =
        pct >= 95 ? "#fff" : pct >= 55 ? "var(--neon-bright)" : "var(--muted)";
    }
  }

  window.addEventListener("scroll", updateXP, { passive: true });
  updateXP();

  /* ============================================================
     4. EPIC CARD UPGRADES (HD SCANLINES + ENERGY PULSE)
     ============================================================ */
  function upgradeCard(card) {
    if (card.dataset.sl) return;
    card.dataset.sl = "1";

    // Radial glow spotlight
    const glow = document.createElement("div");
    glow.className = "card-glow";
    card.appendChild(glow);

    // Rotating border trace
    const trace = document.createElement("div");
    trace.className = "card-border-trace";
    card.appendChild(trace);

    // Quest badge
    const badge = document.createElement("div");
    badge.className = "card-quest-badge";
    badge.textContent = "QUEST COMPLETE";
    card.appendChild(badge);

    // Bottom energy bar
    const ebar = document.createElement("div");
    ebar.className = "card-energy-bar";
    card.appendChild(ebar);

    // Wrap img for overlay & scanlines
    const img = card.querySelector("img, .ph");
    if (img && !img.parentElement.classList.contains("card-img-wrap")) {
      const wrap = document.createElement("div");
      wrap.className = "card-img-wrap";
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      const overlay = document.createElement("div");
      overlay.className = "card-img-overlay";
      wrap.appendChild(overlay);
    }

    // Pointer tilt + glow
    if (
      matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReduced.matches
    ) {
      card.classList.add("tilt-enabled");
      card.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const mx = 1.8;
        card.style.setProperty("--pointer-x", `${x * 100}%`);
        card.style.setProperty("--pointer-y", `${y * 100}%`);
        card.style.setProperty("--tilt-x", `${(x - 0.5) * mx * 2}deg`);
        card.style.setProperty("--tilt-y", `${(0.5 - y) * mx * 2}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--pointer-x");
        card.style.removeProperty("--pointer-y");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    }

    // Click ripple / energy burst
    card.addEventListener("click", (e) => {
      if (prefersReduced.matches || e.target.closest("button, a")) return;
      const r = card.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;
        left:${e.clientX - r.left}px;
        top:${e.clientY - r.top}px;
        transform:translate(-50%,-50%) scale(0);
        width:220px; height:220px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(0,229,255,0.45) 0%,transparent 70%);
        pointer-events:none;
        z-index:10;
        animation:card-ripple 0.7s ease-out forwards;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  // Inject ripple keyframes once
  const kf = document.createElement("style");
  kf.textContent = `
    @keyframes card-ripple {
      to { transform: translate(-50%,-50%) scale(1); opacity: 0; }
    }
    .card-glow {
      position: absolute; z-index: 2; inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        circle at var(--pointer-x,50%) var(--pointer-y,30%),
        rgba(0,229,255,0.18), transparent 44%
      );
      opacity: 0; transition: opacity 0.35s; pointer-events: none;
    }
    .card.tilt-enabled:hover .card-glow { opacity: 1; }
    .card.tilt-enabled:hover {
      transform:
        perspective(1000px)
        rotateX(var(--tilt-y,0deg))
        rotateY(var(--tilt-x,0deg))
        translateY(-8px) scale(1.012);
    }
    .sl-divider {
      width: 100%; height: 2px;
      margin: 8px 0 26px;
      background: linear-gradient(90deg, #6fe3ff, rgba(0,170,255,0.25), transparent);
      position: relative;
    }
    .sl-divider::before {
      content: "";
      position: absolute; left: 0; top: -3px;
      width: 8px; height: 8px; border-radius: 50%;
      background: #6fe3ff;
      box-shadow: 0 0 12px #00e5ff, 0 0 24px rgba(0,229,255,0.7);
    }
  `;
  document.head.appendChild(kf);

  const observer = new MutationObserver(() => {
    document.querySelectorAll(".card:not([data-sl])").forEach(upgradeCard);
  });
  observer.observe(document.getElementById("grid") || document.body, {
    childList: true,
    subtree: true,
  });
  document.querySelectorAll(".card").forEach(upgradeCard);

  /* ============================================================
     5. H2 DIVIDERS
     ============================================================ */
  document.querySelectorAll("h2").forEach((el) => {
    if (!el.nextElementSibling?.classList.contains("sl-divider")) {
      el.insertAdjacentHTML("afterend", `<div class="sl-divider" aria-hidden="true"></div>`);
    }
  });

  /* ============================================================
     6. TYPING EFFECT EN H1
     ============================================================ */
  const h1 = document.querySelector("h1");
  if (h1 && !prefersReduced.matches) {
    const original = h1.textContent.trim();
    h1.textContent = "";
    h1.style.minHeight = "1em";
    let i = 0;
    const type = () => {
      if (i <= original.length) {
        h1.textContent = original.slice(0, i++);
        setTimeout(type, i === 1 ? 500 : 22 + Math.random() * 16);
      }
    };
    const wait = () => {
      const loader = document.getElementById("loader");
      if (!loader || loader.classList.contains("hide")) setTimeout(type, 350);
      else setTimeout(wait, 200);
    };
    setTimeout(wait, 1000);
  }

  /* ============================================================
     7. VENTANA DE NOTIFICACIÓN DEL SISTEMA (SOLO LEVELING MODAL)
     ============================================================ */
  const systemModal = document.getElementById("sl-system-modal");
  const openModalBtn = document.getElementById("open-system-modal");
  const navQuestBtn = document.getElementById("system-quest-btn");
  const closeModalBtn = document.getElementById("close-system-modal");
  const modalBackdrop = document.getElementById("sl-modal-backdrop");
  const acceptQuestBtn = document.getElementById("accept-quest-btn");
  const copyPortfolioBtn = document.getElementById("copy-portfolio-btn");

  const SL_SYSTEM = {
    open: () => {
      if (!systemModal) return;
      systemModal.classList.add("show");
      systemModal.setAttribute("aria-hidden", "false");
      SL_AUDIO.play("alert");
      document.body.style.overflow = "hidden";
    },
    close: () => {
      if (!systemModal) return;
      systemModal.classList.remove("show");
      systemModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      SL_AUDIO.play("click");
    },
    toast: (msg) => {
      let toast = document.querySelector(".sl-levelup-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "sl-levelup-toast";
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3200);
    },
  };
  window.SL_SYSTEM = SL_SYSTEM;

  if (openModalBtn) openModalBtn.addEventListener("click", SL_SYSTEM.open);
  if (navQuestBtn) navQuestBtn.addEventListener("click", SL_SYSTEM.open);
  if (closeModalBtn) closeModalBtn.addEventListener("click", SL_SYSTEM.close);
  if (modalBackdrop) modalBackdrop.addEventListener("click", SL_SYSTEM.close);

  if (acceptQuestBtn) {
    acceptQuestBtn.addEventListener("click", () => {
      SL_SYSTEM.close();
      SL_AUDIO.play("reward");
      SL_SYSTEM.toast("[ MISIÓN ACEPTADA: EXPLORA LOS PROYECTOS ]");
    });
  }

  if (copyPortfolioBtn) {
    copyPortfolioBtn.addEventListener("click", async () => {
      const url = window.location.origin + window.location.pathname;
      try {
        await navigator.clipboard.writeText(url);
      } catch (e) {
        const temp = document.createElement("input");
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
      }
      SL_AUDIO.play("reward");
      copyPortfolioBtn.classList.add("copied");
      const span = copyPortfolioBtn.querySelector("span");
      if (span) span.textContent = "✔ ¡Enlace copiado!";
      SL_SYSTEM.toast("[ RECOMPENSA: ENLACE PRINCIPAL COPIADO ]");
      setTimeout(() => {
        copyPortfolioBtn.classList.remove("copied");
        if (span) span.textContent = "🔗 Copiar Link del Portafolio";
      }, 2500);
    });
  }

  // Cerrar con Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && systemModal?.classList.contains("show")) {
      SL_SYSTEM.close();
    }
  });

  // Mostrar automáticamente al primer acceso
  try {
    if (!sessionStorage.getItem("sl-system-welcomed")) {
      sessionStorage.setItem("sl-system-welcomed", "1");
      setTimeout(() => {
        if (!prefersReduced.matches) {
          SL_SYSTEM.open();
        }
      }, 2400);
    }
  } catch (e) {}

})();
