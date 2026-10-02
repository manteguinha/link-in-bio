import Image from "next/image"
import { PROFILE } from "@/lib/constants"
import Typewriter from "./typewriter"

export default function Profile() {
  return (
    <section className="relative py-6 text-center">
      <Image
        src={PROFILE.avatarUrl}
        alt={`Foto de ${PROFILE.nome}`}
        width={112}
        height={112}
        preload
        className="mx-auto h-28 w-28 rounded-full"
      />
      <h1 className="mt-2 text-xl font-bold text-heading">{PROFILE.nome}</h1>
      <p className="mt-1 font-mono text-sm font-medium">
        <Typewriter text={PROFILE.bio} cursor reservarEspaco />
      </p>
    </section>
  )
}
