"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
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
              "Artificial intelligence is rapidly transforming the landscape of cybersecurity, presenting both unprecedented opportunities for defense and sophisticated tools for attackers.\n\nCybercriminals are increasingly leveraging AI to automate and enhance their malicious activities. This includes the creation of highly convincing deepfakes for social engineering, AI-driven phishing campaigns that adapt to target defenses, and automated systems for discovering and exploiting vulnerabilities at scale.\n\nThe challenge for cybersecurity professionals lies in staying ahead of these evolving threats. This requires a deep understanding of how AI can be weaponized and, crucially, how it can be harnessed to build more resilient and adaptive defense mechanisms. AI-powered threat detection, anomaly identification, and automated incident response are becoming essential components of modern security architectures.",
            category: "CYBERSECURITY",
            featured: true,
            image: "/placeholder.svg?height=450&width=800",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            published: true,
          },
          {
            id: "2",
            title: "Ethical AI: Navigating the Moral Landscape",
            content:
              "As artificial intelligence becomes more deeply integrated into every facet of our lives, the ethical implications of its development and deployment demand careful consideration.\n\nKey ethical challenges include algorithmic bias, which can perpetuate and even amplify existing societal inequalities; the potential for significant job displacement as AI-driven automation becomes more capable; and the critical need for transparency and accountability in AI decision-making processes.\n\nDeveloping robust frameworks for ethical AI is not merely an academic exercise but a societal imperative. This involves fostering interdisciplinary collaboration, establishing clear guidelines for responsible innovation, and considering the role of regulation in safeguarding against unintended consequences. The goal is to ensure that AI serves humanity beneficially and equitably.",
            category: "AI ETHICS",
            featured: true,
            image: "/placeholder.svg?height=450&width=800",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            published: true,
          },
        ]
      }

      const foundPost = allPosts.find((p) => p.id === params.id)
      setPost(foundPost || null)
    }
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading Post...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-4">Post Not Found</h1>
          <p className="text-[#AAAAAA] mb-8">The post you are looking for does not exist or could not be loaded.</p>
          <Button onClick={() => router.push("/")} className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 md:mb-8 text-[#61E8E1] hover:text-[#4DD4D4] hover:bg-transparent px-0 flex items-center group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back to Articles</span>
          </Button>

          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] font-mono mb-4 glow-text leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-t border-[#61E8E1]/50 py-3">
                <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1] text-sm font-mono px-3 py-1">
                  {post.category}
                </Badge>
                <p className="text-sm text-[#AAAAAA]">
                  Published on{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </header>

            {post.image && (
              <div className="relative w-full aspect-[16/9] mb-8 md:mb-10 rounded-lg overflow-hidden glow-border">
                <Image
                  src={post.image || "/placeholder.svg?height=450&width=800&query=default+post+image"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none text-[#EAEAEA] space-y-6 selection:bg-[#61E8E1] selection:text-[#0D0D0D]"
              style={
                {
                  "--tw-prose-headings": "#61E8E1",
                  "--tw-prose-links": "#61E8E1",
                  "--tw-prose-bullets": "#61E8E1",
                  "--tw-prose-quotes": "#AAAAAA",
                  "--tw-prose-quote-borders": "#333333",
                  "--tw-prose-hr": "#333333",
                  lineHeight: "1.7", // Improved line height for readability
                } as React.CSSProperties
              }
            >
              {post.content.split("\n\n").map(
                (
                  paragraphBlock,
                  index, // Split by double newline for paragraphs
                ) => (
                  <div key={index} className="space-y-4">
                    {paragraphBlock.split("\n").map(
                      (
                        paragraph,
                        pIndex, // Split by single newline for line breaks within a block
                      ) => (
                        <p key={pIndex}>{paragraph}</p>
                      ),
                    )}
                  </div>
                ),
              )}
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
