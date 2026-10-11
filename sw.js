const CACHE_NAME = "devcarlos-pwa-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=neon-scrollbar-1",
  "./main.js?v=legal-policy-1",
  "./sl-effects.js?v=no-xp-no-toasts-1",
  "./proyectos.json",
  "./manifest.webmanifest",
  "./assets/img/app-icon.svg",
  "./assets/img/avatar.jpg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache =>
    cache.addAll(CORE_ASSETS.map(path => new Request(path, { cache: "reload" })))
      .catch(() => cache.add("./").catch(() => {}))
  ).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key.startsWith("devcarlos-pwa-") && key !== CACHE_NAME).map(key => caches.delete(key)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match("./index.html"))));
    return;
  }
  if (url.pathname.endsWith("/proyectos.json") || url.pathname.endsWith("/styles.css") || url.pathname.endsWith("/main.js") || url.pathname.endsWith("/sl-effects.js") || url.pathname.endsWith(".svg") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".png")) {
    event.respondWith(caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      });
      return cached || network.catch(() => Response.error());
    }));
  }
});
