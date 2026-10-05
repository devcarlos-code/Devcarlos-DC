/* ============================================================
   sl-effects.js — Solo Leveling: particles, lightning,
                   XP bar, epic card animations
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================================
     1. CANVAS — particles + lightning
     ============================================================ */
  const canvas = document.getElementById("sl-canvas");
  const ctx    = canvas ? canvas.getContext("2d") : null;

  function resize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  if (canvas) {
    resize();
    window.addEventListener("resize", resize, { passive: true });
  }

  /* Particles */
  const MAX_P = 55;
  const particles = [];
  function mkP() {
    return {
      x: Math.random() * (canvas?.width  || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      r:  Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a:  Math.random(),
      da: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.8 ? 200 : 190 + Math.random() * 30,
    };
  }
  if (canvas) for (let i = 0; i < MAX_P; i++) particles.push(mkP());

  function drawParticles() {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.a) * 0.5;
      ctx.fillStyle   = `hsl(${p.hue},100%,65%)`;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `hsl(${p.hue},100%,70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.x < -5 || p.x > canvas.width + 5 || p.y < -5 || p.y > canvas.height + 5)
        Object.assign(p, mkP(), { x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    });
  }

  /* Lightning */
  function bolt(x1, y1, x2, y2, d) {
    if (d <= 0) return;
    const mx = (x1+x2)/2 + (Math.random()-0.5)*44*d;
    const my = (y1+y2)/2 + (Math.random()-0.5)*44*d;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my); ctx.lineTo(x2,y2); ctx.stroke();
    if (d > 1 && Math.random() > 0.55) {
      const bx = mx + (Math.random()-0.5)*60, by = my + (Math.random()-0.5)*60;
      ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(bx,by); ctx.stroke();
    }
    bolt(x1,y1,mx,my,d-1); bolt(mx,my,x2,y2,d-1);
  }

  let lastBolt=0, nextBolt=rndDelay(), boltOn=false, boltT=0;
  let bx1,by1,bx2,by2;
  const BOLT_DUR=130;
  function rndDelay() { return 3500 + Math.random()*7000; }

  function drawBolt(now) {
    if (!boltOn) {
      if (now - lastBolt > nextBolt) {
        boltOn=true; boltT=now; lastBolt=now; nextBolt=rndDelay();
        const e=Math.floor(Math.random()*4);
        if      (e===0){bx1=Math.random()*canvas.width;  by1=0;}
        else if (e===1){bx1=canvas.width;                by1=Math.random()*canvas.height;}
        else if (e===2){bx1=Math.random()*canvas.width;  by1=canvas.height;}
        else           {bx1=0;                            by1=Math.random()*canvas.height;}
        bx2=canvas.width*0.2+Math.random()*canvas.width*0.6;
        by2=canvas.height*0.2+Math.random()*canvas.height*0.6;
      }
      return;
    }
    const el=now-boltT;
    if (el>BOLT_DUR){boltOn=false;return;}
    const p=el/BOLT_DUR;
    const a=p<0.3?p/0.3:1-(p-0.3)/0.7;
    ctx.save();
    ctx.globalAlpha=a*0.55; ctx.strokeStyle="#4df";
    ctx.lineWidth=1; ctx.shadowBlur=14; ctx.shadowColor="rgba(0,200,255,.85)";
    bolt(bx1,by1,bx2,by2,3);
    ctx.restore();
  }

  function drawEdgeGlow() {
    const t=Date.now()/4000, i=0.04+0.02*Math.sin(t);
    const g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,`rgba(0,170,255,${i*2})`);
    g.addColorStop(0.25,"transparent");
    g.addColorStop(0.75,"transparent");
    g.addColorStop(1,`rgba(0,120,200,${i})`);
    ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
    const gl=ctx.createLinearGradient(0,0,70,0);
    gl.addColorStop(0,`rgba(0,150,255,${i})`); gl.addColorStop(1,"transparent");
    ctx.fillStyle=gl; ctx.fillRect(0,0,70,canvas.height);
    const gr=ctx.createLinearGradient(canvas.width,0,canvas.width-70,0);
    gr.addColorStop(0,`rgba(0,130,220,${i*.7})`); gr.addColorStop(1,"transparent");
    ctx.fillStyle=gr; ctx.fillRect(canvas.width-70,0,70,canvas.height);
  }

  let raf;
  function loop(now) {
    if (ctx) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if (!prefersReduced.matches) { drawEdgeGlow(); drawParticles(); drawBolt(now); }
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  prefersReduced.addEventListener("change", () => {
    if (prefersReduced.matches) { cancelAnimationFrame(raf); ctx?.clearRect(0,0,canvas.width,canvas.height); }
    else raf = requestAnimationFrame(loop);
  });

  /* ============================================================
     2. XP BAR — scroll-based experience system
     ============================================================ */
  const xpFill  = document.getElementById("xp-fill");
  const xpPct   = document.getElementById("xp-pct");
  const xpLevel = document.getElementById("xp-level");

  // Level thresholds (% of page scroll)
  const LEVELS = [
    { min: 0,   lv: 1,  label: "LV. 1  [ APRENDIZ ]" },
    { min: 18,  lv: 2,  label: "LV. 2  [ DESARROLLADOR ]" },
    { min: 36,  lv: 3,  label: "LV. 3  [ EXPERTO WEB ]" },
    { min: 55,  lv: 4,  label: "LV. 4  [ HUNTER DE CODIGO ]" },
    { min: 74,  lv: 5,  label: "LV. 5  [ SHADOW MONARCH ]" },
    { min: 95,  lv: 6,  label: "LV. MAX [ ARISE ]" },
  ];

  let currentLv = 1;
  let lastPct   = 0;

  function showLevelUpToast(label) {
    let toast = document.querySelector(".sl-levelup-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "sl-levelup-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = `⬆ LEVEL UP! ${label}`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function updateXP() {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const pct     = Math.min(100, Math.round((scrolled / maxScroll) * 100));
    const display = pct + "%";

    if (xpFill)  xpFill.style.width = display;
    if (xpPct)   xpPct.textContent  = display;

    // Determine level
    let newLv = LEVELS[0];
    for (const L of LEVELS) { if (pct >= L.min) newLv = L; }

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

    // Color the pct text based on progress
    if (xpPct) {
      xpPct.style.color = pct >= 95 ? "#fff" : pct >= 55 ? "var(--neon-bright)" : "var(--muted)";
    }

    lastPct = pct;
  }

  window.addEventListener("scroll", updateXP, { passive: true });
  updateXP();

  /* ============================================================
     3. EPIC CARD UPGRADES — border trace + quest badge + energy bar
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

    // Wrap img for overlay
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
    if (matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReduced.matches) {
      card.classList.add("tilt-enabled");
      card.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top)  / r.height;
        const mx = 6;
        card.style.setProperty("--pointer-x", `${x*100}%`);
        card.style.setProperty("--pointer-y", `${y*100}%`);
        card.style.setProperty("--tilt-x",    `${(x-0.5)*mx*2}deg`);
        card.style.setProperty("--tilt-y",    `${(0.5-y)*mx*2}deg`);
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
      if (prefersReduced.matches) return;
      const r = card.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;
        left:${e.clientX - r.left}px;
        top:${e.clientY  - r.top}px;
        transform:translate(-50%,-50%) scale(0);
        width:200px; height:200px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(0,200,255,0.4) 0%,transparent 70%);
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
        rgba(0,200,255,0.16), transparent 44%
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

    /* Section neon divider */
    .sl-divider {
      width: 100%; height: 1px;
      margin: 8px 0 26px;
      background: linear-gradient(90deg, var(--neon), rgba(0,170,255,0.15), transparent);
      position: relative;
    }
    .sl-divider::before {
      content: "";
      position: absolute; left: 0; top: -3px;
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--neon);
      box-shadow: 0 0 10px var(--neon), 0 0 22px rgba(0,170,255,0.6);
    }
  `;
  document.head.appendChild(kf);

  // Watch for dynamic card injection
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".card:not([data-sl])").forEach(upgradeCard);
  });
  observer.observe(document.getElementById("grid") || document.body, { childList: true, subtree: true });
  document.querySelectorAll(".card").forEach(upgradeCard);

  /* ============================================================
     4. H2 DIVIDERS
     ============================================================ */
  document.querySelectorAll("h2").forEach((el) => {
    if (!el.nextElementSibling?.classList.contains("sl-divider")) {
      el.insertAdjacentHTML("afterend", `<div class="sl-divider" aria-hidden="true"></div>`);
    }
  });

  /* ============================================================
     5. TYPING EFFECT on h1
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
        setTimeout(type, i === 1 ? 550 : 26 + Math.random() * 18);
      }
    };
    const wait = () => {
      const loader = document.getElementById("loader");
      if (!loader || loader.classList.contains("hide")) setTimeout(type, 350);
      else setTimeout(wait, 200);
    };
    setTimeout(wait, 1100);
  }

  /* ============================================================
     6. SYSTEM BOOT notification on first visit
     ============================================================ */
  try {
    if (!sessionStorage.getItem("sl-boot")) {
      sessionStorage.setItem("sl-boot", "1");
      setTimeout(() => {
        if (prefersReduced.matches) return;
        const toast = document.createElement("div");
        toast.className = "sl-levelup-toast";
        toast.style.top = "auto";
        toast.style.bottom = "32px";
        toast.textContent = "[ BIENVENIDO AL DUNGEON DE DEVCARLOS ]";
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 400);
        }, 3500);
      }, 2200);
    }
  } catch(e){}

})();
