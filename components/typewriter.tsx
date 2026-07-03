"use client"

import { useEffect, useRef, useState } from "react"
import { PROFILE } from "@/lib/constants"

export default function Typewriter() {
  const full = PROFILE.bio
  const [text, setText] = useState("")
  const idx = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      // Usuário pediu p/ reduzir movimento: mostra o texto completo no mount.
      // setState síncrono é inevitável aqui (lazy state quebraria a hidratação).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(full)
      return
    }
    const id = window.setInterval(() => {
      idx.current += 1
      setText(full.slice(0, idx.current))
      if (idx.current >= full.length) window.clearInterval(id)
    }, 50)
    return () => window.clearInterval(id)
  }, [full])

  return <span className="font-mono text-sm">{text}</span>
}
