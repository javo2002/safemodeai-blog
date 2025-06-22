"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { getSession } from "@/app/actions"

interface Post {
  id: string
  title: string
  content: string
  category: string
  featured: boolean
  image: string
  createdAt: string
  published: boolean
  sources?: string[]
}

interface User {
  username: string
  role: "admin" | "user"
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const checkUserAndFetchPost = async () => {
      const session = await getSession();
      if (session?.user && session.user.role === 'admin') {
        setUser(session.user);

        const { data: postData, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          setPost(null);
        } else {
          setPost(postData);
        }
      } else {
        router.push("/auth/signin");
      }
      setIsLoading(false);
    };
    checkUserAndFetchPost();
  }, [params.id, router, supabase])

  const handleSave = async (postData: Omit<Post, "id" | "createdAt">) => {
    setIsSaving(true)
    
    // REMOVED the manual updated_at from the update object
    const { error } = await supabase
      .from('posts')
      .update({
        title: postData.title,
        content: postData.content,
        category: postData.category,
        featured: postData.featured,
        image: postData.image,
        published: postData.published,
        sources: postData.sources,
      })
      .eq('id', params.id);
    
    setIsSaving(false)

    if (error) {
      toast({
        title: "Error Updating Post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post Updated!",
        description: "Your changes have been saved successfully.",
        className: "bg-[#1A1A1A] text-[#61E8E1] border-[#61E8E1]",
      });
      router.push("/admin");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
        <main className="container mx-auto px-4 py-16">
          <Card className="bg-[#1A1A1A] border-[#333] glow-border max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-[#61E8E1] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#61E8E1] mb-4">Access Denied</h1>
              <p className="text-[#AAAAAA] mb-6">You need administrator privileges to edit posts.</p>
              <Link href="/auth/signin">
                <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Sign In as Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#61E8E1] mb-4">Post Not Found</h1>
            <p className="text-[#AAAAAA] mb-6">The post you're looking for doesn't exist.</p>
            <Link href="/admin">
              <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Edit Post</h1>
        <PostEditor initialData={post} onSave={handleSave} isSaving={isSaving} />
      </main>
    </div>
  )
}
