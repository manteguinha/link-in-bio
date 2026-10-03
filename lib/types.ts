// Resposta bruta do backend legado (link-in-bio-api, /musguinha).
export type MusguinhaResponse = {
  nome: string
  artista: string
  album: string
  imagem: string | null // capa do álbum no last.fm (host lastfm.freetls.fastly.net); null sem capa
  link: string // last.fm track url
  dataHora: string | false // unix seconds (string); false enquanto toca
  tocandoAgora: boolean | string // boolean na API nova; a antiga repassava a string "true" do Last.fm
  letra: string | null
  letraSincronizada: string | null // LRC
  albumInfo: string | null
  duracao: number | null // seconds
}

// Payload normalizado que a API route expõe ao cliente.
export type NowPlaying = {
  isPlaying: boolean
  nome: string
  artista: string
  imagem: string
  link: string
  /** Quando a música foi ouvida (ISO 8601); null enquanto toca ou quando não se sabe. */
  tocadaEm: string | null
}

export type ClimaData = {
  icone: string // emoji wttr.in (ex.: "☀️")
  temperatura: string // ex. "+21°C"
  condicao: string // ex. "Clear"
  local: string // ex. "Goiás"
}
