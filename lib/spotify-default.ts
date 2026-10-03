import type { NowPlaying } from "./types"

// Fallback estático quando o backend de música está offline ou nada está tocando.
export const DEFAULT_TRACK: NowPlaying = {
  isPlaying: false,
  nome: "Back in Black",
  artista: "AC/DC",
  imagem: "/img/acdc.webp",
  link: "https://www.last.fm/music/AC%2FDC",
  tocadaEm: null,
}
