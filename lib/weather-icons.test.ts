import { describe, expect, it } from "vitest"
import {
  formatWeather,
  normalizarTemperatura,
  resolveWeatherIcon,
  temperatureDecoration,
  weatherIcon,
} from "./weather-icons"

describe("weatherIcon", () => {
  it("traduz o emoji do wttr.in para o ícone", () => {
    expect(weatherIcon("☀️")).toBe("sun")
    expect(weatherIcon("🌤️")).toBe("cloud-sun")
    expect(weatherIcon("🌧️")).toBe("cloud-rain")
    expect(weatherIcon("⛈")).toBe("cloud-lightning")
  })

  it("ignora espaços em volta do emoji", () => {
    expect(weatherIcon(" ⛅ ")).toBe("cloud-sun")
  })

  it("usa o termômetro para emoji desconhecido ou vazio", () => {
    expect(weatherIcon("🦄")).toBe("thermometer")
    expect(weatherIcon("")).toBe("thermometer")
  })
})

describe("resolveWeatherIcon", () => {
  it("mantém o ícone de dia", () => {
    expect(resolveWeatherIcon("☀️", true)).toBe("sun")
    expect(resolveWeatherIcon("⛅", true)).toBe("cloud-sun")
  })

  it("troca sol por lua à noite", () => {
    expect(resolveWeatherIcon("☀️", false)).toBe("moon")
    expect(resolveWeatherIcon("⛅", false)).toBe("cloud-moon")
  })

  it("não mexe em chuva, neblina e afins à noite", () => {
    expect(resolveWeatherIcon("🌧️", false)).toBe("cloud-rain")
    expect(resolveWeatherIcon("🌫️", false)).toBe("cloud-fog")
  })
})

describe("normalizarTemperatura", () => {
  it("mantém °C no formato com sinal", () => {
    expect(normalizarTemperatura("+21°C")).toBe("+21°C")
    expect(normalizarTemperatura("-3°C")).toBe("-3°C")
    expect(normalizarTemperatura("+21 °C")).toBe("+21°C")
  })

  it("converte °F para °C", () => {
    expect(normalizarTemperatura("+70°F")).toBe("+21°C")
    expect(normalizarTemperatura("32°F")).toBe("+0°C")
    expect(normalizarTemperatura("-40°F")).toBe("-40°C")
  })

  it("devolve o texto como veio quando não há número", () => {
    expect(normalizarTemperatura("")).toBe("")
    expect(normalizarTemperatura("sem dados")).toBe("sem dados")
  })
})

describe("temperatureDecoration", () => {
  it("põe fogo acima de 35 °C e floco de neve abaixo de 20 °C", () => {
    expect(temperatureDecoration("+36°C")).toBe("🔥 ")
    expect(temperatureDecoration("+19°C")).toBe("❄️ ")
  })

  it("não decora entre 20 °C e 35 °C", () => {
    expect(temperatureDecoration("+20°C")).toBe("")
    expect(temperatureDecoration("+35°C")).toBe("")
  })

  it("não decora sem número", () => {
    expect(temperatureDecoration("")).toBe("")
  })
})

describe("formatWeather", () => {
  const clima = { icone: "🌤️", temperatura: "+21°C", condicao: "Céu com nuvens", local: "Goiás" }

  it("monta a frase do clima sem o sinal de +", () => {
    expect(formatWeather(clima)).toBe("Atualmente está 21°C (Céu com nuvens) em Goiás.")
  })

  it("coloca a decoração no lugar do sinal", () => {
    expect(formatWeather({ ...clima, temperatura: "+37°C" })).toBe(
      "Atualmente está 🔥 37°C (Céu com nuvens) em Goiás."
    )
  })
})
