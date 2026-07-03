import { LINK_PRINCIPAL } from "@/lib/constants"

export default function NavLinks() {
  return (
    <ul className="flex list-none flex-col gap-4 py-6">
      <li>
        <a
          href={LINK_PRINCIPAL.href}
          target="_blank"
          rel="noopener noreferrer"
          className="fade-up flex items-center justify-center rounded-lg bg-link-bg px-6 py-4 font-medium text-link-text backdrop-blur-[4px] transition-colors hover:bg-black/60"
        >
          {LINK_PRINCIPAL.label}
        </a>
      </li>
    </ul>
  )
}
