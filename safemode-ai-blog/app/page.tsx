import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedPosts } from "@/components/featured-posts"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPosts />
      </main>
    </div>
  )
}
