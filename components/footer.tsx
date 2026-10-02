import { Code, Heart } from "lucide-react"
import { PROFILE } from "@/lib/constants"

// Mesmo crédito do rodapé do mvms.dev (lá em inglês).
export default function Footer() {
  return (
    <footer className="mt-auto py-6 text-center text-sm">
      <p className="flex flex-wrap items-center justify-center gap-1.5">
        <Code className="h-4 w-4 shrink-0" aria-hidden />
        Desenvolvido com{" "}
        <Heart className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <span className="sr-only">amor </span>
        por{" "}
        <a
          href={PROFILE.site}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-heading underline-offset-[0.2em] hover:underline"
        >
          {PROFILE.nome}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </p>
    </footer>
  )
}
