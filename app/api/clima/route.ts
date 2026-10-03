import { NextResponse } from "next/server"
import { CLIMA_ENDPOINT } from "@/lib/constants"
import { normalizarTemperatura } from "@/lib/weather-icons"
import type { ClimaData } from "@/lib/types"

// Clima: cache de 10min → no máximo ~6 chamadas/hora ao wttr.in (reliability).
export const revalidate = 600

export async function GET() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    let res: Response
    try {
      res = await fetch(CLIMA_ENDPOINT, {
        headers: { "User-Agent": "curl/8.0", Accept: "text/plain" },
        next: { revalidate: 600 },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) throw new Error(`wttr ${res.status}`)
    const text = await res.text()
    const lines = text.trim().split("\n").map((l) => l.trim())

    const data: ClimaData = {
      icone: lines[0] ?? "",
      // Força °C: o wttr.in pode servir °F conforme a geo do request (ver normalizarTemperatura).
      temperatura: normalizarTemperatura(lines[1] ?? ""),
      condicao: lines[2] ?? "",
      local: lines[3] ?? "",
    }

    // Sem temperatura em °C ou com HTML no lugar do texto (erro do wttr.in servido como 200)
    // → null, e o cliente mostra o estado neutro em vez de lixo.
    if (!/^[+-]?\d+°C$/.test(data.temperatura) || !data.condicao || /[<>]/.test(text)) {
      return NextResponse.json(null, { status: 200 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}
