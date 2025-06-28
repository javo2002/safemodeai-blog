import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Link as LinkIcon, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPostForPreview, approvePost, getSession } from "@/app/actions";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// This is an async Server Component
export default async function PostPreviewPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const post = await getPostForPreview(params.id);

  // If no post is found or the user is not logged in, redirect them
  if (!post || !session?.user) {
    return redirect("/admin");
  }

  const user = session.user;

  // Server action to handle approval from the preview page
  async function handleApprove() {
    "use server";
    if (user?.role === 'super-admin') {
      await approvePost(post.id);
      revalidatePath('/admin');
      redirect('/admin');
    }
  }
  
  const isURL = (str: string) => {
    try { new URL(str); return true; } catch (_) { return false; }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      {/* Admin Preview Bar */}
      <div className="bg-[#1A1A1A] border-b border-yellow-400/50 py-3 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-yellow-400 font-bold">ADMIN PREVIEW MODE</p>
            <p className="text-sm text-gray-400">You are viewing this post as it will appear when published.</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/edit/${post.id}`}>
              <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
            </Link>
            {user.role === 'super-admin' && post.status === 'pending_approval' && (
              <form action={handleApprove}>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />Approve & Publish
                </Button>
              </form>
            )}
            <Link href="/admin">
                <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article content starts here */}
          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] font-mono mb-4 glow-text leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-t border-[#61E8E1]/50 py-3">
                <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1] text-sm font-mono px-3 py-1">
                  {post.category}
                </Badge>
                <div className="text-sm text-[#AAAAAA]">
                  <span>Author: {post.users?.username || 'Unknown'}</span> | <span>
                  Published on:{" "}
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  </span>
                </div>
              </div>
            </header>

            {post.image && (
              <div className="relative w-full aspect-[16/9] mb-8 md:mb-10 rounded-lg overflow-hidden glow-border">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none text-[#EAEAEA] space-y-6"
              style={{ "--tw-prose-headings": "#61E8E1", "--tw-prose-links": "#61E8E1", "--tw-prose-bullets": "#61E8E1", lineHeight: "1.7" } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

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
  );
}

