"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  text: string
  className?: string
  speed?: number
  /** Mostra o cursor piscando logo depois do texto digitado. */
  cursor?: boolean
  /**
   * Reserva desde o início o espaço do texto completo, para nada abaixo pular
   * enquanto ele é digitado (evita layout shift quando o texto quebra linha).
   */
  reservarEspaco?: boolean
}

// Mesmo componente do mvms.dev: o leitor de tela recebe o texto inteiro de uma vez
// (e ele já vem no HTML), enquanto a animação fica só para quem vê.
export default function Typewriter({
  text,
  className = "",
  speed = 50,
  cursor = false,
  reservarEspaco = false,
}: Props) {
  const [shown, setShown] = useState("")
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      // Usuário pediu p/ reduzir movimento: mostra o texto completo no mount.
      // setState síncrono é inevitável aqui (lazy state quebraria a hidratação).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(text)
      return
    }
    const id = window.setInterval(() => {
      idx.current += 1
      setShown(text.slice(0, idx.current))
      if (idx.current >= text.length) window.clearInterval(id)
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])

  const marcador = cursor ? (
    <span className="logo-cursor ml-[5px] inline-block h-4 w-2 rounded-[1px] bg-accent align-[-0.1em]" />
  ) : null

  if (!reservarEspaco) {
    return (
      <span className={className}>
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {shown}
          {marcador}
        </span>
      </span>
    )
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible">
        {text}
        {cursor ? <span className="ml-[5px] inline-block w-2" /> : null}
      </span>
      <span aria-hidden className="absolute inset-0">
        {shown}
        {marcador}
      </span>
    </span>
  )
}
