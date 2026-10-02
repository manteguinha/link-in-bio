import { REDES_SOCIAIS } from "@/lib/constants"
import { BrandIcon } from "./icons/brand"

export default function SocialMedia() {
  return (
    <nav aria-label="Redes sociais" className="flex justify-center gap-1 py-6">
      {REDES_SOCIAIS.map((rede) => (
        <a
          key={rede.href}
          href={rede.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${rede.label} de Marcos Vinicius (abre em nova aba)`}
          title={rede.label}
          className="flex h-14 w-14 items-center justify-center rounded-full transition hover:bg-hover-ring motion-safe:hover:scale-110"
        >
          <BrandIcon name={rede.icon} className="h-6 w-6" />
        </a>
      ))}
    </nav>
  )
}
