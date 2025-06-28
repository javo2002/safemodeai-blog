"use server"

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
    return null;
  }
}

export async function login(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) return { error: 'Username and password are required.' };

  const supabase = createSupabaseServerClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, role, password_hash')
    .eq('username', username)
    .single();

  if (error || !user) return { error: 'Invalid username or password.' };

  const isValidPassword = (password === user.password_hash);
  if (!isValidPassword) return { error: 'Invalid username or password.' };

  // Include id and role in the session
  const sessionUser = { id: user.id, username: user.username, role: user.role };
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const session = await encrypt({ user: sessionUser, expires });

  cookies().set('session', session, { expires, httpOnly: true });
  redirect('/admin');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/auth/signin');
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function createPost(postData: any) {
  const session = await getSession();
  if (!session?.user) return { error: 'Access Denied.' };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("posts").insert([
    {
      ...postData,
      user_id: session.user.id, // Assign ownership
      status: 'draft', // All new posts start as drafts
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
  // status is updated separately via submitForApproval or approvePost
  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: postData.content,
      category: postData.category,
      featured: postData.featured,
      image: postData.image,
      sources: postData.sources,
    })
    .eq('id', postId);

  if (error) return { error: error.message };

  revalidatePath('/admin');
  revalidatePath(`/posts/${postId}`);
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
    return { success: true };
}


// ... (keep deletePost and uploadPostImage as they are)
// ... (keep getFeaturedPosts and getAllPublishedPosts as they are, but check the 'status' column)

export async function getFeaturedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') // check against status
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function getAllPublishedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') // check against status
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}
