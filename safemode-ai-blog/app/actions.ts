"use server"

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// --- SESSION MANAGEMENT ---
const secretKey = process.env.SESSION_SECRET || "default-secret-key-for-development";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h') // Extended session time
    .sign(key);
}

async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/auth/signin');
}

export async function login(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, role, password_hash')
    .eq('username', username)
    .single();

  if (error || !user) {
    return { error: 'Invalid username or password.' };
  }

  // IMPORTANT: In production, use a library like bcrypt to compare hashes
  const isValidPassword = (password === user.password_hash);
  if (!isValidPassword) {
    return { error: 'Invalid username or password.' };
  }

  const sessionUser = { id: user.id, username: user.username, role: user.role };
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const session = await encrypt({ user: sessionUser, expires });

  cookies().set('session', session, { expires, httpOnly: true });
  redirect('/admin');
}


// --- POST MANAGEMENT ---

// Helper function to sanitize HTML content on the server
function sanitizeContent(content: string): string {
  // JSDOM window is needed for DOMPurify to run in a Node.js environment
  const window = new JSDOM('').window;
  const purify = DOMPurify(window as any);
  return purify.sanitize(content);
}

// Helper to determine post status based on user role
function getStatusForRole(shouldPublish: boolean, role: string): string {
    if (!shouldPublish) {
        return 'draft';
    }
    return role === 'super-admin' ? 'published' : 'pending_approval';
}

export async function createPost(postData: any) {
  const session = await getSession();
  if (!session?.user) return { error: 'Access Denied.' };

  const supabase = createSupabaseServerClient();
  const status = getStatusForRole(postData.published, session.user.role);

  const { error } = await supabase.from("posts").insert([
    {
      title: postData.title,
      content: sanitizeContent(postData.content),
      category: postData.category,
      featured: postData.featured,
      image: postData.image,
      sources: postData.sources,
      user_id: session.user.id,
      status: status,
    },
  ]);

  if (error) return { error: error.message };

  revalidatePath('/admin');
  redirect('/admin');
}

export async function updatePost(postId: string, postData: any) {
  const session = await getSession();
  if (!session?.user) return { error: 'Access Denied.' };

  const supabase = createSupabaseServerClient();
  const status = getStatusForRole(postData.published, session.user.role);

  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: sanitizeContent(postData.content),
      category: postData.category,
      featured: postData.featured,
      image: postData.image,
      sources: postData.sources,
      status: status,
    })
    .eq('id', postId);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/posts/preview/${postId}`);
  revalidatePath(`/posts/${postId}`);
  revalidatePath('/admin');
  redirect('/admin');
}

export async function submitForApproval(postId: string) {
    const session = await getSession();
    if (!session?.user) return { error: 'Access Denied.' };

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('posts')
        .update({ status: 'pending_approval' })
        .eq('id', postId);
    
    if (error) return { error: error.message };

    revalidatePath('/admin');
    return { success: true };
}

export async function approvePost(postId: string) {
    const session = await getSession();
    if (session?.user?.role !== 'super-admin') return { error: 'Access Denied.' };

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', postId);

    if (error) return { error: error.message };

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/posts/preview/${postId}`);
    revalidatePath(`/posts/${postId}`);
    return { success: true };
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session?.user) return { error: 'Access Denied.' };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  
  if (error) return { error: error.message };
  
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/admin');
  return { success: true };
}

// --- IMAGE UPLOAD ---
export async function uploadPostImage(formData: FormData) {
  const session = await getSession();
  if (!session?.user) return { error: 'Access Denied.' };

  const supabase = createSupabaseServerClient();
  const file = formData.get('file') as File;
  
  if (!file) return { error: 'No file provided.' };

  const filePath = `${session.user.id}/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage.from('post-images').upload(filePath, file);

  if (error) return { error: `Failed to upload image: ${error.message}` };

  const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(filePath);
  return { publicUrl };
}

// --- PUBLIC & SECURE DATA FETCHING ---
export async function getFeaturedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, users (username)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function getAllPublishedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, users (username)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function getPostForPreview(postId: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, users (username)')
    .eq('id', postId)
    .single();

  if (error) return null;
  return data;
}
