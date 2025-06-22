"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Youtube, ChevronDown, Plus, Trash2, LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions" // Import the server action

interface UserType {
  username: string
  role: "admin" | "user"
}

// Accept user as a prop
export function Header({ user }: { user: UserType | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await logout()
    // The redirect in the server action will handle navigation
  }

  const deleteAllPosts = () => {
    // Ideally, this should also be a server action for security
    if (confirm("Are you sure you want to delete all posts? This action cannot be undone.")) {
      // This is still using localStorage and should be migrated to a proper backend call
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

            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[#EAEAEA] hover:text-[#61E8E1]">
                      <User className="w-4 h-4 mr-2" />
                      {user.username}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border-[#333]" align="end">
                    {/* Admin-specific links are now here */}
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/create" className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/profile" className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]">
                            <Settings className="w-4 h-4 mr-2" />
                            Profile Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#333]" />
                        <DropdownMenuItem
                          onClick={deleteAllPosts}
                          className="flex items-center text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete All Posts
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#333]" />
                      </>
                    )}

                    {/* Standard user links */}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <></> // If no user, show nothing or a sign-in button
            )}
          </nav>
          {/* ... mobile menu logic remains the same */}
        </div>
      </div>
    </header>
  )
}
