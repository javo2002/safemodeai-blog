"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Youtube, ChevronDown, Plus, Trash2, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface UserType {
  username: string
  role: "admin" | "user"
  signedInAt: string
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("safemode-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("safemode-user")
    setUser(null)
    router.push("/")
  }

  const deleteAllPosts = () => {
    if (confirm("Are you sure you want to delete all posts? This action cannot be undone.")) {
      localStorage.removeItem("safemode-posts")
      alert("All posts have been deleted.")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#61E8E1] font-mono glow-text">SafemodeAI</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
              Home
            </Link>
            <Link href="/articles" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
              All Articles
            </Link>
            <Link href="/about" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
              About
            </Link>
            <a
              href="https://youtube.com/@safemodeai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube</span>
            </a>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-[#61E8E1] hover:text-[#4DD4D4] font-semibold">
                        Admin
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1A1A1A] border-[#333]" align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/create"
                          className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#333]" />
                      <DropdownMenuItem
                        onClick={deleteAllPosts}
                        className="flex items-center text-red-400 hover:text-red-300 focus:text-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All Posts
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[#EAEAEA] hover:text-[#61E8E1]">
                      <User className="w-4 h-4 mr-2" />
                      {user.username}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border-[#333]" align="end">
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="default"
                  className="bg-[#0D0D0D] text-[#61E8E1] border border-[#61E8E1] hover:bg-[#1A1A1A] hover:border-[#4DD4D4] glow-border hover:glow-border-intense"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-[#EAEAEA]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#333]">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
                Home
              </Link>
              <Link href="/articles" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
                All Articles
              </Link>
              <Link href="/about" className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
                About
              </Link>
              <a
                href="https://youtube.com/@safemodeai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube Channel</span>
              </a>

              {/* Mobile User Authentication */}
              {user ? (
                <div className="pt-4 border-t border-[#333] space-y-4">
                  <div className="text-[#61E8E1] font-semibold">Welcome, {user.username}</div>
                  {user.role === "admin" && (
                    <>
                      <Link href="/admin" className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors">
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/admin/create"
                        className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                      >
                        Create Post
                      </Link>
                      <button
                        onClick={deleteAllPosts}
                        className="block text-red-400 hover:text-red-300 transition-colors text-left"
                      >
                        Delete All Posts
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-[#333]">
                  <Link href="/auth/signin">
                    <Button
                      variant="default"
                      className="w-full bg-[#0D0D0D] text-[#61E8E1] border border-[#61E8E1] hover:bg-[#1A1A1A] hover:border-[#4DD4D4] glow-border hover:glow-border-intense"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
