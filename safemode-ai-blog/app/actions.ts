// File: app/actions.ts

"use server"

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// --- NEW: Import the server client to query the database ---
import { createSupabaseServerClient } from '@/lib/supabase/server';

const secretKey = process.env.SESSION_SECRET || "default-secret-key-for-development";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Session expires in 1 hour
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

// --- REWRITTEN LOGIN LOGIC ---
export async function login(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  // Create a Supabase client that can safely run on the server
  const supabase = createSupabaseServerClient();

  // Query the 'admins' table for a matching username
  const { data: admin, error: queryError } = await supabase
    .from('admins')
    .select('username, role, password_hash')
    .eq('username', username)
    .single();

  if (queryError || !admin) {
    console.error("Login attempt failed for user:", username, queryError);
    return { error: 'Invalid username or password.' };
  }

  // --- IMPORTANT: Password Verification ---
  // In a real app, you would use a library like bcrypt to compare the hash.
  // const isValidPassword = await bcrypt.compare(password, admin.password_hash);
  // For this example, we'll do a simple string comparison.
  // REMEMBER TO REPLACE THIS WITH A REAL HASHING LIBRARY.
  const isValidPassword = (password === admin.password_hash);

  if (!isValidPassword) {
    return { error: 'Invalid username or password.' };
  }

  // If credentials are valid, create the session
  const user = { username: admin.username, role: admin.role };
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ user, expires });

  cookies().set('session', session, { expires, httpOnly: true });

  // Redirect to the admin dashboard on successful login
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

// --- ADD THIS NEW SERVER ACTION AT THE END OF THE FILE ---
export async function createPost(postData: any) {
  const session = await getSession();
  
  // 1. Check if the user is an admin
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied. You must be an administrator.' };
  }

  // 2. Use the secure server client to perform the insert
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("posts")
    .insert([
      {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        featured: postData.featured,
        image: postData.image,
        published: postData.published,
        sources: postData.sources,
      },
    ]);

  if (error) {
    console.error("Server Action Error creating post:", error);
    return { error: error.message };
  }

  // On success, return a success message (or the new post data)
  return { success: true };
}

// --- ADD THIS NEW SERVER ACTION AT THE END OF THE FILE ---
export async function getFeaturedPosts() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, category, image, createdAt')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Server Action Error fetching featured posts:", error);
    // In a real app, you might want to handle this error more gracefully
    return []; 
  }

  return data;
}

// --- ADD THIS NEW SERVER ACTION AT THE END OF THE FILE ---
export async function getAllPublishedPosts() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, category, image, created_at') // Corrected column name to created_at
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Server Action Error fetching all posts:", error);
    return []; 
  }

  return data;
}

// File: app/actions.ts

// ... (keep all the existing code for login, createPost, getFeaturedPosts, etc.)

// --- ADD THE updatePost ACTION ---
export async function updatePost(postId: string, postData: any) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: postData.content,
      category: postData.category,
      featured: postData.featured,
      image: postData.image,
      published: postData.published,
      sources: postData.sources,
      // updated_at is handled automatically by the database trigger
    })
    .eq('id', postId);

  if (error) {
    console.error("Server Action Error updating post:", error);
    return { error: error.message };
  }
  return { success: true };
}

// --- ADD THE deletePost ACTION ---
export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Access Denied.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  if (error) {
    console.error("Server Action Error deleting post:", error);
    return { error: error.message };
  }
  return { success: true };
}
