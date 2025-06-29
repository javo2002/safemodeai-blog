import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Link as LinkIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedPostById } from "@/app/actions";
import Link from "next/link";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPublishedPostById(params.id);

  if (!post) {
    return redirect("/");
  }

  const isURL = (str: string) => {
    try { new URL(str); return true; } catch (_) { return false; }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/articles">
            <Button variant="ghost" className="mb-6 md:mb-8 text-[#61E8E1] hover:text-[#4DD4D4] hover:bg-transparent px-0 flex items-center group">
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">Back to Articles</span>
            </Button>
          </Link>

          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] font-mono mb-4 glow-text leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-t border-[#61E8E1]/50 py-3">
                <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1] text-sm font-mono px-3 py-1">
                  {post.category}
                </Badge>
                <div className="text-sm text-[#AAAAAA] flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><User className="w-4 h-4"/>{post.users?.username || 'SafemodeAI'}</div>
                    <span>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
            </header>

            {post.image && (
              <div className="relative w-full aspect-[16/9] mb-8 md:mb-10 rounded-lg overflow-hidden glow-border">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority/>
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
                      {isURL(source) ? ( <a href={source} target="_blank" rel="noopener noreferrer" className="hover:text-[#61E8E1] hover:underline break-all">{source}</a>) : (<span>{source}</span>)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  )
}
