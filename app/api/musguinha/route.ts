import { NextResponse } from "next/server"
import { LASTFM_USER, MUSGUINHA_ENDPOINT } from "@/lib/constants"
import { faixaDoLastfm, imagemSegura, linkSeguro, unixParaIso, urlRecentTracks, type LastfmRecentTracks } from "@/lib/lastfm"
import { DEFAULT_TRACK } from "@/lib/spotify-default"
import type { MusguinhaResponse, NowPlaying } from "@/lib/types"

// Cache do route handler (ISR): refresca no servidor a cada 10s.
export const revalidate = 10

const TIMEOUT_LASTFM_MS = 5000
// O backend legado demora ~6s (lrclib + Last.fm em série); 8s cobre com margem.
const TIMEOUT_LEGADO_MS = 8000

function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value === "true"
  return false
}

async function buscarJson<T>(url: string, timeoutMs: number): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // Alinha o cache do fetch ao do route (10s): a revalidação em background pega música fresca.
    next: { revalidate: 10 },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`${new URL(url).hostname} ${res.status}`)
  return (await res.json()) as T
}

/** Caminho preferido: direto no Last.fm (HTTPS, ~200ms), sem depender do servidor próprio. */
async function doLastfm(apiKey: string): Promise<NowPlaying | null> {
  const dados = await buscarJson<LastfmRecentTracks>(urlRecentTracks(LASTFM_USER, apiKey), TIMEOUT_LASTFM_MS)
  if (dados.error) throw new Error(`Last.fm erro ${dados.error}: ${dados.message ?? ""}`)
  return faixaDoLastfm(dados)
}

/** Caminho legado: backend próprio (link-in-bio-api), usado quando não há LASTFM_API_KEY na Vercel. */
async function doBackendLegado(): Promise<NowPlaying | null> {
  const data = await buscarJson<MusguinhaResponse>(MUSGUINHA_ENDPOINT, TIMEOUT_LEGADO_MS)
  if (!data?.nome) return null
  const isPlaying = toBool(data.tocandoAgora)
  return {
    isPlaying,
    nome: data.nome,
    artista: data.artista ?? "",
    // Validados: o payload vira href/src na página e o backend legado fala HTTP sem TLS.
    imagem: imagemSegura(data.imagem),
    link: linkSeguro(data.link),
    tocadaEm: isPlaying ? null : unixParaIso(data.dataHora),
  }
}

export async function GET() {
  try {
    const apiKey = process.env.LASTFM_API_KEY?.trim()
    const faixa = apiKey ? await doLastfm(apiKey) : await doBackendLegado()
    // Se vier vazio, degrada para o fallback estático (card nunca quebra).
    return NextResponse.json(faixa ?? DEFAULT_TRACK)
  } catch (erro) {
    // Backend offline/timeout: nunca 500 — devolve o fallback, mas deixa rastro no log da Vercel.
    console.warn("Música indisponível, usando o fallback:", erro instanceof Error ? erro.message : erro)
    return NextResponse.json(DEFAULT_TRACK, { status: 200 })
  }
}
