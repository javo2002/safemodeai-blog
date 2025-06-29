"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UserCircle, Save, Loader2, UploadCloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSession, getCurrentUserProfile, updateUserProfile, uploadPostImage } from "@/app/actions"
import { Input } from "@/components/ui/input"

interface User {
  id: string;
  username: string;
  role: "super-admin" | "author";
}

interface ProfileData {
  bio: string | null;
  avatar_url: string | null;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>({ bio: '', avatar_url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const session = await getSession();
        if (!session?.user) {
          router.push("/auth/signin");
          return; 
        }
        setUser(session.user);

        const userProfile = await getCurrentUserProfile();
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
        toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
      } finally {
        // This 'finally' block GUARANTEES that loading is set to false,
        // even if an error occurs. This fixes the infinite loading bug.
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [router, toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    try {
        const result = await uploadPostImage(uploadFormData);
        if (result.error) {
            toast({ title: "Upload Failed", description: result.error, variant: "destructive" });
        } else if (result.publicUrl) {
            setProfile(prev => ({ ...prev, avatar_url: result.publicUrl as string }));
            toast({ title: "Image ready", description: "Click 'Save Profile' to apply." });
        }
    } finally {
        setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const profileToSave = {
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
    };
    const result = await updateUserProfile(profileToSave);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    }
    setIsSaving(false);
  };

  // While checking the session, show a loading indicator.
  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
            <p className="text-[#61E8E1] text-lg font-mono animate-pulse">Loading Profile...</p>
        </div>
    );
  }
  
  // This check ensures we don't render the page for a moment before redirecting
  if (!user) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
            <p className="text-[#AAAAAA]">Redirecting to sign-in...</p>
        </div>
      );
  }

  // If loading is complete and the user is valid, render the editor.
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#61E8E1] font-mono mb-8">Profile Settings</h1>
        <Card className="bg-[#1A1A1A] border-[#333] glow-border max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[#61E8E1] font-mono">Edit Your Profile ({user?.username})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#0D0D0D] border-2 border-[#61E8E1] glow-border flex items-center justify-center">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Profile Preview" layout="fill" objectFit="cover" />
                ) : (
                  <UserCircle className="w-24 h-24 text-[#61E8E1]/50" />
                )}
              </div>
              <Button asChild variant="outline" size="sm" disabled={isUploading || isSaving}>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                    {isUploading ? "Uploading..." : "Upload Photo"}
                </label>
              </Button>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            
            <div>
                <Label htmlFor="bio" className="text-[#EAEAEA] mb-2 block">Your Bio / Story</Label>
                <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="bg-[#0D0D0D] border-[#333] text-[#EAEAEA] focus:border-[#61E8E1] min-h-[150px]"
                    disabled={isSaving}
                />
            </div>

            <Button onClick={handleSaveProfile} className="w-full bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#4DD4D4] font-semibold" disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
