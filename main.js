/* DevCarlos — script unificado */

// ---------- Proyectos: se leen de proyectos.json (lo genera generar-proyectos.js) ----------
let PROYECTOS = [];
let errorCarga = false;

// ---------- Textos legales (revísalos antes de publicar) ----------
const FECHA = "15 de agosto de 2026";
const LEGAL = {
  privacidad: [
    "Política de privacidad",
    [
      [
        "Información general",
        "Este sitio es el portafolio personal de DevCarlos y muestra proyectos de desarrollo web.",
      ],
      [
        "Información que recopilamos",
        "El sitio no pide datos personales para navegar. Si me escribes por correo, usaré tu mensaje solo para responderte.",
      ],
      [
        "Servicios de terceros",
        "El sitio carga la tipografía Poppins desde Google Fonts, por lo que Google puede recibir tu dirección IP al cargar la página.",
      ],
      [
        "Enlaces externos",
        "Puede haber enlaces a otros sitios. DevCarlos no controla sus políticas de privacidad.",
      ],
      [
        "Cambios",
        "Esta política puede actualizarse cuando se añadan nuevas funciones.",
      ],
    ],
  ],
  terminos: [
    "Términos de uso",
    [
      [
        "Uso del sitio",
        "El sitio presenta información, proyectos y trabajos realizados por DevCarlos.",
      ],
      [
        "Propiedad intelectual",
        "El código y diseño son de DevCarlos, salvo que se indique lo contrario. No los reutilices sin permiso.",
      ],
      [
        "Responsabilidad",
        "El contenido se ofrece tal cual, sin garantías de disponibilidad continua.",
      ],
      [
        "Enlaces externos",
        "Los enlaces a otros sitios son solo de referencia.",
      ],
      [
        "Cambios",
        "Estos términos pueden modificarse para reflejar cambios en el sitio.",
      ],
    ],
  ],
  cookies: [
    "Política de cookies",
    [
      [
        "¿Qué son las cookies?",
        "Pequeños archivos que se guardan en tu dispositivo para recordar preferencias o habilitar funciones.",
      ],
      [
        "Uso de cookies",
        "DevCarlos no usa cookies publicitarias propias. El sitio guarda en tu navegador, solo durante la sesión, un aviso para no repetir la pantalla de carga.",
      ],
      [
        "Servicios de terceros",
        "Servicios externos, como Google Fonts, podrían establecer sus propias cookies según sus políticas.",
      ],
    ],
  ],
};

const $ = (s, el = document) => el.querySelector(s);

// ---------- Pantalla de carga (solo la primera vez por sesión) ----------
const loader = $("#loader");
const volver = new URLSearchParams(location.search).has("volver");
let visto = false;
try {
  visto = sessionStorage.getItem("dc-visto") === "1";
  sessionStorage.setItem("dc-visto", "1");
} catch (e) {}
const quitarLoader = () => {
  loader.classList.add("hide");
  setTimeout(() => loader.remove(), 700);
};
if (visto || volver) loader.remove();
else window.addEventListener("load", () => setTimeout(quitarLoader, 1000));

// ---------- Aparición al hacer scroll ----------
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      )
    : null;
const reveal = (el) => {
  el.classList.add("reveal");
  io ? io.observe(el) : el.classList.add("in");
};
document
  .querySelectorAll(".reveal")
  .forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

// ---------- Tarjetas y filtros ----------
const grid = $("#grid");
let filtroActual = "Todos";
const movimientoReducido = matchMedia("(prefers-reduced-motion: reduce)");
const punteroPreciso = matchMedia("(hover: hover) and (pointer: fine)");
function activarInclinacion(card) {
  if (!punteroPreciso.matches || movimientoReducido.matches) return;
  card.classList.add("tilt-enabled");
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || movimientoReducido.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const maxTilt = 5;
    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
    card.style.setProperty("--tilt-x", `${(x - 0.5) * maxTilt * 2}deg`);
    card.style.setProperty("--tilt-y", `${(0.5 - y) * maxTilt * 2}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--pointer-x");
    card.style.removeProperty("--pointer-y");
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
}
const ph = (t) =>
  Object.assign(document.createElement("div"), {
    className: "ph",
    textContent: (t || "?").trim()[0].toUpperCase(),
  });
function pintar(cat) {
  filtroActual = cat;
  grid.replaceChildren();
  if (!PROYECTOS.length) {
    grid.append(
      Object.assign(document.createElement("p"), {
        className: "sub",
        textContent: errorCarga
          ? "No se pudo leer proyectos.json. Abre el sitio con un servidor (no como archivo suelto)."
          : "Aún no hay proyectos.",
      }),
    );
    return;
  }
  PROYECTOS.filter(
    (p) => cat === "Todos" || p.categorias.includes(cat),
  ).forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    const img = p.imagen
      ? Object.assign(document.createElement("img"), {
          src: p.imagen,
          alt: `Vista previa de ${p.titulo}`,
          width: 640,
          height: 400,
          loading: "lazy",
        })
      : ph(p.titulo);
    if (p.imagen)
      img.addEventListener("error", () => img.replaceWith(ph(p.titulo)));
    const body = document.createElement("div");
    body.className = "card-body";
    const tags = Object.assign(document.createElement("p"), {
      className: "tags",
      textContent: (p.tecnologias?.length ? p.tecnologias : p.categorias).join(" · "),
    });
    const h3 = Object.assign(document.createElement("h3"), {
      textContent: p.titulo,
    });
    const desc = Object.assign(document.createElement("p"), {
      textContent: p.descripcion,
    });
    const a = Object.assign(document.createElement("a"), {
      className: "btn primary",
      href: p.ruta,
      target: "_blank",
      rel: "noopener",
      textContent: "Abrir proyecto",
    });
    a.setAttribute("aria-label", `Abrir ${p.titulo} en una pestaña nueva`);
    body.append(tags, h3, desc, a);
    card.append(img, body);
    grid.append(card);
    activarInclinacion(card);
    reveal(card);
  });
}
const filtros = $(".filters");
function armarFiltros() {
  filtros.replaceChildren();
  ["Todos", ...new Set(PROYECTOS.flatMap((p) => p.categorias))].forEach(
    (c, i) => {
      const b = Object.assign(document.createElement("button"), {
        textContent: c,
        type: "button",
      });
      b.setAttribute("aria-pressed", i === 0);
      b.addEventListener("click", () => {
        filtros
          .querySelectorAll("button")
          .forEach((x) => x.setAttribute("aria-pressed", x === b));
        pintar(c);
      });
      filtros.append(b);
    },
  );
  pintar("Todos");
  $("#count").textContent = PROYECTOS.length;
}

// ---------- Header: fondo al hacer scroll y menú móvil ----------
const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 12);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

const btn = $(".menu-btn"),
  links = $("#links");
btn.addEventListener("click", () =>
  btn.setAttribute("aria-expanded", links.classList.toggle("open")),
);
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  }
});

// Enlace activo según la sección visible
if (io) {
  const nav = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting)
          links
            .querySelectorAll("a")
            .forEach((a) =>
              a.classList.toggle("active", a.hash === "#" + e.target.id),
            );
      }),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  document.querySelectorAll("main section[id]").forEach((s) => nav.observe(s));
}

// ---------- Avatar: ocultar si no existe la imagen ----------
$(".avatar").addEventListener(
  "error",
  (e) => (e.target.style.display = "none"),
);

// ---------- Legales en ventana modal ----------
const dlg = $("#legal"),
  cuerpo = $("#legal-body");
document.querySelectorAll("[data-legal]").forEach((b) =>
  b.addEventListener("click", () => {
    const [titulo, secciones] = LEGAL[b.dataset.legal];
    cuerpo.replaceChildren();
    const h2 = Object.assign(document.createElement("h2"), {
      id: "legal-title",
      textContent: titulo,
    });
    const f = Object.assign(document.createElement("p"), {
      className: "upd",
      textContent: `Última actualización: ${FECHA}`,
    });
    cuerpo.append(h2, f);
    secciones.forEach(([t, x]) => {
      cuerpo.append(
        Object.assign(document.createElement("h3"), { textContent: t }),
        Object.assign(document.createElement("p"), { textContent: x }),
      );
    });
    dlg.showModal();
  }),
);
$(".close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});

// ---------- Recordar dónde estabas al volver de un proyecto ----------
const KEY = "dc-pos";
try {
  history.scrollRestoration = "manual";
} catch (e) {}
const tipoNav = (performance.getEntriesByType("navigation")[0] || {}).type;

function restaurar() {
  if (
    (volver || tipoNav === "reload" || tipoNav === "back_forward") &&
    !location.hash
  ) {
    try {
      const g = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (g.cat && g.cat !== "Todos")
        [...filtros.querySelectorAll("button")]
          .find((b) => b.textContent === g.cat)
          ?.click();
      requestAnimationFrame(() =>
        scrollTo({ top: g.y || 0, behavior: "instant" }),
      );
    } catch (e) {}
  }
  if (volver) history.replaceState(null, "", location.pathname);
}

const guardar = () => {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ y: scrollY, cat: filtroActual }),
    );
  } catch (e) {}
};
let tmr;
addEventListener(
  "scroll",
  () => {
    clearTimeout(tmr);
    tmr = setTimeout(guardar, 150);
  },
  { passive: true },
);
addEventListener("pagehide", guardar);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) guardar();
});

// ---------- Descubrir carpetas de proyectos automáticamente ----------
// <descubrir>
const CARPETA = "proyectos-nuevos";
// Solo si usas dominio propio en GitHub Pages, rellénalo a mano: { usuario: "tu-usuario", repo: "tu-repo", rama: "HEAD" }
const GITHUB = { usuario: "", repo: "", rama: "HEAD" };
const IMGS = ["preview", "portada", "cover", "thumbnail", "screenshot"].flatMap((n) =>
  ["jpg", "jpeg", "png", "webp"].map((e) => `${n}.${e}`),
);
const bonito = (n) => {
  const t = n.replace(/[-_]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function datosGitHub() {
  if (GITHUB.usuario) return GITHUB;
  if (!location.hostname.endsWith(".github.io")) return null;
  const usuario = location.hostname.split(".")[0];
  const seg = location.pathname.split("/")[1];
  return {
    usuario,
    repo: seg && !seg.includes(".") ? seg : `${usuario}.github.io`,
    rama: "HEAD",
  };
}

// Vía 1 (sitio en GitHub Pages): lee la lista de archivos del repositorio
async function viaGitHub() {
  const g = datosGitHub();
  if (!g) throw new Error("no es GitHub Pages");
  try {
    const c = JSON.parse(sessionStorage.getItem("dc-tree"));
    if (c && Date.now() - c.t < 60000) return c.d;
  } catch (e) {}
  let rama = g.rama;
  if (rama === "HEAD") {
    const repo = await fetch(
      `https://api.github.com/repos/${g.usuario}/${g.repo}`,
      { cache: "no-cache" },
    );
    if (!repo.ok) throw new Error("repo " + repo.status);
    rama = (await repo.json()).default_branch;
  }
  const arbol = new URL(
    `https://api.github.com/repos/${g.usuario}/${g.repo}/git/trees/${encodeURIComponent(rama)}`,
  );
  arbol.searchParams.set("recursive", "1");
  const r = await fetch(arbol, { cache: "no-cache" });
  if (!r.ok) throw new Error("api " + r.status);
  const rutas = (await r.json()).tree
    .filter((t) => t.type === "blob")
    .map((t) => t.path);
  const carpetas = rutas
    .filter((p) => p.startsWith(CARPETA + "/") && p.endsWith("/index.html"))
    .map((p) => p.slice(0, -11))
    .sort((a, b) => a.length - b.length);
  const salida = [];
  carpetas.forEach((c) => {
    if (!salida.some((s) => c.startsWith(s.carpeta + "/"))) {
      const archivos = rutas.filter((p) => {
        const resto = p.slice(c.length + 1);
        return p.startsWith(c + "/") && resto && !resto.includes("/");
      });
      const portada =
        IMGS.map((f) => `${c}/${f}`).find((f) => rutas.includes(f)) ||
        archivos.find(
          (f) =>
            /\.(?:avif|webp|png|jpe?g)$/i.test(f) &&
            !/(?:^|\/)(?:favicon|icon|apple-touch|icon-maskable)/i.test(f),
        ) ||
        "";
      salida.push({
        carpeta: c,
        imagen: portada,
      });
    }
  });
  try {
    sessionStorage.setItem(
      "dc-tree",
      JSON.stringify({ t: Date.now(), d: salida }),
    );
  } catch (e) {}
  return salida;
}

// Vía 2 (servidor local o hosting con listado de carpetas): recorre proyectos-nuevos/
async function subcarpetas(dir) {
  const base = new URL(dir + "/", location.href);
  const r = await fetch(base, { cache: "no-cache" });
  if (!r.ok) throw new Error("sin listado");
  const html = await r.text();
  const nombres = new Set();
  for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    let u;
    try {
      u = new URL(m[1], base);
    } catch (e) {
      continue;
    }
    const resto = u.pathname.slice(base.pathname.length);
    if (
      u.origin === base.origin &&
      u.pathname.startsWith(base.pathname) &&
      /^[^/]+\/$/.test(resto)
    )
      nombres.add(decodeURIComponent(resto.slice(0, -1)));
  }
  return [...nombres];
}
async function rastrear(dir, nivel = 0) {
  const hijos = await subcarpetas(dir);
  const res = await Promise.all(
    hijos.map(async (n) => {
      const c = `${dir}/${n}`;
      const r = await fetch(`${c}/index.html`, { cache: "no-cache" }).catch(
        () => null,
      );
      if (r && r.ok) {
        r.body?.cancel?.();
        return [{ carpeta: c }];
      }
      return nivel < 3 ? rastrear(c, nivel + 1).catch(() => []) : [];
    }),
  );
  return res.flat();
}

const auto = async (h) => {
  const partes = h.carpeta.split("/");
  const carpetaPadre = partes.length > 2 ? partes[partes.length - 2] : "";
  const categoria =
    carpetaPadre.toLowerCase() === "videos-hd"
      ? "Videos"
      : carpetaPadre
        ? bonito(carpetaPadre)
        : "Proyectos";
  let titulo = "";
  let descripcion = "";
  let imagen = "";

  try {
    const respuesta = await fetch(`${h.carpeta}/index.html`, {
      cache: "no-cache",
    });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const html = await respuesta.text();
    const pagina = new DOMParser().parseFromString(html, "text/html");
    const meta = (nombre) =>
      pagina
        .querySelector(`meta[name="${nombre}"], meta[property="${nombre}"]`)
        ?.getAttribute("content")
        ?.trim() || "";
    titulo = pagina.title.trim();
    descripcion =
      meta("description") ||
      meta("og:description") ||
      pagina.querySelector("main h1, h1")?.textContent?.trim() ||
      "";
    const imagenMeta = meta("og:image") || meta("twitter:image");
    if (imagenMeta)
      imagen = new URL(
        imagenMeta,
        new URL(`${h.carpeta}/index.html`, location.href),
      ).href;
  } catch (e) {
    console.warn(
      `No se pudieron leer los metadatos de ${h.carpeta}/index.html`,
      e,
    );
  }

  return {
    titulo: titulo || bonito(partes[partes.length - 1]),
    descripcion:
      descripcion ||
      `Explora ${titulo || bonito(partes[partes.length - 1])}, una experiencia web creada por DevCarlos.`,
    imagen: h.imagen || imagen,
    ruta: `${h.carpeta}/index.html`,
    categorias: [categoria],
  };
};
// </descubrir>

// Las carpetas con index.html se detectan solas; meta description y preview.jpg mejoran su tarjeta.
async function cargarProyectos() {
  let base = [];
  try {
    const r = await fetch("proyectos.json", { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    base = await r.json();
  } catch (e) {
    errorCarga = true;
  }
  let hallados = null;
  try {
    hallados = await viaGitHub();
  } catch (e) {
    try {
      hallados = await rastrear(CARPETA);
    } catch (e2) {}
  }
  if (hallados && hallados.length) {
    errorCarga = false;
    const rutas = new Set(hallados.map((h) => `${h.carpeta}/index.html`));
    const conocidos = new Set(base.map((p) => p.ruta));
    const nuevos = await Promise.all(
      hallados
        .filter((h) => !conocidos.has(`${h.carpeta}/index.html`))
        .map(auto),
    );
    base = [
      ...nuevos,
      ...base.filter(
        (p) => !p.ruta.startsWith(CARPETA + "/") || rutas.has(p.ruta),
      ),
    ];
  }
  PROYECTOS = base.map((p) => ({
    ...p,
    categorias: p.categorias?.length ? p.categorias : ["Proyectos"],
  }));
}
cargarProyectos().finally(() => {
  armarFiltros();
  restaurar();
});
