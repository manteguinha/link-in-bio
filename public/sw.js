// Service worker manual mínimo, seguindo o guia oficial do Next.js para PWAs.
// Network-first para navegação, cache-first (stale-while-revalidate) para assets estáticos.
// Trocar o nome do cache apaga o anterior na ativação (o "mvms-v1" guardava respostas da API).
const CACHE = "bio-v3"
const SHELL = ["/"]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {})
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // não cacheia cross-origin

  // Clima, música e dados do React (RSC) vão sempre à rede: servidos do cache, mostrariam
  // a resposta da visita anterior (o SWR da página já cuida de atualizar).
  if (url.pathname.startsWith("/api/") || url.searchParams.has("_rsc") || req.headers.has("RSC")) return

  if (req.mode === "navigate") {
    // network-first para HTML
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          // waitUntil: o navegador não encerra o worker antes de terminar de gravar.
          event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
          return res
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    )
    return
  }

  // stale-while-revalidate para assets
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone()
            event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
