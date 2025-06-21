"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostData {
  title: string
  content: string
  category: string
  featured: boolean
  image: string
  published: boolean
}

interface PostEditorProps {
  initialData?: PostData
  onSave: (data: PostData) => void
}

export function PostEditor({ initialData, onSave }: PostEditorProps) {
  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    featured: initialData?.featured || false,
    image: initialData?.image || "/placeholder.svg?height=200&width=400",
    published: initialData?.published || false,
  })

  const categories = [
    "AI ETHICS",
    "CYBERSECURITY",
    "THREAT ANALYSIS",
    "PRIVACY",
    "MACHINE LEARNING",
    "DIGITAL RIGHTS",
    "TECH POLICY",
  ]

  const { toast } = useToast()

  const handleSubmit = (publishedStatus: boolean) => {
    // Renamed 'published' to 'publishedStatus' to avoid conflict with formData.published
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title, content, and category.",
        variant: "destructive",
      })
      return
    }

    onSave({
      ...formData,
      published: publishedStatus, // Use the parameter here
    })

    if (publishedStatus) {
      // Only show subscriber notification toast if actually publishing
      const subscribedEmails = JSON.parse(localStorage.getItem("safemode-subscribers") || "[]")
      if (subscribedEmails.length > 0) {
        toast({
          title: "Post Published!",
          description: `Notifications would be sent to ${subscribedEmails.length} subscriber(s).`,
          className: "bg-[#1A1A1A] text-[#61E8E1] border-[#61E8E1]",
        })
      } else {
        toast({
          title: "Post Published!",
          description: "No subscribers yet for notifications.",
          className: "bg-[#1A1A1A] text-[#EAEAEA] border-[#333]",
        })
      }
    } else {
      toast({
        title: "Draft Saved!",
        description: "Your post has been saved as a draft.",
        className: "bg-[#1A1A1A] text-[#EAEAEA] border-[#333]",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-[#1A1A1A] border-[#333] glow-border">
          <CardHeader>
            <CardTitle className="text-[#61E8E1] font-mono">Post Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-[#EAEAEA] mb-2 block">
                Post Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your post title..."
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] text-lg font-semibold"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-[#EAEAEA] mb-2 block">
                Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here..."
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] min-h-[400px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      <div className="space-y-6">
        <Card className="bg-[#1A1A1A] border-[#333] glow-border">
          <CardHeader>
            <CardTitle className="text-[#61E8E1] font-mono">Post Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category" className="text-[#EAEAEA] mb-2 block">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-[#EAEAEA] focus:bg-[#61E8E1] focus:text-[#0D0D0D]"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image" className="text-[#EAEAEA] mb-2 block">
                Featured Image
              </Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] file:bg-[#61E8E1] file:text-[#0D0D0D] file:border-0 file:rounded file:px-3 file:py-1"
                  />
                </div>
                {formData.image && (
                  <div className="w-full h-32 bg-[#0D0D0D] rounded border border-[#333] overflow-hidden">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked as boolean }))}
                className="border-[#61E8E1] data-[state=checked]:bg-[#61E8E1] data-[state=checked]:text-[#0D0D0D]"
              />
              <Label htmlFor="featured" className="text-[#EAEAEA]">
                Feature this post?
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-[#1A1A1A] border-[#333] glow-border">
          <CardContent className="p-4 space-y-3">
            <Button
              onClick={() => handleSubmit(true)}
              className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Publish
            </Button>

            <Button
              onClick={() => handleSubmit(false)}
              variant="outline"
              className="w-full border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <Button
              variant="outline"
              className="w-full border-[#333] text-[#AAAAAA] hover:bg-[#333] hover:text-[#EAEAEA]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
