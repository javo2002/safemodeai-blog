import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, User } from "lucide-react"; // Added User icon
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  created_at: string;
  users: { username: string } | null; // Author relation
}

const PLACEHOLDER_SNIPPET = "Coming soon...";

export function FeaturedPosts({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Featured Posts</h2>
          <div className="text-center py-12"><p className="text-[#AAAAAA] text-lg">No featured posts available yet.</p></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto relative">
        <h2 className="text-3xl font-bold text-[#61E8E1] font-mono mb-10">Featured Posts</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {posts.map((post) => {
            const snippet = post.content && post.content.trim() !== "" ? `${post.content.substring(0, 100)}...` : PLACEHOLDER_SNIPPET;
            return (
              <Link href={`/posts/${post.id}`} key={post.id} className="flex-none w-72 sm:w-80 group">
                <div className="bg-[#1A1A1A] rounded-lg overflow-hidden glow-border hover:glow-border-intense hover:scale-103 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform"/>
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3 text-xs text-[#AAAAAA]">
                      <Badge variant="outline" className="border-[#61E8E1] text-[#61E8E1] font-mono">{post.category}</Badge>
                      {/* CORRECTED: Display author if available */}
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3"/>
                        <span>{post.users?.username || 'SafemodeAI'}</span>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#EAEAEA] mb-3 line-clamp-2 group-hover:text-[#61E8E1] transition-colors">{post.title}</h3>
                    <p className="text-xs sm:text-sm text-[#AAAAAA] line-clamp-2 mb-4 flex-grow">{snippet}</p>
                    <div className="mt-auto flex items-center text-[#61E8E1] font-semibold text-sm group-hover:glow-text">
                      READ POST
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
