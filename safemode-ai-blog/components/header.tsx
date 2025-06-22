"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Youtube, ChevronDown, Plus, Trash2, LogOut, User, Settings } from "lucide-react" // Added Settings
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { getSession, logout } from "@/lib/auth"

interface UserType {
  username: string
  role: "admin" | "user"
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession()
      if (session) {
        setUser(session.user)
      }
    }
    fetchSession()
  }, [])

  const handleSignOut = async () => {
    await logout()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  const deleteAllPosts = () => {
    // This should be handled by a secure backend endpoint
    console.log("Deleting all posts...")
    // Simulate deletion for now
    localStorage.removeItem("safemode-posts")
    alert("All posts have been deleted.")
    router.refresh()
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

            {user && user.username ? (
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
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/profile"
                          className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1]"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#333]" />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer w-full justify-start"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete All Posts
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete all posts from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteAllPosts}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                      className="flex items-center text-[#EAEAEA] hover:text-[#61E8E1] focus:text-[#61E8E1] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <></>
            )}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-[#EAEAEA]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#333]">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Articles
              </Link>
              <Link
                href="/about"
                className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a
                href="https://youtube.com/@safemodeai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube Channel</span>
              </a>

              {user && user.username ? (
                <div className="pt-4 border-t border-[#333] space-y-4">
                  <div className="text-[#61E8E1] font-semibold">Welcome, {user.username}</div>
                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/admin"
                        className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/admin/create"
                        className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create Post
                      </Link>
                      <Link
                        href="/admin/profile"
                        className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          deleteAllPosts()
                          setIsMenuOpen(false)
                        }}
                        className="block text-red-400 hover:text-red-300 transition-colors text-left w-full"
                      >
                        Delete All Posts
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block text-[#EAEAEA] hover:text-[#61E8E1] transition-colors text-left w-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
