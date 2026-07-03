import { NextResponse } from "next/server"
import { CLIMA_ENDPOINT } from "@/lib/constants"
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
      temperatura: lines[1] ?? "",
      condicao: lines[2] ?? "",
      local: lines[3] ?? "",
    }

    // Sem dados úteis → null (cliente mostra estado neutro).
    if (!data.condicao && !data.temperatura) {
      return NextResponse.json(null, { status: 200 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}
