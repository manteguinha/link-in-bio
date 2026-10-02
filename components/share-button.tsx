"use client"

import { useState } from "react"
import { Share } from "lucide-react"
import { SITE } from "@/lib/constants"

export default function ShareButton() {
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    window.setTimeout(() => setToast(false), 2000)
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: SITE.title, url: SITE.url })
        return
      }
      await navigator.clipboard.writeText(SITE.url)
      showToast()
    } catch (err) {
      // AbortError = cancelamento do usuário → não é erro.
      if (err instanceof DOMException && err.name === "AbortError") return
      try {
        await navigator.clipboard.writeText(SITE.url)
        showToast()
      } catch {
        // sem clipboard nem Web Share → nada a fazer
      }
    }
  }

  return (
    <div
      className="fixed right-4 z-20 md:hidden"
      style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
    >
      <button
        type="button"
        onClick={share}
        aria-label="Compartilhar perfil"
        title="Compartilhar perfil"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-share-bg text-bg transition hover:outline-[8px] hover:outline-hover-ring"
      >
        <Share className="h-3.5 w-3.5" aria-hidden />
      </button>
      {/* Sempre no DOM para o leitor de tela anunciar quando o texto aparece. */}
      <span
        role="status"
        className={
          toast
            ? "absolute right-10 top-0 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            : "sr-only"
        }
      >
        {toast ? "Link copiado!" : null}
      </span>
    </div>
  )
}
