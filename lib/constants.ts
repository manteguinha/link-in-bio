export const PROFILE = {
  nome: "Marcos Vinicius",
  bio: "//Maybe, perhaps, I don't know",
  // GitHub user id 63943591 (manteguinha). ?s=224 for 2x of the 112px display size.
  avatarUrl: "https://avatars.githubusercontent.com/u/63943591?v=4&s=224",
  url: "https://bio.mvms.dev",
  // Site pessoal (mvms.dev redireciona para o www; o link já vai direto).
  site: "https://www.mvms.dev",
} as const

export const SITE = {
  title: "Marcos Vinicius | MVMS",
  description: "//Maybe, perhaps, I don't know",
  author: "Marcos Vinicius",
  url: "https://bio.mvms.dev",
  siteName: "MVMS",
} as const

export const LINK_PRINCIPAL = {
  label: "Descubra Minha Jornada",
  href: PROFILE.site,
} as const

export type RedeSocial = {
  label: string
  href: string
  icon: "github" | "linkedin" | "instagram" | "x"
}

export const REDES_SOCIAIS: RedeSocial[] = [
  { label: "GitHub", href: "https://github.com/manteguinha", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/manteguinha", icon: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/marcosvinicius.zip", icon: "instagram" },
  { label: "X", href: "https://x.com/manteguinhaaa", icon: "x" },
] as const

// Backend da música (HTTP — chamado server-side na route handler).
export const MUSGUINHA_ENDPOINT = "http://144.22.176.161:3987/musguinha"
// wttr.in em PORTUGUÊS (subdomínio pt.) — traduz a condição ("Clear"→"Limpo") e mantém o acento de "Goiás".
// 4 linhas: emoji(%c), temperatura(%t), condição(%C), local(%l).
// &m força unidades métricas (°C) — por IP o wttr.in serve °F quando o request
// vem de datacenters dos EUA (ex.: Vercel); mesmo assim a route ainda normaliza
// como rede de segurança (ver normalizarTemperatura em weather-icons).
export const CLIMA_ENDPOINT =
  "https://pt.wttr.in/Goi%C3%A1s?format=%25c%0A%25t%0A%25C%0A%25l&m"
