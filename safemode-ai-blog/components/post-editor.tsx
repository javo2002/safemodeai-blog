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
import { Save, Eye, Loader2 } from "lucide-react" // Added Loader2
import { useToast } from "@/hooks/use-toast"

interface PostData {
  title: string
  content: string
  category: string
  featured: boolean
  image: string
  published: boolean
  sources?: string // For textarea input, will be split into array on save
}

// This is the data structure for posts as they are stored (e.g., in Supabase or state)
// It includes an ID and createdAt, and sources as an array.
export interface SavedPostData extends Omit<PostData, "sources"> {
  id?: string // Optional for new posts not yet saved
  createdAt?: string // Optional for new posts
  sources?: string[]
}

interface PostEditorProps {
  initialData?: SavedPostData
  onSave: (data: Omit<SavedPostData, "id" | "createdAt">) => void // Data sent to save doesn't include id/createdAt
  isSaving?: boolean // Added isSaving prop
}

export function PostEditor({ initialData, onSave, isSaving = false }: PostEditorProps) {
  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    featured: initialData?.featured || false,
    image: initialData?.image || "/placeholder.svg?height=200&width=400",
    published: initialData?.published || false,
    sources: initialData?.sources?.join("\n") || "", // Join array to string for textarea
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
    if (!formData.title.trim() || !formData.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and category.",
        variant: "destructive",
      })
      return
    }

    const postToSave: Omit<SavedPostData, "id" | "createdAt"> = {
      ...formData,
      published: publishedStatus,
      sources: formData.sources
        ? formData.sources
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        : [],
    }

    onSave(postToSave)

    // Notification for subscribers (simulated)
    // This part can remain, but the actual sending would be a backend task
    if (publishedStatus && !initialData?.id) {
      // Only show subscriber toast for new publications
      const subscribedEmails = JSON.parse(localStorage.getItem("safemode-subscribers") || "[]")
      if (subscribedEmails.length > 0) {
        toast({
          title: "Post Published!",
          description: `Notifications would be sent to ${subscribedEmails.length} subscriber(s). (Simulation)`,
          className: "bg-[#1A1A1A] text-[#61E8E1] border-[#61E8E1]",
        })
      } else {
        toast({
          title: "Post Published!",
          description: "No subscribers yet for notifications. (Simulation)",
          className: "bg-[#1A1A1A] text-[#EAEAEA] border-[#333]",
        })
      }
    } else if (!publishedStatus && !initialData?.id) {
      toast({
        title: "Draft Saved!",
        description: "Your post has been saved as a draft.",
        className: "bg-[#1A1A1A] text-[#EAEAEA] border-[#333]",
      })
    }
    // For edits, the parent component (EditPage) will show a toast.
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                disabled={isSaving}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-[#EAEAEA] mb-2 block">
                Content (Markdown supported, leave blank for "Coming soon...")
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here..."
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] min-h-[300px] resize-none"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="sources" className="text-[#EAEAEA] mb-2 block">
                Sources (one per line)
              </Label>
              <Textarea
                id="sources"
                value={formData.sources}
                onChange={(e) => setFormData((prev) => ({ ...prev, sources: e.target.value }))}
                placeholder="e.g., https://example.com/article&#10;Author, A. (Year). Title of work. Publisher."
                className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] min-h-[100px] resize-none"
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
                disabled={isSaving}
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
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] file:bg-[#61E8E1] file:text-[#0D0D0D] file:border-0 file:rounded file:px-3 file:py-1"
                  disabled={isSaving}
                />
                {formData.image && (
                  <div className="w-full h-32 bg-[#0D0D0D] rounded border border-[#333] overflow-hidden">
                    <img
                      src={formData.image || "/placeholder.svg?height=200&width=400&query=image+preview"}
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
                disabled={isSaving}
              />
              <Label htmlFor="featured" className="text-[#EAEAEA]">
                Feature this post?
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333] glow-border">
          <CardContent className="p-4 space-y-3">
            <Button
              onClick={() => handleSubmit(true)}
              className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? (initialData?.id ? "Updating..." : "Publishing...") : "Publish"}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              variant="outline"
              className="w-full border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#333] text-[#AAAAAA] hover:bg-[#333] hover:text-[#EAEAEA]"
              disabled={isSaving}
              onClick={() => {
                // Basic preview: open a new tab with the current form data (not saved)
                // This is a very simplified preview. A real preview would render the post page.
                const previewData = { ...formData, published: true, sources: formData.sources?.split("\n") }
                localStorage.setItem("safemode-post-preview", JSON.stringify(previewData))
                window.open("/post-preview", "_blank") // Needs a /post-preview route
              }}
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
