// File: app/articles/page.tsx

// REMOVED "use client" - This is now a Server Component
import Link from "next/link"
import Image from "next/image"
import { LayoutGrid, CalendarDays, ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// --- NEW: Import the server action ---
import { getAllPublishedPosts } from "@/app/actions"

interface Post {
  id: string
  title: string
  content: string
  category: string
  image: string
  created_at: string
}

interface GroupedPosts {
  [category: string]: Post[]
}

const PLACEHOLDER_SNIPPET = "Coming soon..."

// The component is now an async Server Component
export default async function AllArticlesPage() {
  // Data is fetched securely on the server before the page is built
  const allPosts = await getAllPublishedPosts();

  const groupedPosts: GroupedPosts = allPosts.reduce((acc, post) => {
    const category = post.category || "Uncategorized"
    if (!acc[category]) acc[category] = []
    acc[category].push(post)
    return acc
  }, {} as GroupedPosts)

  const categories = Object.keys(groupedPosts).sort();
  const totalPublishedPosts = allPosts.length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#61E8E1] font-mono glow-text">All Articles</h1>
          <p className="text-lg text-[#AAAAAA] mt-2">
            Browse our collection of insights on AI, cybersecurity, and digital ethics.
          </p>
        </header>

        {totalPublishedPosts === 0 ? (
          <div className="text-center py-16">
            <LayoutGrid className="w-16 h-16 text-[#61E8E1]/50 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#EAEAEA] mb-2">No Articles Found</h2>
            <p className="text-[#AAAAAA]">
              There are currently no published articles. Please check back later.
            </p>
          </div>
        ) : (
          // Note: The Accordion now defaults to having all categories open
          <Accordion
            type="multiple"
            defaultValue={categories} // Default to all categories open
            className="w-full space-y-4"
          >
            {categories.map((category) => (
              <AccordionItem value={category} key={category} className="border-b-2 border-[#61E8E1]/30 last:border-b-0">
                <AccordionTrigger className="text-2xl sm:text-3xl font-bold text-[#61E8E1] font-mono py-4 glow-text hover:no-underline flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span>{category}</span>
                    <span className="text-base sm:text-lg text-[#AAAAAA] font-sans font-normal">
                      ({groupedPosts[category].length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {groupedPosts[category].map((post) => {
                      const snippet =
                        post.content && post.content.trim() !== ""
                          ? `${post.content.substring(0, 120)}...`
                          : PLACEHOLDER_SNIPPET;
                      return (
                        <Link href={`/posts/${post.id}`} key={post.id} className="group">
                          <div className="bg-[#1A1A1A] rounded-lg overflow-hidden glow-border hover:glow-border-intense hover:scale-103 transition-all duration-300 h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={
                                  post.image ||
                                  `/placeholder.svg?height=200&width=350&query=${encodeURIComponent(post.category) || "tech"}`
                                }
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                              <div className="flex justify-between items-center mb-2 text-xs text-[#AAAAAA]">
                                <div className="flex items-center">
                                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-[#61E8E1]" />
                                  {new Date(post.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                              <h3 className="text-base sm:text-lg font-semibold text-[#EAEAEA] mb-2 line-clamp-2 group-hover:text-[#61E8E1] transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#AAAAAA] line-clamp-3 mb-4 flex-grow">{snippet}</p>
                              <div className="mt-auto flex items-center text-[#61E8E1] font-semibold text-xs sm:text-sm group-hover:glow-text transition-all">
                                READ POST
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
    </div>
  )
}
