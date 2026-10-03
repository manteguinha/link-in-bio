import { describe, expect, it } from "vitest"
import { tempoRelativo } from "./time"

const AGORA = Date.parse("2026-10-03T15:00:00Z")
const antes = (ms: number) => new Date(AGORA - ms).toISOString()

describe("tempoRelativo", () => {
  it("fala 'agora mesmo' para menos de um minuto", () => {
    expect(tempoRelativo(antes(0), AGORA)).toBe("agora mesmo")
    expect(tempoRelativo(antes(59_000), AGORA)).toBe("agora mesmo")
  })

  it("conta minutos, horas e dias em português", () => {
    expect(tempoRelativo(antes(60_000), AGORA)).toBe("há 1 minuto")
    expect(tempoRelativo(antes(5 * 60_000), AGORA)).toBe("há 5 minutos")
    expect(tempoRelativo(antes(2 * 3_600_000), AGORA)).toBe("há 2 horas")
    expect(tempoRelativo(antes(26 * 3_600_000), AGORA)).toBe("ontem")
    expect(tempoRelativo(antes(3 * 86_400_000), AGORA)).toBe("há 3 dias")
  })

  it("devolve null para datas inválidas ou no futuro", () => {
    expect(tempoRelativo("não é data", AGORA)).toBeNull()
    expect(tempoRelativo(new Date(AGORA + 60_000).toISOString(), AGORA)).toBeNull()
  })
})
