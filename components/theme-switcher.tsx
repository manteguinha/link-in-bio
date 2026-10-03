"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Gate de mount: evita mismatch SSR/client ao ler resolvedTheme (padrão next-themes).
  // precisa de setState síncrono no mount — não há alternativa safe p/ hidratação.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  // Sincroniza <meta theme-color> com o tema resolvido (PWA/standalone iOS e status bar).
  // O layout gera uma meta por esquema do sistema (media light/dark); as duas precisam
  // mudar, senão quem está no sistema escuro e escolhe o tema claro fica com a barra escura.
  useEffect(() => {
    if (!resolvedTheme) return
    const cor = resolvedTheme === "light" ? "#ffffff" : "#292a2d"
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", cor))
  }, [resolvedTheme])

  const isLight = mounted && resolvedTheme === "light"
  // Como no mvms.dev: o nome diz o que o clique faz, e o botão ocupa o trilho inteiro.
  const rotulo = !mounted ? "Alternar tema" : isLight ? "Mudar para o tema escuro" : "Mudar para o tema claro"

  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="group relative mx-auto my-1 flex h-8 w-16 cursor-pointer items-center rounded-full"
    >
      <span
        aria-hidden
        className="block h-6 w-16 rounded-full border border-switch-border bg-switch-track backdrop-blur-[4px]"
      />
      <span
        aria-hidden
        className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-text text-bg transition-[left,outline-color] duration-200 group-hover:outline-8 group-hover:outline-hover-ring"
        style={{ left: isLight ? "50%" : "0%" }}
      >
        {mounted ? isLight ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  )
}
