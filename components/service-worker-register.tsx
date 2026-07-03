"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignora falha de registro — SW é opcional
      })
    }
    register()
    window.addEventListener("load", register)
    return () => window.removeEventListener("load", register)
  }, [])

  return null
}
