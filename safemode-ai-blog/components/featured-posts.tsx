"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface Post {
  id: string
  title: string
  content: string
  category: string
  image: string
  createdAt: string
}

const PLACEHOLDER_SNIPPET = "Coming soon..."

export function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, category, image, createdAt')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching featured posts:", error);
      } else {
        setPosts(data);
      }
    };
    fetchFeaturedPosts();
  }, [supabase])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5)
      setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 5)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)
      return () => {
        container.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [posts])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Featured Posts</h2>
          <div className="text-center py-12">
            <p className="text-[#AAAAAA] text-lg">No featured posts available yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto relative">
        <h2 className="text-3xl font-bold text-[#61E8E1] font-mono mb-10">Featured Posts</h2>
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post) => {
            const snippet =
              post.content && post.content.trim() !== "" ? `${post.content.substring(0, 100)}...` : PLACEHOLDER_SNIPPET
            return (
              <Link href={`/posts/${post.id}`} key={post.id} className="flex-none w-72 sm:w-80 group">
                <div className="bg-[#1A1A1A] rounded-lg overflow-hidden glow-border hover:glow-border-intense hover:scale-103 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg?height=200&width=400&query=abstract+tech+pattern"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <Badge
                        variant="outline"
                        className="border-[#61E8E1] text-[#61E8E1] text-xs font-mono px-2 py-0.5"
                      >
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-[#AAAAAA]">
                        <CalendarDays className="w-3 h-3 mr-1.5 text-[#61E8E1]" />
                        {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#EAEAEA] mb-3 line-clamp-2 group-hover:text-[#61E8E1] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#AAAAAA] line-clamp-2 mb-4 flex-grow">{snippet}</p>
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
        <Button
          variant="ghost"
          size="icon"
          className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-[#0D0D0D]/80 border border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D] transition-all duration-300 rounded-full w-8 h-8 sm:w-10 sm:h-10 ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-[#0D0D0D]/80 border border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D] transition-all duration-300 rounded-full w-8 h-8 sm:w-10 sm:h-10 ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </section>
  )
}
