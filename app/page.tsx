import Profile from "@/components/profile"
import ThemeSwitcher from "@/components/theme-switcher"
import ShareButton from "@/components/share-button"
import ClockWeather from "@/components/clock-weather"
import NavLinks from "@/components/nav-links"
import SpotifyCard from "@/components/spotify-card"
import SocialMedia from "@/components/social-media"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[588px] flex-col px-6 pt-14 sm:justify-center sm:pt-[calc(env(safe-area-inset-top)+1.5rem)]">
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
      <Footer />
      <ShareButton />
    </main>
  )
}
