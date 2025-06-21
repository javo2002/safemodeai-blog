"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Lock } from "lucide-react"
import Link from "next/link"

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

interface User {
  username: string
  role: "admin" | "user"
  signedInAt: string
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

    const savedPosts = localStorage.getItem("safemode-posts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    setIsLoading(false)
  }, [router])

  const deletePost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id)
    setPosts(updatedPosts)
    localStorage.setItem("safemode-posts", JSON.stringify(updatedPosts))
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
              <p className="text-[#AAAAAA] mb-6">You need administrator privileges to access this page.</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#61E8E1] font-mono">Admin Dashboard</h1>
          <Link href="/admin/create">
            <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {posts.length === 0 ? (
            <Card className="bg-[#1A1A1A] border-[#333] glow-border">
              <CardContent className="p-8 text-center">
                <p className="text-[#EAEAEA] mb-4">No posts created yet.</p>
                <Link href="/admin/create">
                  <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Create Your First Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="bg-[#1A1A1A] border-[#333] glow-border hover:glow-border-intense transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#EAEAEA] mb-2">{post.title}</CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1]">
                          {post.category}
                        </Badge>
                        {post.featured && <Badge className="bg-[#61E8E1] text-[#0D0D0D]">Featured</Badge>}
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#AAAAAA]">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit/${post.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
