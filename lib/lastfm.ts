import { DEFAULT_TRACK } from "./spotify-default"
import type { NowPlaying } from "./types"

/** Trecho da resposta de user.getRecentTracks que a página usa. */
export type LastfmTrack = {
  name?: string
  artist?: { "#text"?: string; name?: string }
  album?: { "#text"?: string }
  url?: string
  image?: { size?: string; "#text"?: string }[]
  date?: { uts?: string }
  "@attr"?: { nowplaying?: string }
}

export type LastfmRecentTracks = {
  recenttracks?: { track?: LastfmTrack[] | LastfmTrack }
  error?: number
  message?: string
}

/** Imagem que o Last.fm manda quando o álbum não tem capa (uma estrela cinza). */
const CAPA_PADRAO_LASTFM = "2a96cbd8b46e442fc41c2b86b821562f"

// Só aceitamos links e capas desses domínios: o payload vem de fora e vira href/src na página.
const HOSTS_LINK = new Set(["www.last.fm", "last.fm"])
const HOSTS_IMAGEM = new Set(["lastfm.freetls.fastly.net"])

export function urlRecentTracks(usuario: string, apiKey: string): string {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user: usuario,
    api_key: apiKey,
    format: "json",
    limit: "1",
  }).toString()
  return url.toString()
}

function urlSegura(valor: unknown, hosts: Set<string>): string | null {
  if (typeof valor !== "string" || !valor) return null
  try {
    const url = new URL(valor)
    return url.protocol === "https:" && hosts.has(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

/** Link da faixa no Last.fm, ou o do fallback se vier vazio/estranho. */
export function linkSeguro(valor: unknown): string {
  return urlSegura(valor, HOSTS_LINK) ?? DEFAULT_TRACK.link
}

/** Capa do álbum, ou a imagem do fallback se não houver capa de verdade. */
export function imagemSegura(valor: unknown): string {
  const url = urlSegura(valor, HOSTS_IMAGEM)
  return url && !url.includes(CAPA_PADRAO_LASTFM) ? url : DEFAULT_TRACK.imagem
}

/** Melhor capa disponível (extralarge > large > …) ou null. */
export function escolherImagem(imagens: LastfmTrack["image"]): string | null {
  if (!Array.isArray(imagens)) return null
  for (const tamanho of ["extralarge", "large", "medium", "small"]) {
    const url = imagens.find((i) => i?.size === tamanho)?.["#text"]?.trim()
    if (url) return url
  }
  return null
}

/** "1700000000" (segundos Unix) → ISO 8601; null se inválido. */
export function unixParaIso(uts: unknown): string | null {
  const segundos = typeof uts === "string" || typeof uts === "number" ? Number(uts) : NaN
  if (!Number.isFinite(segundos) || segundos <= 0) return null
  return new Date(segundos * 1000).toISOString()
}

/** Faixa mais recente do Last.fm já no formato da página; null se o usuário não ouviu nada. */
export function faixaDoLastfm(resposta: LastfmRecentTracks): NowPlaying | null {
  const lista = resposta?.recenttracks?.track
  const faixa = Array.isArray(lista) ? lista[0] : lista
  if (!faixa?.name) return null
  const isPlaying = faixa["@attr"]?.nowplaying === "true"
  return {
    isPlaying,
    nome: faixa.name,
    artista: faixa.artist?.["#text"] ?? faixa.artist?.name ?? "",
    imagem: imagemSegura(escolherImagem(faixa.image)),
    link: linkSeguro(faixa.url),
    tocadaEm: isPlaying ? null : unixParaIso(faixa.date?.uts),
  }
}
