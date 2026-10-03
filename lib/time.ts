const fmt = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" })

const UNIDADES: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
]

/**
 * "há 5 minutos", "há 2 horas", "ontem"… a partir de uma data ISO.
 * Devolve "agora mesmo" para menos de um minuto e null para datas inválidas ou futuras.
 */
export function tempoRelativo(iso: string, agora: number = Date.now()): string | null {
  const instante = Date.parse(iso)
  if (!Number.isFinite(instante)) return null
  const diff = agora - instante
  if (diff < 0) return null
  if (diff < 60_000) return "agora mesmo"
  for (const [unidade, ms] of UNIDADES) {
    if (diff >= ms) return fmt.format(-Math.floor(diff / ms), unidade)
  }
  return null
}
