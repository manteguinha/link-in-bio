import type { ComponentType } from "react"
import GitHub from "./github"
import LinkedIn from "./linkedin"
import Instagram from "./instagram"
import X from "./x"
import Spotify from "./spotify"
import type { RedeSocial } from "@/lib/constants"

const map: Record<RedeSocial["icon"], ComponentType<{ className?: string }>> = {
  github: GitHub,
  linkedin: LinkedIn,
  instagram: Instagram,
  x: X,
}

export function BrandIcon({
  name,
  className,
}: {
  name: RedeSocial["icon"]
  className?: string
}) {
  const Cmp = map[name]
  return <Cmp className={className} />
}

export { Spotify }
