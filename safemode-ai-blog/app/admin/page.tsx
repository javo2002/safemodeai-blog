"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { getSession, deletePost, approvePost, submitForApproval } from "@/app/actions"

interface Post {
  id: string;
  title: string;
  category: string;
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

      // --- CORRECTED LOGIC ---
      // This query now fetches ALL posts. RLS policies will handle security.
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, category, status, user_id') // Fetch only necessary data for the dashboard
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error", description: "Could not fetch posts.", variant: "destructive" });
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };
    checkUserAndFetchData();
  }, [router, supabase, toast]);

  const handleDelete = async (id: string, authorId: string) => {
    // Client-side check for non-super-admins
    if (user?.role === 'author' && user.id !== authorId) {
        toast({ title: "Permission Denied", description: "You can only delete your own posts.", variant: "destructive" });
        return;
    }
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
  
  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
        case 'published':
            return <Badge className="bg-green-600 text-white">Published</Badge>;
        case 'pending_approval':
            return <Badge className="bg-yellow-500 text-black">Pending Approval</Badge>;
        case 'draft':
            return <Badge variant="secondary">Draft</Badge>;
    }
  }

  if (isLoading) return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center"><p className="text-[#61E8E1] animate-pulse">Initializing Dashboard...</p></div>;
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
            <h2 className="text-2xl font-bold text-red-400 font-mono mb-6">Approval Queue ({pendingPosts.length})</h2>
            {pendingPosts.map(post => (
              <Card key={post.id} className="bg-[#1A1A1A] border-red-400/50 mb-4">
                <CardHeader className="flex flex-row justify-between items-center p-4">
                  <p className="font-semibold text-white">{post.title}</p>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/edit/${post.id}`}><Button size="sm" variant="outline">Review & Edit</Button></Link>
                    <Button onClick={() => handleApproval(post.id)} size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />Approve
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* All Posts Section */}
        <div>
           <h2 className="text-2xl font-bold text-[#61E8E1] font-mono mb-6">All Posts</h2>
            <div className="grid gap-4">
            {posts.map((post) => {
              const isOwner = post.user_id === user.id;
              const canEdit = isOwner || user.role === 'super-admin';

              return (
              <Card key={post.id} className="bg-[#1A1A1A] border-[#333]">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold text-lg text-white">{post.title}</p>
                        <div className="flex gap-2 items-center">
                            {getStatusBadge(post.status)}
                             {post.status === 'draft' && isOwner && (
                                <Button onClick={() => handleSubmitForApproval(post.id)} size="sm" variant="outline" className="border-yellow-500 text-yellow-500 h-7">
                                    <Clock className="w-3 h-3 mr-2" /> Submit for Approval
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {canEdit && <Link href={`/admin/edit/${post.id}`}><Button size="sm" variant="outline" className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button></Link>}
                      {canEdit && <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleDelete(post.id, post.user_id)}><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )})}
            </div>
        </div>
      </main>
    </div>
  );
}
