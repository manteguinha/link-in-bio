"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Spotify } from "@/components/icons/brand"
import type { NowPlaying } from "@/lib/types"
import { DEFAULT_TRACK } from "@/lib/spotify-default"

function EqBars() {
  return (
    <span className="ml-1 inline-flex items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="eq-bar w-[2px] bg-spotify"
          style={{ height: 10, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function SpotifyCard() {
  const { data } = useSWR<NowPlaying>("/api/musguinha", fetcher, {
    refreshInterval: 10000,
    keepPreviousData: true,
  })

  const track = data ?? DEFAULT_TRACK

  return (
    <a
      href={track.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir ${track.nome} de ${track.artista}`}
      className="group flex h-[90px] w-full items-center rounded-[10px] border-none bg-card p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_0_15px_0_rgba(0,0,0,0.65)]"
    >
      {/* <img> simples: a capa vem do lastfm (host externo); next/image aqui só adicionaria config p/ ganho marginais — decisão do plano. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track.imagem}
        alt={`Capa do álbum de ${track.nome}`}
        loading="lazy"
        className="m-1 h-[74px] w-[74px] flex-none rounded-[8px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="ml-2 flex min-w-0 flex-1 flex-col justify-center">
        <h2 className="truncate text-sm font-medium text-white">{track.nome}</h2>
        <p className="truncate text-[11px] text-white opacity-60">{track.artista}</p>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-white opacity-60">
          <Spotify className="h-3 w-3 text-spotify" aria-hidden />
          <span>{track.isPlaying ? "Ouvindo agora no Spotify" : "Última tocada no Spotify"}</span>
          {track.isPlaying && <EqBars />}
        </div>
      </div>
      <Spotify className="mr-3 h-5 w-5 flex-none text-spotify" aria-hidden />
    </a>
  )
}
