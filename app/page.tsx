import Profile from "@/components/profile"
import ThemeSwitcher from "@/components/theme-switcher"
import ShareButton from "@/components/share-button"
import ClockWeather from "@/components/clock-weather"
import NavLinks from "@/components/nav-links"
import SpotifyCard from "@/components/spotify-card"
import SocialMedia from "@/components/social-media"
import Footer from "@/components/footer"
import JsonLd from "@/components/json-ld"
import { jsonLdDaPagina } from "@/lib/seo"

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[588px] flex-col px-6 pt-14 sm:pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <main>
        <JsonLd dados={jsonLdDaPagina()} />
        {/* Primeiro no código para vir primeiro no Tab: no celular ele fica no topo da tela. */}
        <ShareButton />
        <Profile />
        <ThemeSwitcher />
        <section className="py-6">
          <ClockWeather />
        </section>
        <NavLinks />
        <section className="pb-6">
          <SpotifyCard />
        </section>
        <SocialMedia />
      </main>
      <Footer />
    </div>
  )
}
