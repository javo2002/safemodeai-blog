"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { getSession, updatePost } from "@/app/actions"

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  featured: boolean;
  image: string;
  createdAt: string;
  published: boolean;
  sources?: string[];
}

interface User {
  username: string;
  role: "admin" | "user";
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
      if (session?.user?.role !== 'admin') {
        router.push("/auth/signin");
        return;
      }
      setUser(session.user);

      const { data: postData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error", description: "Could not fetch post data.", variant: "destructive" });
        setPost(null);
      } else {
        setPost(postData);
      }
      setIsLoading(false);
    };
    checkUserAndFetchPost();
  }, [params.id, router, supabase, toast])

  const handleSave = async (postData: Omit<Post, "id" | "createdAt">) => {
    setIsSaving(true);
    const result = await updatePost(params.id, postData);

    if (result?.error) {
        toast({
          title: "Error Updating Post",
          description: result.error,
          variant: "destructive",
        });
        setIsSaving(false); // Stop loading only if there's an error
    }
    // No need to handle success, as the server action redirects automatically
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">Access Denied</div>;
  }
  if (!post) {
    return <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">Post not found</div>;
  }
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Edit Post</h1>
        <PostEditor initialData={post} onSave={handleSave} isSaving={isSaving} />
      </main>
    </div>
  );
}
