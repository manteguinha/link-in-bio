import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marcos Vinicius | MVMS",
    short_name: "MVMS",
    description: "Página de links do Marcos Vinicius",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#292a2d",
    theme_color: "#292a2d",
    lang: "pt-BR",
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
