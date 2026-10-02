"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import {
  Clock,
  MoonStar,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  MapPin,
  Snowflake,
  Wind,
  Thermometer,
  type LucideIcon,
} from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import type { ClimaData } from "@/lib/types"
import { ehSnooze, eventoDeHoje } from "@/lib/events"
import { formatWeather, resolveWeatherIcon, type WeatherIconName } from "@/lib/weather-icons"

const iconMap: Record<WeatherIconName, LucideIcon> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  "cloud-lightning": CloudLightning,
  "cloud-snow": CloudSnow,
  "cloud-fog": CloudFog,
  snowflake: Snowflake,
  wind: Wind,
  thermometer: Thermometer,
  moon: Moon,
  "cloud-moon": CloudMoon,
}

// Formatadores criados uma vez só (o relógio redesenha a cada segundo).
const fuso = { timeZone: "America/Sao_Paulo" } as const
const dateFmt = new Intl.DateTimeFormat("pt-BR", { ...fuso, day: "2-digit", month: "long", year: "numeric" })
const timeFmt = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})
const horaFmt = new Intl.DateTimeFormat("en-US", { ...fuso, hour: "2-digit", hourCycle: "h23" })
const mesFmt = new Intl.DateTimeFormat("en-US", { ...fuso, month: "numeric" })
const diaFmt = new Intl.DateTimeFormat("en-US", { ...fuso, day: "2-digit" })

export default function ClockWeather() {
  const [now, setNow] = useState<Date | null>(null)
  const { data: clima, error: erroClima } = useSWR<ClimaData | null>("/api/clima", fetcher, {
    refreshInterval: 600000,
    keepPreviousData: true,
  })

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const hora = now ? parseInt(horaFmt.format(now), 10) : -1
  const mes = now ? parseInt(mesFmt.format(now), 10) : 0
  const dia = now ? parseInt(diaFmt.format(now), 10) : 0
  const evento = now ? eventoDeHoje(mes, dia) : null
  const isSnooze = now !== null && ehSnooze(hora)

  // Goiás (UTC-3, sem DST): nascer/pôr variam ~06h às ~18h ao longo do ano.
  // Faixa 6–18h cobre o ano com erro máx. ~45min nas bordas — imperceptível;
  // atende todos os casos noturnos (ex.: 20h) e diurnos claros.
  const ehDia = now === null || (hora >= 6 && hora < 18)

  // Sem resposta ainda → esqueleto. Se o clima não vier (API devolveu null ou falhou),
  // a linha mostra só o local, em vez de ficar carregando para sempre.
  const carregandoClima = clima === undefined && !erroClima

  const ClockIcon = isSnooze ? MoonStar : Clock
  const WeatherIcon = clima ? iconMap[resolveWeatherIcon(clima.icone, ehDia)] : MapPin

  return (
    <div className="flex flex-col gap-1.5 min-h-[44px]">
      <p className="text-sm min-h-[20px] flex items-start gap-1.5">
        {!now ? (
          <span className="skeleton inline-block h-4 w-56 rounded" />
        ) : (
          <>
            <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              {dateFmt.format(now)} • {timeFmt.format(now)}
              {evento && (
                <span className="ml-1">
                  — <strong>{evento.mensagem}</strong> {evento.icone}
                </span>
              )}
            </span>
          </>
        )}
      </p>
      <p className="text-sm min-h-[20px] flex items-start gap-1.5">
        {carregandoClima ? (
          <span className="skeleton inline-block h-4 w-44 rounded" />
        ) : (
          <>
            <WeatherIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>{clima ? formatWeather(clima) : "Goiás, Brasil"}</span>
          </>
        )}
      </p>
    </div>
  )
}
