"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
    // Registra uma vez só, depois que a página carregou (não concorre com os assets da primeira pintura).
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignora falha de registro — SW é opcional
      })
    }
    if (document.readyState === "complete") {
      register()
      return
    }
    window.addEventListener("load", register, { once: true })
    return () => window.removeEventListener("load", register)
  }, [])

  return null
}
