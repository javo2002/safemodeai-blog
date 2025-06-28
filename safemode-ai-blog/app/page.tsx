// File: app/page.tsx

import { HeroSection } from "@/components/hero-section";
import { FeaturedPosts } from "@/components/featured-posts";
import { getFeaturedPosts } from "@/app/actions"; // Import the server action

// The homepage is now an async Server Component
export default async function HomePage() {
  // Fetch the data on the server before rendering
  const featuredPosts = await getFeaturedPosts();

  return (
    <main>
      <HeroSection />
      {/* Pass the fetched data as a prop to the display component */}
      <FeaturedPosts posts={featuredPosts} />
    </main>
  );
}
