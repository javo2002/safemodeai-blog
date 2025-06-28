"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getSession, createPost } from "@/app/actions"

interface PostEditorData {
  title: string
  content: string
  category: string
  featured: boolean
  image: string
  published: boolean
  sources?: string[]
}

export default function CreatePost() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
        const session = await getSession();
        if (session?.user && session.user.role === 'admin') {
            setUser(session.user);
        } else {
            router.push("/auth/signin");
        }
        setIsLoading(false);
    };
    checkUser();
  }, [router])

  const handleSave = async (postData: PostEditorData) => {
    setIsSaving(true);
    const result = await createPost(postData);

    if (result?.error) {
      toast({
        title: "Error Creating Post",
        description: result.error,
        variant: "destructive",
      });
      setIsSaving(false); // Stop loading only if there's an error
    }
    // No need to handle success, as the server action redirects automatically
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading...</div>
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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Create New Post</h1>
        <PostEditor onSave={handleSave} isSaving={isSaving} />
      </main>
    </div>
  )
}
