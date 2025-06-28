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
  title: string;
  content: string;
  category: string;
  featured: boolean;
  image: string;
  published: boolean;
  sources?: string[];
}

interface User {
  username: string;
  role: "super-admin" | "author";
}

export default function CreatePost() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start in a loading state
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      // If no session or user is not an admin/super-admin, redirect.
      if (!session?.user || !['author', 'super-admin'].includes(session.user.role)) {
        router.push("/auth/signin");
      } else {
        // If the user is valid, set the user and stop loading.
        setUser(session.user);
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]); // Dependency array is correct.

  const handleSave = async (postData: PostEditorData) => {
    setIsSaving(true);
    const result = await createPost(postData);

    if (result?.error) {
      toast({
        title: "Error Creating Post",
        description: result.error,
        variant: "destructive",
      });
      setIsSaving(false);
    }
    // Redirect is handled by the server action on success.
  };

  // While checking the session, show a loading indicator.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Verifying Access...</div>
        </div>
      </div>
    );
  }
  
  // If loading is finished and there's still no user, it's a true access denied.
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
                <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // If loading is complete and the user is valid, render the editor.
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Create New Post</h1>
        <PostEditor onSave={handleSave} isSaving={isSaving} />
      </main>
    </div>
  );
}
