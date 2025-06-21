"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UserCircle, Save, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface User {
  username: string
  role: "admin" | "user"
  signedInAt: string
}

interface AdminProfile {
  image: string | null
}

export default function AdminProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("safemode-user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.role !== "admin") {
        router.push("/")
        return
      }
    } else {
      router.push("/auth/signin")
      return
    }

    const savedProfile = localStorage.getItem("safemode-admin-profile")
    if (savedProfile) {
      const adminProfile: AdminProfile = JSON.parse(savedProfile)
      setProfileImage(adminProfile.image)
      setPreviewImage(adminProfile.image)
    }
    setIsLoading(false)
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    const adminProfile: AdminProfile = { image: previewImage }
    localStorage.setItem("safemode-admin-profile", JSON.stringify(adminProfile))
    setProfileImage(previewImage) // Update the actual profile image state
    toast({
      title: "Profile Updated",
      description: "Your profile photo has been saved.",
      className: "bg-[#1A1A1A] text-[#61E8E1] border-[#61E8E1]",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading Profile...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="bg-[#1A1A1A] border-[#333] glow-border max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-[#61E8E1] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#61E8E1] mb-4">Access Denied</h1>
              <p className="text-[#AAAAAA] mb-6">You need administrator privileges to access this page.</p>
              <Link href="/auth/signin">
                <Button className="bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4]">Sign In as Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Admin Profile Settings</h1>
        <Card className="bg-[#1A1A1A] border-[#333] glow-border max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-[#61E8E1] font-mono">Update Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#0D0D0D] border-2 border-[#61E8E1] glow-border flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile Preview"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <UserCircle className="w-24 h-24 text-[#61E8E1]/50" />
                )}
              </div>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] file:bg-[#61E8E1] file:text-[#0D0D0D] file:border-0 file:rounded file:px-3 file:py-1"
              />
              <Label htmlFor="profileImage" className="text-sm text-[#AAAAAA]">
                Choose a new profile photo (square recommended).
              </Label>
            </div>
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile Photo
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
