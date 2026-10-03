import { afterEach, describe, expect, it, vi } from "vitest"
import { GET } from "./route"

const texto = (corpo: string, status = 200) => new Response(corpo, { status })

describe("GET /api/clima", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("converte as 4 linhas do wttr.in e força °C", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => texto("🌦️\n+70°F\nChuva fraca\nGoiás")))
    expect(await (await GET()).json()).toEqual({
      icone: "🌦️",
      temperatura: "+21°C",
      condicao: "Chuva fraca",
      local: "Goiás",
    })
  })

  it("devolve null quando o wttr.in responde erro ou HTML em vez do texto", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => texto("<html><body>Unknown location</body></html>")))
    expect(await (await GET()).json()).toBeNull()

    vi.stubGlobal("fetch", vi.fn(async () => texto("erro", 503)))
    expect(await (await GET()).json()).toBeNull()

    vi.stubGlobal("fetch", vi.fn(async () => texto("Sorry, we are running out of queries")))
    expect(await (await GET()).json()).toBeNull()
  })
})
