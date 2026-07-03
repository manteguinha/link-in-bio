import { NextResponse } from "next/server"
import { MUSGUINHA_ENDPOINT } from "@/lib/constants"
import { DEFAULT_TRACK } from "@/lib/spotify-default"
import type { MusguinhaResponse, NowPlaying } from "@/lib/types"

// Cache do route handler (ISR): refresca no servidor a cada 10s.
export const revalidate = 10

function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value === "true"
  return false
}

export async function GET() {
  try {
    // Backend demora ~6s p/ responder (validado empiricamente); 3s abortava e caía
    // no fallback mesmo com música tocando. 8s cobre com margem de segurança.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let res: Response
    try {
      res = await fetch(MUSGUINHA_ENDPOINT, {
        headers: { Accept: "application/json" },
        // ISR: a resposta da route é cacheada 10s (revalidate = 10 acima). Este fetch
        // também alinha o cache em 10s → a revalidação em background pega música fresca.
        next: { revalidate: 10 },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) throw new Error(`backend ${res.status}`)
    const data = (await res.json()) as MusguinhaResponse

    const payload: NowPlaying = {
      isPlaying: toBool(data.tocandoAgora),
      nome: data.nome ?? "",
      artista: data.artista ?? "",
      imagem: data.imagem ?? DEFAULT_TRACK.imagem,
      link: data.link ?? DEFAULT_TRACK.link,
    }

    // Se vier vazio, degrada para o fallback estático (card nunca quebra).
    if (!payload.nome) return NextResponse.json(DEFAULT_TRACK)
    return NextResponse.json(payload)
  } catch {
    // Backend offline/timeout: nunca 500 — devolve o fallback.
    return NextResponse.json(DEFAULT_TRACK, { status: 200 })
  }
}
