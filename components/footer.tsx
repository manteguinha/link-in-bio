import { Code, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto py-6 text-center text-sm">
      <p className="flex items-center justify-center gap-1.5">
        <Code className="h-4 w-4" aria-hidden /> Desenvolvido com{" "}
        <Heart className="h-4 w-4 text-accent" aria-hidden /> por{" "}
        <a
          href="https://mvms.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
        >
          Marcos Vinicius
        </a>
      </p>
    </footer>
  )
}
