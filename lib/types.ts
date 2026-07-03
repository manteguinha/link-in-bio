// Resposta bruta do backend em 144.22.176.161:3987/musguinha.
export type MusguinhaResponse = {
  nome: string
  artista: string
  album: string
  imagem: string // last.fm album cover (host lastfm.freetls.fastly.net)
  link: string // last.fm track url
  dataHora: string // unix seconds (string)
  tocandoAgora: boolean // booleano no backend (o script antigo comparava com 'true' string — bug)
  letra: string
  letraSincronizada: string // LRC
  albumInfo: string
  duracao: number // seconds
}

// Payload normalizado que a API route expõe ao cliente.
export type NowPlaying = {
  isPlaying: boolean
  nome: string
  artista: string
  imagem: string
  link: string
}

export type ClimaData = {
  icone: string // emoji wttr.in (ex.: "☀️")
  temperatura: string // ex. "+21°C"
  condicao: string // ex. "Clear"
  local: string // ex. "Goiás"
}
