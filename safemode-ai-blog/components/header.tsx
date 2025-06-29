"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Youtube, ChevronDown, Plus, Trash2, LogOut, User, Settings, LayoutDashboard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { logout } from "@/app/actions"

interface UserType {
  username: string;
  role: "super-admin" | "author";
}

export function Header({ user }: { user: UserType | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    await logout();
  }
  
  const deleteAllPosts = () => {
    if (confirm("DANGEROUS: Are you sure you want to delete all posts? This action is for testing and cannot be undone.")) {
        toast({ title: "Action Not Implemented", description: "This is a placeholder for a secure delete-all action.", variant: "destructive" });
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "All Articles" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#61E8E1] font-mono glow-text">SafemodeAI</div>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-[#EAEAEA] hover:text-[#61E8E1] transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
            <a href="https://youtube.com/@safemodeai" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-[#EAEAEA] hover:text-[#61E8E1] transition-colors text-sm font-medium">
              <Youtube className="w-4 h-4" />
              <span>YouTube</span>
            </a>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-[#EAEAEA] hover:text-[#61E8E1] hover:bg-transparent px-2">
                    <User className="w-4 h-4 mr-2" />
                    {user.username}
                    {user.role === 'super-admin' && <ShieldCheck className="w-4 h-4 ml-2 text-yellow-400" title="Super Admin"/>}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1A1A1A] border-[#333]" align="end">
                  <DropdownMenuItem asChild><Link href="/admin" className="flex items-center text-[#EAEAEA] cursor-pointer"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/admin/create" className="flex items-center text-[#EAEAEA] cursor-pointer"><Plus className="w-4 h-4 mr-2" />Create Post</Link></DropdownMenuItem>
                   <DropdownMenuItem asChild><Link href="/admin/profile" className="flex items-center text-[#EAEAEA] cursor-pointer"><Settings className="w-4 h-4 mr-2" />Profile Settings</Link></DropdownMenuItem>
                  {user.role === 'super-admin' && (<><DropdownMenuSeparator className="bg-[#333]" /><DropdownMenuItem onClick={deleteAllPosts} className="flex items-center text-red-400 cursor-pointer"><Trash2 className="w-4 h-4 mr-2" />Delete All Posts (DEV)</DropdownMenuItem></>)}
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-400 cursor-pointer"><LogOut className="w-4 h-4 mr-2" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </nav>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon">
                  {isMenuOpen ? <X className="h-6 w-6 text-[#61E8E1]" /> : <Menu className="h-6 w-6 text-[#61E8E1]" />}
              </Button>
          </div>
        </div>
      </div>
      
      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
          <div className="md:hidden">
              <nav className="flex flex-col items-center space-y-6 py-8">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-lg text-[#EAEAEA] hover:text-[#61E8E1]" onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                   <a href="https://youtube.com/@safemodeai" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-lg text-[#EAEAEA] hover:text-[#61E8E1]">
                    <Youtube className="w-5 h-5" />
                    <span>YouTube</span>
                  </a>
                  {/* We show the user menu items directly in the mobile menu if logged in */}
                  {user && (
                      <>
                        <div className="w-1/2 border-t border-[#333] my-4"></div>
                        <Link href="/admin" className="text-lg text-[#EAEAEA] hover:text-[#61E8E1]" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        <Link href="/admin/create" className="text-lg text-[#EAEAEA] hover:text-[#61E8E1]" onClick={() => setIsMenuOpen(false)}>Create Post</Link>
                        <Link href="/admin/profile" className="text-lg text-[#EAEAEA] hover:text-[#61E8E1]" onClick={() => setIsMenuOpen(false)}>Profile Settings</Link>
                        <Button onClick={handleSignOut} variant="outline" className="text-red-400 border-red-400">Sign Out</Button>
                      </>
                  )}
              </nav>
          </div>
      )}
    </header>
  )
}
