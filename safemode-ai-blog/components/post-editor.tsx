"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, UploadCloud, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadPostImage } from "@/app/actions"
import NextImage from "next/image"
import { RichTextEditor } from "./rich-text-editor" // Import the new editor

// Interfaces remain the same
interface PostData {
  title: string;
  content: string; // This will now be an HTML string
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
  }, [initialData?.image]);

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
                        <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({...prev, title: e.target.value }))} disabled={isSaving}/>
                    </div>
                    <div>
                        <Label className="text-[#EAEAEA] mb-2 block">Content</Label>
                        {/* --- REPLACED TEXTAREA WITH RICHTEXTEDITOR --- */}
                        <RichTextEditor 
                            content={formData.content} 
                            onUpdate={(newContent) => setFormData(prev => ({...prev, content: newContent}))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="sources" className="text-[#EAEAEA] mb-2 block">Sources (one per line)</Label>
                        <Input id="sources" value={formData.sources} onChange={(e) => setFormData(prev => ({...prev, sources: e.target.value }))} disabled={isSaving}/>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            {/* ... The Post Settings card remains the same ... */}
        </div>
    </div>
  );
}
