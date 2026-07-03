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

const partFmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", ...opts })

export default function ClockWeather() {
  const [now, setNow] = useState<Date | null>(null)
  const { data: clima } = useSWR<ClimaData | null>("/api/clima", fetcher, {
    refreshInterval: 600000,
    keepPreviousData: true,
  })

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const dateFmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  const timeFmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const hora = now ? parseInt(partFmt({ hour: "2-digit", hourCycle: "h23" }).format(now), 10) : -1
  const mes = now ? parseInt(partFmt({ month: "numeric" }).format(now), 10) : 0
  const dia = now ? parseInt(partFmt({ day: "2-digit" }).format(now), 10) : 0
  const evento = now ? eventoDeHoje(mes, dia) : null
  const isSnooze = now !== null && ehSnooze(hora)

  // Goiás (UTC-3, sem DST): nascer/pôr variam ~06h às ~18h ao longo do ano.
  // Faixa 6–18h cobre o ano com erro máx. ~45min nas bordas — imperceptível;
  // atende todos os casos noturnos (ex.: 20h) e diurnos claros.
  const ehDia = now === null || (hora >= 6 && hora < 18)

  const ClockIcon = isSnooze ? MoonStar : Clock
  const WeatherIcon = clima ? iconMap[resolveWeatherIcon(clima.icone, ehDia)] : Thermometer

  return (
    <div className="flex flex-col gap-1.5 min-h-[44px]">
      <p className="text-sm min-h-[20px] flex items-center gap-1.5">
        {!now ? (
          <span className="skeleton inline-block h-4 w-56 rounded" />
        ) : (
          <>
            <ClockIcon className="h-4 w-4 inline-block align-text-bottom" aria-hidden />
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
      <p className="text-sm min-h-[20px] flex items-center gap-1.5">
        {!clima ? (
          <span className="skeleton inline-block h-4 w-44 rounded" />
        ) : (
          <>
            <WeatherIcon className="h-4 w-4 inline-block align-text-bottom text-accent" aria-hidden />
            <span>{formatWeather(clima)}</span>
          </>
        )}
      </p>
    </div>
  )
}
