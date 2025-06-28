// File: app/admin/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Lock, Users, Newspaper } from "lucide-react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
// --- NEW: Import server actions ---
import { getSession, deletePost } from "@/app/actions"

// ... (Interface definitions for Post, User remain the same)
interface Post {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  createdAt: string;
  published: boolean;
}

interface User {
  username: string;
  role: "admin" | "user";
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const session = await getSession();
      if (session?.user?.role !== 'admin') {
        router.push("/auth/signin");
        return;
      }
      setUser(session.user);
      
      // Fetching can still use the browser client since RLS rules allow it for admins via service key on server actions
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, category, featured, created_at, published')
        .order('created_at', { ascending: false });
      
      if (postsError) console.error('Error fetching posts:', postsError);
      else setPosts(postsData || []);
      
      const { count, error: countError } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });
        
      if (countError) console.error('Error fetching subscriber count:', countError);
      else setSubscriberCount(count || 0);

      setIsLoading(false);
    };
    checkUserAndFetchData();
  }, [router, supabase]);

  // --- REWRITTEN deletePost LOGIC ---
  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      const result = await deletePost(id); // Call the server action

      if (result.error) {
        toast({
          title: "Error Deleting Post",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setPosts(posts.filter((post) => post.id !== id));
        toast({
          title: "Post Deleted",
          description: "The post has been successfully deleted.",
        });
      }
    }
  }

  // The JSX for this component remains the same, but the onClick for the delete button is updated.
  // Make sure the entire return statement is present and the onClick is updated as shown.
   if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Initializing Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    // This part should ideally not be reached due to the redirect in useEffect
    return <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">Access Denied</div>;
  }
  
  return (
     <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#61E8E1] font-mono">Admin Dashboard</h1>
          <Link href="/admin/create">
            <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1A1A1A] border-[#333] glow-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#AAAAAA]">Total Posts</CardTitle>
              <Newspaper className="h-5 w-5 text-[#61E8E1]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#EAEAEA]">{posts.length}</div>
              <p className="text-xs text-[#AAAAAA] pt-1">Manage all your articles from here.</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-[#333] glow-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#AAAAAA]">Newsletter Subscribers</CardTitle>
              <Users className="h-5 w-5 text-[#61E8E1]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#EAEAEA]">{subscriberCount}</div>
              <p className="text-xs text-[#AAAAAA] pt-1">Users subscribed for updates.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-[#61E8E1] font-mono mb-6">Manage Posts</h2>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-[#1A1A1A] border-[#333] glow-border hover:glow-border-intense transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-2">
                  <div>
                    <CardTitle className="text-[#EAEAEA] mb-1 sm:mb-2">{post.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1]">{post.category}</Badge>
                      {post.featured && <Badge className="bg-[#61E8E1] text-[#0D0D0D]">Featured</Badge>}
                      <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-[#61E8E1]/80 text-[#0D0D0D]" : "bg-[#333] text-[#AAAAAA]"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#AAAAAA]">Created: {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-start sm:self-auto mt-2 sm:mt-0">
                    <Link href={`/admin/edit/${post.id}`}>
                      <Button size="sm" variant="outline" className="border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]" aria-label={`Edit post: ${post.title}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => handleDeletePost(post.id)} // UPDATED THIS LINE
                      aria-label={`Delete post: ${post.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
