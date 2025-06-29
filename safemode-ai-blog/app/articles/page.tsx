"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutGrid, CalendarDays, ArrowRight, User } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
// Import the server actions
import { getAllPublishedPosts, getAuthors } from "@/app/actions"

// Interfaces for our data structures
interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  created_at: string;
  user_id: string; // The author's ID
  users: { username: string } | null;
}

interface Author {
    id: string;
    username: string;
}

interface GroupedPosts {
  [category: string]: Post[];
}

const PLACEHOLDER_SNIPPET = "Coming soon...";

export default function AllArticlesPage() {
  // State for all data and UI
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data (posts and authors) when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Now that RLS policies are correct, these server actions will return the data successfully.
      const [postsData, authorsData] = await Promise.all([
        getAllPublishedPosts(),
        getAuthors()
      ]);
      setAllPosts(postsData || []);
      setAuthors(authorsData || []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Memoized calculation to filter and group posts when the filter changes
  const { groupedPosts, categories, totalPublishedPosts } = useMemo(() => {
    const filteredPosts = selectedAuthor === "all"
      ? allPosts
      : allPosts.filter(post => post.user_id === selectedAuthor);

    const groups: GroupedPosts = filteredPosts.reduce((acc, post) => {
      const category = post.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(post);
      return acc;
    }, {} as GroupedPosts);

    return {
      groupedPosts: groups,
      categories: Object.keys(groups).sort(),
      totalPublishedPosts: filteredPosts.length,
    };
  }, [allPosts, selectedAuthor]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center"><p className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading Articles...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#61E8E1] font-mono glow-text">All Articles</h1>
          <p className="text-lg text-[#AAAAAA] mt-2">Browse our collection of insights on AI, cybersecurity, and digital ethics.</p>
        </header>

        {/* --- FILTER DROPDOWN --- */}
        <div className="mb-8 max-w-xs mx-auto">
            <Label htmlFor="author-filter" className="text-sm font-medium text-[#AAAAAA] mb-2 block text-center">Filter by Author</Label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger id="author-filter" className="bg-[#1A1A1A] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1]">
                    <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333] text-[#EAEAEA]">
                    <SelectItem value="all" className="focus:bg-[#61E8E1] focus:text-[#0D0D0D]">All Authors</SelectItem>
                    {authors.map(author => (
                        <SelectItem key={author.id} value={author.id} className="focus:bg-[#61E8E1] focus:text-[#0D0D0D]">
                            {author.username}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>


        {totalPublishedPosts === 0 ? (
          <div className="text-center py-16">
            <LayoutGrid className="w-16 h-16 text-[#61E8E1]/50 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#EAEAEA] mb-2">No Articles Found</h2>
            <p className="text-[#AAAAAA]">No articles match the current filter.</p>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={categories} className="w-full space-y-4">
            {categories.map((category) => (
              <AccordionItem value={category} key={category} className="border-b-2 border-[#61E8E1]/30 last:border-b-0">
                <AccordionTrigger className="text-2xl sm:text-3xl font-bold text-[#61E8E1] font-mono py-4 glow-text hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <span>{category}</span>
                    <span className="text-lg text-[#AAAAAA] font-sans font-normal">({groupedPosts[category].length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {groupedPosts[category].map((post) => {
                      const snippet = post.content && post.content.trim() !== "" ? `${post.content.substring(0, 120)}...` : PLACEHOLDER_SNIPPET;
                      return (
                        <Link href={`/posts/${post.id}`} key={post.id} className="group">
                          <div className="bg-[#1A1A1A] rounded-lg overflow-hidden glow-border hover:glow-border-intense hover:scale-103 transition-all h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                              <Image src={post.image || `/placeholder.svg`} alt={post.title} fill className="object-cover group-hover:scale-110"/>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                              <div className="flex justify-between items-center mb-2 text-xs text-[#AAAAAA]">
                                <div className="flex items-center gap-1"><User className="w-3 h-3"/>{post.users?.username || 'SafemodeAI'}</div>
                                <div className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              </div>
                              <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2 line-clamp-2 group-hover:text-[#61E8E1]">{post.title}</h3>
                              <p className="text-sm text-[#AAAAAA] line-clamp-3 mb-4 flex-grow">{snippet}</p>
                              <div className="mt-auto flex items-center text-[#61E8E1] font-semibold text-sm group-hover:glow-text">READ POST<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1"/></div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
    </div>
  );
}
