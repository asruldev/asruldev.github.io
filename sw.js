const staticJitak = "jitak"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticJitak).then(cache => {
      cache.addAll(assets)
    })
  )
})