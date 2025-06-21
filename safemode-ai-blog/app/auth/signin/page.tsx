"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User } from "lucide-react"
// Removed Info icon and Accordion components as they are no longer needed

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials
    // These are the credentials the admin needs to remember
    if (formData.username === "admin" && formData.password === "safemode2024") {
      const userData = {
        username: "admin",
        role: "admin",
        signedInAt: new Date().toISOString(),
      }
      localStorage.setItem("safemode-user", JSON.stringify(userData))
      router.push("/")
    } else if (formData.username === "user" && formData.password === "password") {
      // Regular user login (if you still want this for testing)
      const userData = {
        username: "user",
        role: "user",
        signedInAt: new Date().toISOString(),
      }
      localStorage.setItem("safemode-user", JSON.stringify(userData))
      router.push("/")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#1A1A1A] border-[#333] glow-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#61E8E1] font-mono">Sign In</CardTitle>
              <p className="text-[#AAAAAA] mt-2">Access your SafemodeAI account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-[#EAEAEA] mb-2 block">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#61E8E1] w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                      className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#EAEAEA] mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#61E8E1] w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#61E8E1] hover:text-[#4DD4D4]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-500 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
              {/* Demo credentials section has been completely removed */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
