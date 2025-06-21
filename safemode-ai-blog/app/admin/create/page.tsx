"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { PostEditor } from "@/components/post-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

interface User {
  username: string
  role: "admin" | "user"
  signedInAt: string
}

export default function CreatePost() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("safemode-user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)

      if (userData.role !== "admin") {
        router.push("/")
        return
      }
    } else {
      router.push("/auth/signin")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleSave = (postData: any) => {
    const savedPosts = localStorage.getItem("safemode-posts")
    const posts = savedPosts ? JSON.parse(savedPosts) : []

    const newPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    posts.push(newPost)
    localStorage.setItem("safemode-posts", JSON.stringify(posts))

    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="bg-[#1A1A1A] border-[#333] glow-border max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-[#61E8E1] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#61E8E1] mb-4">Access Denied</h1>
              <p className="text-[#AAAAAA] mb-6">You need administrator privileges to create posts.</p>
              <Link href="/auth/signin">
                <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Sign In as Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Create New Post</h1>
        <PostEditor onSave={handleSave} />
      </main>
    </div>
  )
}
