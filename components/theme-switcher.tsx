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
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute("content", resolvedTheme === "light" ? "#ffffff" : "#292a2d")
    }
  }, [resolvedTheme])

  const isLight = mounted && resolvedTheme === "light"

  return (
    <div className="relative mx-auto my-1 flex h-6 w-16 items-center">
      <span
        className="block h-6 w-16 rounded-full border backdrop-blur-[4px]"
        style={{ backgroundColor: "var(--switch-track)", borderColor: "var(--switch-border)" }}
        aria-hidden
      />
      <button
        type="button"
        aria-label="Alternar tema"
        aria-pressed={isLight}
        title="Alternar tema"
        onClick={() => setTheme(isLight ? "dark" : "light")}
        className="absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-[left] duration-200"
        style={{
          left: isLight ? "50%" : "0%",
          backgroundColor: "var(--text)",
          color: "var(--bg)",
        }}
      >
        {mounted ? (
          isLight ? (
            <Sun className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Moon className="h-3.5 w-3.5" aria-hidden />
          )
        ) : null}
      </button>
    </div>
  )
}
