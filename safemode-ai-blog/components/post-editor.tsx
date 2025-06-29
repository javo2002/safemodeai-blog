"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, UploadCloud, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadPostImage } from "@/app/actions"
import NextImage from "next/image"
import dynamic from "next/dynamic"

// --- DYNAMIC IMPORT FOR THE EDITOR (FIXES THE CLIENT-SIDE EXCEPTION) ---
// This ensures the RichTextEditor component only renders on the client.
const RichTextEditor = dynamic(() => import('./rich-text-editor').then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => <div className="min-h-[250px] w-full rounded-md border border-input bg-background animate-pulse"></div>
});

// Interfaces remain the same
interface PostData {
  title: string;
  content: string;
  category: string;
  featured: boolean;
  image: string;
  published: boolean;
  sources?: string;
}

export interface SavedPostData extends Omit<PostData, "sources"> {
  id?: string;
  createdAt?: string;
  sources?: string[];
}

interface PostEditorProps {
  initialData?: SavedPostData;
  onSave: (data: Omit<SavedPostData, "id" | "createdAt">) => Promise<void>;
  isSaving?: boolean;
}

export function PostEditor({ initialData, onSave, isSaving = false }: PostEditorProps) {
  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    featured: initialData?.featured || false,
    image: initialData?.image || "",
    published: initialData?.published || false,
    sources: initialData?.sources?.join("\n") || "",
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const categories = ["AI ETHICS", "CYBERSECURITY", "THREAT ANALYSIS", "PRIVACY", "MACHINE LEARNING", "DIGITAL RIGHTS", "TECH POLICY"];

  useEffect(() => {
    setPreviewImage(initialData?.image || null);
    setFormData(prev => ({
        ...prev,
        title: initialData?.title || "",
        content: initialData?.content || "",
        category: initialData?.category || "",
        featured: initialData?.featured || false,
        image: initialData?.image || "",
        published: initialData?.published || false,
        sources: initialData?.sources?.join("\n") || ""
    }));
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const result = await uploadPostImage(uploadFormData);
      if (result.error) {
        toast({ title: "Image Upload Failed", description: result.error, variant: "destructive" });
        setPreviewImage(initialData?.image || null);
      } else if (result.publicUrl) {
        setFormData(prev => ({ ...prev, image: result.publicUrl as string }));
        setPreviewImage(result.publicUrl);
        toast({ title: "Image Uploaded", description: "Ready to save." });
      }
    } catch (err) {
      toast({ title: "Upload Failed", description: "An unexpected error occurred.", variant: "destructive" });
      setPreviewImage(initialData?.image || null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = (publishedStatus: boolean) => {
    if (!formData.title.trim() || !formData.category) {
      toast({ title: "Missing Fields", description: "Please fill in title and category.", variant: "destructive" });
      return;
    }
    const postToSave = {
      ...formData,
      published: publishedStatus,
      sources: formData.sources ? formData.sources.split("\n").map(s => s.trim()).filter(s => s !== "") : [],
    };
    onSave(postToSave);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1A1A1A] border-[#333] glow-border">
                <CardHeader><CardTitle className="text-[#61E8E1] font-mono">Post Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="title" className="text-[#EAEAEA] mb-2 block">Post Title *</Label>
                        <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({...prev, title: e.target.value }))} placeholder="Enter your post title..." className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] text-lg font-semibold" disabled={isSaving || isUploading}/>
                    </div>
                    <div>
                        <Label className="text-[#EAEAEA] mb-2 block">Content</Label>
                        <RichTextEditor 
                            content={formData.content} 
                            onUpdate={(newContent) => setFormData(prev => ({...prev, content: newContent}))}
                            disabled={isSaving || isUploading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="sources" className="text-[#EAEAEA] mb-2 block">Sources (one per line)</Label>
                        <Textarea id="sources" value={formData.sources} onChange={(e) => setFormData(prev => ({...prev, sources: e.target.value}))} placeholder="e.g., https://example.com/article" className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] min-h-[100px] resize-none" disabled={isSaving || isUploading}/>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#333] glow-border">
                <CardHeader><CardTitle className="text-[#61E8E1] font-mono">Post Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="category" className="text-[#EAEAEA] mb-2 block">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} disabled={isSaving || isUploading}>
                            <SelectTrigger className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1]"><SelectValue placeholder="Select a category" /></SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-[#333]">
                                {categories.map(category => <SelectItem key={category} value={category} className="text-[#EAEAEA] focus:bg-[#61E8E1] focus:text-[#0D0D0D]">{category}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="image-upload" className="text-[#EAEAEA] mb-2 block">Featured Image</Label>
                        <div className="space-y-2">
                             <div className="relative">
                                <Button asChild variant="outline" className="w-full border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]" disabled={isUploading || isSaving}>
                                    <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center">
                                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                        {isUploading ? "Uploading..." : "Choose File"}
                                    </label>
                                </Button>
                                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading || isSaving} />
                            </div>
                            <div className="w-full h-32 bg-[#0D0D0D] rounded border border-[#333] overflow-hidden flex items-center justify-center">
                                {previewImage ? (
                                    <NextImage src={previewImage} alt="Preview" width={400} height={200} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-[#61E8E1]/30" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))} className="border-[#61E8E1] data-[state=checked]:bg-[#61E8E1] data-[state=checked]:text-[#0D0D0D]" disabled={isSaving || isUploading}/>
                        <Label htmlFor="featured" className="text-[#EAEAEA]">Feature this post?</Label>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-[#1A1A1A] border-[#333] glow-border">
                <CardContent className="p-4 space-y-3">
                    <Button onClick={() => handleSubmit(true)} className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold" disabled={isSaving || isUploading}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? "Submitting..." : "Publish / Submit"}
                    </Button>
                    <Button onClick={() => handleSubmit(false)} variant="outline" className="w-full border-[#61E8E1] text-[#61E8E1] hover:bg-[#61E8E1] hover:text-[#0D0D0D]" disabled={isSaving || isUploading}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? "Saving..." : "Save as Draft"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
