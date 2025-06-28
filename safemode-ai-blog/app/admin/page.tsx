"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Lock, Users, Newspaper, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { getSession, deletePost, approvePost, submitForApproval } from "@/app/actions"

interface Post {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
  status: 'draft' | 'pending_approval' | 'published';
  user_id: string;
}

interface User {
  id: string;
  username: string;
  role: "super-admin" | "author";
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const session = await getSession();
      if (!session?.user) {
        router.push("/auth/signin");
        return;
      }
      setUser(session.user);

      let query = supabase.from('posts').select('*');
      
      // Super-admin sees all posts, authors see only their own.
      if (session.user.role === 'author') {
        query = query.eq('user_id', session.user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error", description: "Could not fetch posts.", variant: "destructive" });
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };
    checkUserAndFetchData();
  }, [router, supabase, toast]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const result = await deletePost(id);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        setPosts(posts.filter((p) => p.id !== id));
        toast({ title: "Success", description: "Post deleted." });
      }
    }
  };

  const handleApproval = async (id: string) => {
      const result = await approvePost(id);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'published' } : p));
        toast({ title: "Success", description: "Post has been published." });
      }
  };

    const handleSubmitForApproval = async (id: string) => {
      const result = await submitForApproval(id);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'pending_approval' } : p));
        toast({ title: "Success", description: "Post submitted for approval." });
      }
  };

  const pendingPosts = posts.filter(p => p.status === 'pending_approval');
  const myPosts = user?.role === 'author' ? posts : posts.filter(p => p.user_id === user?.id);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#61E8E1] font-mono">Admin Dashboard</h1>
          <Link href="/admin/create">
            <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Create New Post
            </Button>
          </Link>
        </div>

        {/* Approval Queue for Super Admin */}
        {user.role === 'super-admin' && pendingPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#61E8E1] font-mono mb-6">Approval Queue</h2>
            {pendingPosts.map(post => (
              <Card key={post.id} className="bg-[#1A1A1A] border-[#333] mb-4">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <Badge variant="secondary">Pending Approval</Badge>
                  </div>
                  <Button onClick={() => handleApproval(post.id)} size="sm" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />Approve
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* My Posts Section */}
        <div>
           <h2 className="text-2xl font-bold text-[#61E8E1] font-mono mb-6">
                {user.role === 'super-admin' ? "All Posts" : "My Posts"}
            </h2>
            <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="bg-[#1A1A1A] border-[#333]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#EAEAEA] mb-2">{post.title}</CardTitle>
                        <div className="flex gap-2 items-center">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? "bg-green-500" : "bg-yellow-500"}>
                                {post.status.replace('_', ' ')}
                            </Badge>
                             {post.status === 'draft' && (
                                <Button onClick={() => handleSubmitForApproval(post.id)} size="sm" variant="outline" className="border-yellow-500 text-yellow-500">
                                    <Clock className="w-4 h-4 mr-2" /> Submit for Approval
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit/${post.id}`}><Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button></Link>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            </div>
        </div>
      </main>
    </div>
  );
}
