import { BrainCircuit, ShieldCheck, Eye, BarChartBig, UserCircle } from "lucide-react";
import Image from "next/image";
import { getAuthorProfiles } from "../actions";

interface AuthorProfile {
  id: string;
  username: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
}

const coreDirectives = [
  { icon: <BrainCircuit className="w-10 h-10 mb-3 text-[#61E8E1]" />, title: "AI Ethics & Governance", description: "Navigating the complex moral landscapes of artificial intelligence." },
  { icon: <ShieldCheck className="w-10 h-10 mb-3 text-[#61E8E1]" />, title: "Cybersecurity Frontiers", description: "Exploring advanced threats and defensive strategies." },
  { icon: <Eye className="w-10 h-10 mb-3 text-[#61E8E1]" />, title: "Threat Intelligence", description: "Dissecting emerging cyber threats and methodologies." },
  { icon: <BarChartBig className="w-10 h-10 mb-3 text-[#61E8E1]" />, title: "Digital Intelligence Futures", description: "Investigating the broader impact of digital technologies." },
]

// This is now a Server Component
export default async function AboutPage() {
  const authors = await getAuthorProfiles();
  const owner = authors.find(a => a.role === 'super-admin');
  const otherAuthors = authors.filter(a => a.role === 'author');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#61E8E1" strokeWidth="0.2" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <section className="text-center mb-20 md:mb-28">
          <h1 className="text-4xl md:text-6xl font-bold text-[#61E8E1] font-mono mb-4 glow-text">
            CORE_IDENTITY: SAFEMODE.AI
          </h1>
          <p className="text-lg text-[#AAAAAA]">A collective dedicated to fostering critical discussion on our digital future.</p>
        </section>

        {/* Owner / Super Admin Section */}
        {owner && (
            <section className="mb-20 md:mb-28 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border-intense">
                <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-[#61E8E1] flex-shrink-0 bg-[#0D0D0D] flex items-center justify-center">
                    {owner.avatar_url ? (
                    <Image src={owner.avatar_url} alt={owner.username} fill className="object-cover" />
                    ) : (
                    <UserCircle className="w-3/4 h-3/4 text-[#61E8E1]/50" />
                    )}
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-1 glow-text">
                    The Operator
                    </h2>
                    <p className="text-md text-[#61E8E1]/80 font-mono mb-4">@{owner.username}</p>
                    <p className="text-[#AAAAAA] leading-relaxed">{owner.bio || "The founder and lead analyst for SafemodeAI."}</p>
                </div>
            </section>
        )}

        {/* Other Authors Section */}
        {otherAuthors.length > 0 && (
             <section className="mb-20 md:mb-28">
                <h2 className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-12 text-center glow-text">
                    CONTRIBUTING_NODES // The Authors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherAuthors.map(author => (
                        <div key={author.id} className="p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border flex items-center gap-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#61E8E1]/50 flex-shrink-0 bg-[#0D0D0D] flex items-center justify-center">
                                {author.avatar_url ? (
                                    <Image src={author.avatar_url} alt={author.username} fill className="object-cover" />
                                ) : (
                                    <UserCircle className="w-3/4 h-3/4 text-[#61E8E1]/30" />
                                )}
                            </div>
                            <div>
                               <h3 className="text-xl font-semibold text-[#EAEAEA] font-mono">@{author.username}</h3>
                               <p className="text-sm text-[#AAAAAA] mt-2 leading-relaxed">{author.bio || "Analyst and contributor to SafemodeAI."}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Core Directives Section (remains the same) */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-[#61E8E1] font-mono mb-12 text-center glow-text">
            CORE_MODULES // Content Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreDirectives.map((directive, index) => (
              <div key={index} className="p-6 bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg glow-border hover:glow-border-intense transition-all text-center flex flex-col items-center">
                {directive.icon}
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2 font-mono">{directive.title}</h3>
                <p className="text-sm text-[#AAAAAA] leading-relaxed">{directive.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
