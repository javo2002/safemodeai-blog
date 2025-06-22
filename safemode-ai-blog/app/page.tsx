import { HeroSection } from "@/components/hero-section"
import { FeaturedPosts } from "@/components/featured-posts"

export default function HomePage() {
  return (
    // The wrapping div is no longer needed since the layout handles it.
    <main>
      <HeroSection />
      <FeaturedPosts />
    </main>
  )
}
