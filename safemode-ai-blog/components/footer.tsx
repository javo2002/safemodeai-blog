"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Rss, Youtube, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    const { error } = await supabase.from('subscribers').insert({ email: email });

    if (error) {
      // Handle potential duplicate email error gracefully
      if (error.code === '23505') { // 23505 is the PostgreSQL error code for unique violation
        toast({
          title: "Already Subscribed",
          description: "This email is already on our list.",
          className: "bg-[#1A1A1A] text-[#EAEAEA] border-[#333]",
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Subscription Successful!",
        description: "You're now subscribed to SafemodeAI updates.",
        className: "bg-[#1A1A1A] text-[#61E8E1] border-[#61E8E1]",
      });
      setEmail("");
    }
    
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#333] text-[#AAAAAA] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold text-[#61E8E1] font-mono mb-4 glow-text">SafemodeAI</h3>
            <p className="text-sm leading-relaxed">
              Exploring the frontiers of digital intelligence, cybersecurity, and AI ethics. Your trusted source for
              in-depth analysis and critical discussion.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4 font-mono">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#61E8E1] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-[#61E8E1] transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#61E8E1] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4 font-mono">Stay Updated</h3>
            <p className="text-sm mb-3">Get notified about new articles and insights.</p>
            <form onSubmit={handleSubscription} className="flex space-x-2">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] flex-grow"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] px-3"
                disabled={isSubmitting}
                aria-label="Subscribe to newsletter"
              >
                {isSubmitting ? <Rss className="w-5 h-5 animate-ping" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} SafemodeAI. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a
              href="https://youtube.com/@safemodeai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#61E8E1] transition-colors"
              aria-label="SafemodeAI YouTube Channel"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@safemode.ai"
              className="hover:text-[#61E8E1] transition-colors"
              aria-label="Contact SafemodeAI via Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
