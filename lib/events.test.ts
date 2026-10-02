import { describe, expect, it } from "vitest"
import { ehSnooze, eventoDeHoje } from "./events"

describe("eventoDeHoje", () => {
  it("encontra o Natal e o Ano Novo", () => {
    expect(eventoDeHoje(12, 25)?.mensagem).toBe("Feliz Natal!")
    expect(eventoDeHoje(1, 1)?.mensagem).toBe("Feliz Ano Novo!")
  })

  it("não devolve nada em dias comuns", () => {
    expect(eventoDeHoje(10, 2)).toBeNull()
  })
})

describe("ehSnooze", () => {
  it("vale da meia-noite até antes das 6h", () => {
    expect(ehSnooze(0)).toBe(true)
    expect(ehSnooze(5)).toBe(true)
  })

  it("não vale a partir das 6h", () => {
    expect(ehSnooze(6)).toBe(false)
    expect(ehSnooze(23)).toBe(false)
  })
})
