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
    .setExpirationTime('1h')
    .sign(key);
}

async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error("Failed to decrypt session:", error);
        return null;
    }
}

export async function login(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { data: admin, error: queryError } = await supabase
    .from('admins')
    .select('username, role, password_hash')
    .eq('username', username)
    .single();

  if (queryError || !admin) {
    return { error: 'Invalid username or password.' };
  }

  const isValidPassword = (password === admin.password_hash);
  if (!isValidPassword) {
    return { error: 'Invalid username or password.' };
  }

  const user = { username: admin.username, role: admin.role };
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

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
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("posts").insert([{ ...postData }]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updatePost(postId: string, postData: any) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('posts').update({ ...postData }).eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/posts/${postId}`);
  revalidatePath('/admin');
  redirect('/admin');
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/admin');
  return { success: true };
}

export async function uploadPostImage(formData: FormData) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }

  const supabase = createSupabaseServerClient();
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file provided.' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${session.user.username}-${Date.now()}.${fileExt}`;
  const filePath = `${session.user.username}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from('post-images').upload(filePath, file);

  if (uploadError) {
    return { error: 'Failed to upload image.' };
  }

  const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(filePath);
  return { publicUrl };
}

export async function getFeaturedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Server Action Error fetching featured posts:", error);
    return []; 
  }
  return data;
}

export async function getAllPublishedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Server Action Error fetching all posts:", error);
    return [];
  }
  return data;
}
