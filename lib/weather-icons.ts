import type { ClimaData } from "./types"

export type WeatherIconName =
  | "sun"
  | "cloud-sun"
  | "cloud"
  | "cloud-rain"
  | "cloud-lightning"
  | "cloud-snow"
  | "snowflake"
  | "cloud-fog"
  | "wind"
  | "thermometer"
  | "moon"
  | "cloud-moon"

const emojiToIcon: Record<string, WeatherIconName> = {
  "☀️": "sun",
  "🌞": "sun",
  "🌤️": "cloud-sun",
  "⛅": "cloud-sun",
  "🌥️": "cloud-sun",
  "☁️": "cloud",
  "☁": "cloud",
  "🌦️": "cloud-rain",
  "🌦": "cloud-rain",
  "🌧️": "cloud-rain",
  "🌧": "cloud-rain",
  "⛈️": "cloud-lightning",
  "⛈": "cloud-lightning",
  "🌩️": "cloud-lightning",
  "🌩": "cloud-lightning",
  "🌨️": "cloud-snow",
  "🌨": "cloud-snow",
  "❄️": "snowflake",
  "❄": "snowflake",
  "🌫️": "cloud-fog",
  "🌫": "cloud-fog",
  "🌬️": "wind",
  "🌬": "wind",
}

export function weatherIcon(emoji: string): WeatherIconName {
  const trimmed = (emoji ?? "").trim()
  return emojiToIcon[trimmed] ?? "thermometer"
}

// wttr.in (%c) devolve o mesmo emoji (sol) de dia e de noite — não diferencia.
// Sobrescreve à noite p/ exibir lua: "sol"→"lua", "sol+nuvens"→"lua+nuvens".
// Condições nubladas/chuvosas continuam iguais (o dia/noite não muda o símbolo).
// `ehDia` vem do relógio local (America/Sao_Paulo); faixa 6–18h cobre Goiás o ano todo
// (nascer/pôr variam ~06h às ~18h, erro máx. ~45min nas bordas — imperceptível).
const NIGHT_OVERRIDE: Partial<Record<WeatherIconName, WeatherIconName>> = {
  sun: "moon",
  "cloud-sun": "cloud-moon",
}

export function resolveWeatherIcon(emoji: string, ehDia: boolean): WeatherIconName {
  const base = weatherIcon(emoji)
  if (ehDia) return base
  return NIGHT_OVERRIDE[base] ?? base
}

/**
 * Normaliza a string de temperatura para °C no formato "+21°C"/"-3°C".
 * O wttr.in serve °F quando o request parte de IPs dos EUA (datacenters da
 * Vercel, mesmo via pt.wttr.in). Sem normalização, `temperatureDecoration`
 * compararia o número bruto com limiares Celsius (35/20), erroneamente exibindo
 * 🔥 em 70°F (≈21°C). Aqui garantimos °C sempre, convertendo quando preciso.
 */
export function normalizarTemperatura(raw: string): string {
  const m = raw.match(/(-?\d+)\s*°?\s*([CF])?/i)
  if (!m) return raw
  let valor = parseInt(m[1], 10)
  const un = (m[2] ?? "").toUpperCase()
  if (un === "F") valor = Math.round(((valor - 32) * 5) / 9)
  const sinal = valor >= 0 ? "+" : ""
  return `${sinal}${valor}°C`
}

/** Decoração de temperatura: 🔥 >35°C, ❄️ <20°C. */
export function temperatureDecoration(temperatura: string): string {
  const match = temperatura.match(/-?\d+/)
  if (!match) return ""
  const graus = parseInt(match[0], 10)
  if (graus > 35) return "🔥 "
  if (graus < 20) return "❄️ "
  return ""
}

/** Texto pronto do clima, ex.: "Atualmente está +21°C (Clear) em Goiás." */
export function formatWeather(data: ClimaData): string {
  const dec = temperatureDecoration(data.temperatura)
  const temp = data.temperatura.replace("+", dec)
  return `Atualmente está ${temp} (${data.condicao}) em ${data.local}.`
}
