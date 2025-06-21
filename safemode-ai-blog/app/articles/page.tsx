"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { ArrowRight, CalendarDays, LayoutGrid } from "lucide-react" // Removed ChevronUp, ChevronDown
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Post {
  id: string
  title: string
  content: string
  category: string
  featured: boolean
  image: string
  createdAt: string
  published: boolean
}

interface GroupedPosts {
  [category: string]: Post[]
}

export default function AllArticlesPage() {
  const [groupedPosts, setGroupedPosts] = useState<GroupedPosts>({})
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [openCategories, setOpenCategories] = useState<string[]>([])

  useEffect(() => {
    const savedPosts = localStorage.getItem("safemode-posts")
    let allPosts: Post[] = []

    if (savedPosts) {
      allPosts = JSON.parse(savedPosts)
    } else {
      // Fallback to demo data if no posts in localStorage
      allPosts = [
        {
          id: "1",
          title: "The Rise of AI-Powered Cyber Threats",
          content:
            "Exploring how artificial intelligence is being weaponized by cybercriminals. This includes deepfakes, AI-driven phishing attacks, and automated vulnerability discovery...",
          category: "CYBERSECURITY",
          featured: true,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          published: true,
        },
        {
          id: "2",
          title: "Ethical AI: Navigating the Moral Landscape",
          content:
            "Understanding the ethical implications of AI development is paramount. This post discusses bias in AI algorithms, job displacement due to automation...",
          category: "AI ETHICS",
          featured: true,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          published: true,
        },
        {
          id: "3",
          title: "Machine Learning in Threat Detection",
          content: "How ML algorithms are revolutionizing cybersecurity...",
          category: "THREAT ANALYSIS",
          featured: true,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date().toISOString(),
          published: true,
        },
        {
          id: "4",
          title: "The Future of Digital Privacy in the AI Era",
          content: "Examining privacy challenges in the age of AI and big data...",
          category: "PRIVACY",
          featured: true,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date(Date.now() + 86400000).toISOString(),
          published: true,
        },
        {
          id: "5",
          title: "Advanced Persistent Threats (APTs) and AI",
          content: "How AI is changing the game for both attackers and defenders when it comes to APTs.",
          category: "CYBERSECURITY",
          featured: false,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          published: true,
        },
        {
          id: "6",
          title: "Bias Mitigation in AI Models",
          content: "Strategies and techniques for identifying and reducing bias in machine learning models.",
          category: "AI ETHICS",
          featured: false,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          published: true,
        },
        {
          id: "7",
          title: "Unpublished Draft Post Example",
          content: "This post should not appear on the All Articles page.",
          category: "DRAFTS",
          featured: false,
          image: "/placeholder.svg?height=200&width=350",
          createdAt: new Date().toISOString(),
          published: false, // This post is not published
        },
      ]
      if (!savedPosts) {
        localStorage.setItem("safemode-posts", JSON.stringify(allPosts))
      }
    }

    const publishedPosts = allPosts.filter((post) => post.published)

    const groups: GroupedPosts = publishedPosts.reduce((acc, post) => {
      const category = post.category || "Uncategorized"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(post)
      return acc
    }, {} as GroupedPosts)

    for (const category in groups) {
      groups[category].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    const sortedCategories = Object.keys(groups).sort()
    setGroupedPosts(groups)
    setCategories(sortedCategories)

    if (sortedCategories.length > 0) {
      setOpenCategories([sortedCategories[0]])
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading Articles...</div>
        </div>
      </div>
    )
  }

  const totalPublishedPosts = Object.values(groupedPosts).reduce((sum, posts) => sum + posts.length, 0)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
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
              There are currently no published articles. Please check back later or create some in the admin panel.
            </p>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={openCategories}
            onValueChange={setOpenCategories}
            className="w-full space-y-4"
          >
            {categories.map((category) => (
              <AccordionItem value={category} key={category} className="border-b-2 border-[#61E8E1]/30 last:border-b-0">
                <AccordionTrigger className="text-3xl font-bold text-[#61E8E1] font-mono py-4 glow-text hover:no-underline flex justify-between items-center w-full">
                  {/* Content for the left side of the trigger */}
                  <div className="flex items-center gap-4">
                    <span>{category}</span>
                    <span className="text-lg text-[#AAAAAA] font-sans font-normal">
                      ({groupedPosts[category].length})
                    </span>
                  </div>
                  {/* The default ChevronDown icon from shadcn/ui (h-4 w-4) will be automatically added here by the AccordionTrigger component and will rotate.
                      The `justify-between` on AccordionTrigger pushes this icon to the right.
                      The class `[&[data-state=open]>svg]:rotate-180` is part of the default AccordionTrigger styling.
                  */}
                </AccordionTrigger>
                <AccordionContent className="pt-6 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {groupedPosts[category].map((post) => (
                      <Link href={`/posts/${post.id}`} key={post.id} className="group">
                        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden glow-border hover:glow-border-intense hover:scale-103 transition-all duration-300 h-full flex flex-col">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={
                                post.image ||
                                `/placeholder.svg?height=200&width=350&query=${encodeURIComponent(post.category) || "/placeholder.svg"}`
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
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2 line-clamp-2 group-hover:text-[#61E8E1] transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-sm text-[#AAAAAA] line-clamp-3 mb-4 flex-grow">
                              {post.content.substring(0, 120)}...
                            </p>

                            <div className="mt-auto flex items-center text-[#61E8E1] font-semibold text-sm group-hover:glow-text transition-all">
                              READ POST
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
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
