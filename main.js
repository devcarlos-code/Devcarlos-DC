/* DevCarlos — script unificado */

// ---------- Proyectos: se leen de proyectos.json (lo genera generar-proyectos.js) ----------
let PROYECTOS = [];
let errorCarga = false;

// ---------- Textos legales (revísalos antes de publicar) ----------
const FECHA = "11 de octubre de 2026";
const LEGAL = {
  privacidad: [
    "Política de privacidad",
    [
      [
        "Quién administra este sitio",
        "DevCarlos es un portafolio personal que presenta proyectos y experimentos de desarrollo web. Esta política describe qué información puede tratarse al visitar el sitio y cómo se utilizan sus funciones.",
      ],
      [
        "Datos que envías voluntariamente",
        "El sitio no contiene un formulario propio para recopilar datos personales. Si eliges escribirme mediante correo electrónico o una red social, la información que incluyas será recibida por el servicio que uses y podrá utilizarse para responderte y mantener esa conversación. Evita enviar información sensible que no sea necesaria.",
      ],
      [
        "Almacenamiento en tu dispositivo",
        "El sitio usa localStorage para recordar temporalmente la posición de desplazamiento y el filtro de proyectos, y sessionStorage para gestionar la pantalla de bienvenida y guardar en caché durante un periodo breve el listado de proyectos. Estos datos se guardan en tu propio navegador; no son un sistema de cuentas ni se envían a una base de datos propia. Puedes borrarlos desde la configuración del navegador.",
      ],
      [
        "Servicios externos y solicitudes técnicas",
        "El sitio carga tipografías desde Google Fonts y, en GitHub Pages, puede consultar la API de GitHub para descubrir proyectos. Esos proveedores reciben las solicitudes técnicas necesarias y pueden tratar datos como la dirección IP, información del navegador y datos de conexión conforme a sus propias políticas. El alojamiento también puede procesar registros técnicos para operar y proteger el servicio.",
      ],
      [
        "Analítica y publicidad",
        "En el código revisado no encontré integraciones explícitas de Google Analytics, píxeles publicitarios ni plataformas de analítica de terceros. Esta descripción puede cambiar si se añaden herramientas nuevas o si algún proveedor externo incorpora funciones propias.",
      ],
      [
        "Finalidad y conservación",
        "El almacenamiento del navegador se utiliza para recordar la experiencia de navegación y acelerar ciertas consultas. El elemento de bienvenida se gestiona por sesión; la caché del árbol de proyectos se considera válida durante aproximadamente un minuto. Los mensajes que envíes por servicios externos se conservan según el funcionamiento y la configuración de esos servicios y de tus propias cuentas.",
      ],
      [
        "Tus opciones",
        "Puedes dejar de utilizar el sitio, borrar los datos del navegador o contactar a DevCarlos mediante los canales publicados en el portafolio para plantear una consulta sobre privacidad. Las solicitudes relacionadas con datos que estén en plataformas externas deberán dirigirse también al proveedor que los gestione.",
      ],
      [
        "Cambios en esta política",
        "Esta política puede actualizarse si cambian las funciones, el código o los servicios utilizados. La fecha que aparece al inicio indica la última revisión publicada.",
      ],
    ],
  ],
  terminos: [
    "Términos de uso",
    [
      [
        "Finalidad del sitio",
        "Este es un portafolio personal creado para mostrar proyectos, prácticas y experimentos de desarrollo web. El contenido se ofrece con fines informativos y de demostración.",
      ],
      [
        "Uso responsable",
        "Puedes navegar por el sitio y probar sus funciones de forma normal. No intentes interferir con su funcionamiento, abusar de servicios externos, introducir código malicioso ni acceder sin autorización a sistemas o datos.",
      ],
      [
        "Propiedad intelectual",
        "El diseño, los textos y el código original de DevCarlos pertenecen a su autor salvo que se indique lo contrario. No se concede una licencia general para copiar, redistribuir o presentar ese material como propio. Si un proyecto incluye componentes, recursos o licencias de terceros, estos se rigen por sus respectivas condiciones.",
      ],
      [
        "Proyectos y recursos de terceros",
        "Algunos proyectos pueden enlazar a demos, repositorios, bibliotecas, tipografías, imágenes o servicios externos. Sus autores y proveedores conservan sus propios derechos y condiciones. La presencia de un enlace no implica patrocinio ni respaldo.",
      ],
      [
        "Disponibilidad y errores",
        "Se procura mantener el portafolio funcionando, pero no se garantiza que esté siempre disponible, libre de errores o compatible con todos los dispositivos y navegadores. Los proyectos de demostración pueden cambiar o dejar de funcionar.",
      ],
      [
        "Límites razonables",
        "En la medida permitida por la normativa aplicable, el sitio se ofrece tal cual y no se garantiza que los ejemplos sean adecuados para un uso concreto. Esto no excluye responsabilidades que legalmente no puedan excluirse.",
      ],
      [
        "Actualizaciones",
        "El contenido y estos términos pueden cambiar para reflejar nuevas funciones, proyectos o requisitos aplicables.",
      ],
    ],
  ],
  cookies: [
    "Política de cookies y almacenamiento",
    [
      [
        "Cookies y almacenamiento no son lo mismo",
        "Una cookie es un mecanismo del navegador; localStorage y sessionStorage son mecanismos distintos de almacenamiento web. La política distingue estos mecanismos para describir con mayor precisión lo que hace el código.",
      ],
      [
        "Cookies propias",
        "En el código revisado no encontré una instrucción explícita que cree cookies propias ni una herramienta de publicidad o analítica que las instale. El navegador o el alojamiento pueden gestionar aspectos técnicos que no dependen directamente del código de esta página.",
      ],
      [
        "Almacenamiento local",
        "localStorage recuerda la posición de desplazamiento y el filtro de proyectos para ayudar a restaurar la vista al volver. Permanece hasta que se borre desde el navegador o el sitio lo cambie.",
      ],
      [
        "Almacenamiento de sesión",
        "sessionStorage recuerda si se mostró la pantalla de bienvenida y conserva temporalmente un listado de proyectos consultado desde GitHub. Los datos de sesión se eliminan normalmente al finalizar la sesión de navegación, según el comportamiento del navegador.",
      ],
      [
        "Servicios de terceros",
        "Google Fonts y la API de GitHub pueden recibir solicitudes cuando se carga la página o se consultan proyectos. Sus propios sitios y servicios se rigen por sus políticas y configuraciones; este portafolio no controla sus prácticas.",
      ],
      [
        "Cómo borrar o limitar estos datos",
        "Puedes borrar los datos del sitio desde los ajustes del navegador o usar controles de privacidad que este ofrezca. Si bloqueas almacenamiento o solicitudes externas, algunas funciones, tipografías o listados de proyectos podrían no funcionar como se espera.",
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
else window.addEventListener("load", () => setTimeout(quitarLoader, 2800));

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
    const maxTilt = 1.8;
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
  const visibles = PROYECTOS.filter(
    (p) => cat === "Todos" || p.categorias.includes(cat),
  );
  visibles.forEach((p, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.projectIndex = String(index + 1).padStart(2, "0");
    const media = document.createElement("div");
    media.className = "card-media";
    const indexBadge = Object.assign(document.createElement("span"), {
      className: "card-index",
      textContent: `PROYECTO ${String(index + 1).padStart(2, "0")}`,
    });
    const scanline = document.createElement("span");
    scanline.className = "card-scanline";
    scanline.setAttribute("aria-hidden", "true");
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
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const a = Object.assign(document.createElement("a"), {
      className: "btn primary btn-open",
      href: p.ruta,
      target: "_blank",
      rel: "noopener",
      textContent: "Abrir proyecto",
    });
    a.setAttribute("aria-label", `Abrir ${p.titulo} en una pestaña nueva`);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn secondary btn-copy";
    copyBtn.setAttribute("aria-label", `Copiar enlace directo de ${p.titulo}`);
    copyBtn.innerHTML = `<span class="btn-icon" aria-hidden="true">🔗</span><span class="btn-text">Copiar link</span>`;

    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const urlCompleta = new URL(p.ruta, window.location.href).href;
      let copiado = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(urlCompleta);
          copiado = true;
        } else {
          const temp = document.createElement("textarea");
          temp.value = urlCompleta;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          copiado = document.execCommand("copy");
          temp.remove();
        }
      } catch (err) {
        copiado = false;
      }

      if (!copiado) {
        if (window.SL_SYSTEM?.toast) {
          window.SL_SYSTEM.toast("No se pudo copiar automáticamente. Abre el proyecto para copiar su dirección.");
        }
        return;
      }

      if (window.SL_AUDIO) window.SL_AUDIO.play("reward");

      copyBtn.classList.add("copied");
      const textSpan = copyBtn.querySelector(".btn-text");
      const iconSpan = copyBtn.querySelector(".btn-icon");
      if (textSpan) textSpan.textContent = "¡Copiado!";
      if (iconSpan) iconSpan.textContent = "✔";

      if (window.SL_SYSTEM && window.SL_SYSTEM.toast) {
        window.SL_SYSTEM.toast(`[ RECOMPENSA: ENLACE COPIADO ] ${p.titulo}`);
      }

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (textSpan) textSpan.textContent = "Copiar link";
        if (iconSpan) iconSpan.textContent = "🔗";
      }, 2200);
    });

    actions.append(a, copyBtn);
    body.append(tags, h3, desc, actions);
    media.append(img, indexBadge, scanline);
    card.append(media, body);
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
      const cantidad =
        c === "Todos"
          ? PROYECTOS.length
          : PROYECTOS.filter((p) => p.categorias.includes(c)).length;
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.category = c;
      b.setAttribute("aria-label", `${c}: ${cantidad} proyectos`);
      const nombre = Object.assign(document.createElement("span"), {
        className: "filter-name",
        textContent: c,
      });
      const cuenta = Object.assign(document.createElement("span"), {
        className: "filter-count",
        textContent: cantidad,
      });
      cuenta.setAttribute("aria-hidden", "true");
      b.append(nombre, cuenta);
      b.setAttribute("aria-pressed", i === 0);
      b.addEventListener("click", () => {
        filtros
          .querySelectorAll("button")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
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
btn.addEventListener("click", () => {
  const abierto = links.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(abierto));
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
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
          .find((b) => b.dataset.category === g.cat)
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
  PROYECTOS = base
    .filter((p) =>
      p &&
      typeof p.titulo === "string" &&
      p.titulo.trim() &&
      typeof p.ruta === "string" &&
      p.ruta.trim() &&
      typeof p.descripcion === "string" &&
      Array.isArray(p.categorias || []),
    )
    .map((p) => ({
      ...p,
      categorias: Array.isArray(p.categorias) && p.categorias.length
        ? p.categorias.filter((c) => typeof c === "string" && c.trim())
        : ["Proyectos"],
    }));
}
cargarProyectos().finally(() => {
  armarFiltros();
  restaurar();
});
