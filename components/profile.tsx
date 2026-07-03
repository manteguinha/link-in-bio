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
        priority
        className="mx-auto h-28 w-28 rounded-full"
      />
      <h1 className="mt-2 text-xl font-bold">{PROFILE.nome}</h1>
      <div className="mt-1 flex items-center justify-center">
        <Typewriter />
        <span className="logo-cursor ml-1 inline-block h-4 w-2 rounded-[1px] bg-accent" aria-hidden />
      </div>
    </section>
  )
}
