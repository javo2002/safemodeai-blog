"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface Post {
  id: string
  title: string
  content: string
  category: string
  image: string
  createdAt: string
  sources?: string[]
}

const PLACEHOLDER_CONTENT = "Coming soon..."

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchPost = async () => {
      if (params.id) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          console.error("Error fetching post:", error);
          setPost(null);
        } else {
          setPost(data);
        }
      }
      setIsLoading(false)
    }
    fetchPost()
  }, [params.id, supabase])

  const isURL = (str: string) => {
    try {
      new URL(str)
      return true
    } catch (_) {
      return false
    }
  }

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

  const displayContent = post.content && post.content.trim() !== "" ? post.content : PLACEHOLDER_CONTENT

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
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
                  lineHeight: "1.7",
                } as React.CSSProperties
              }
            >
              {displayContent === PLACEHOLDER_CONTENT ? (
                <div className="flex items-center justify-center text-center py-10 bg-[#1A1A1A]/50 rounded-md glow-border">
                  <Clock className="w-8 h-8 mr-3 text-[#61E8E1]" />
                  <p className="text-2xl font-mono text-[#61E8E1]">{PLACEHOLDER_CONTENT}</p>
                </div>
              ) : (
                displayContent.split("\n\n").map((paragraphBlock, index) => (
                  <div key={index} className="space-y-4">
                    {paragraphBlock.split("\n").map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                ))
              )}
            </div>

            {post.sources && post.sources.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#61E8E1]/30">
                <h2 className="text-2xl font-bold text-[#61E8E1] font-mono mb-4 glow-text">Sources</h2>
                <ul className="space-y-2 list-none pl-0">
                  {post.sources.map((source, index) => (
                    <li key={index} className="text-sm text-[#AAAAAA] flex items-start">
                      <LinkIcon className="w-4 h-4 mr-2 mt-1 text-[#61E8E1] flex-shrink-0" />
                      {isURL(source) ? (
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#61E8E1] hover:underline break-all"
                        >
                          {source}
                        </a>
                      ) : (
                        <span>{source}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  )
}
