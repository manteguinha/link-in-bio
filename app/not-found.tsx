import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Página não encontrada",
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[588px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="mt-2 text-muted">A página que você procura foi movida, removida ou nunca existiu.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-link-bg px-4 py-3 font-medium text-link-text transition-colors hover:bg-black/60"
      >
        Voltar para o início
      </Link>
    </main>
  )
}
