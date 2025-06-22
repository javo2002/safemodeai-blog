"use server"

import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET || "default-secret-key-for-development";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
}

export async function login(formData: FormData) {
  // In a real application, you'd verify the credentials against a database
  const username = formData.get('username');
  const password = formData.get('password');

  // For demonstration, using hardcoded credentials.
  // REPLACE THIS with your actual authentication logic.
  if (username === 'admin' && password === 'safemode2024') {
    const user = { username: 'admin', role: 'admin' };

    // Create the session
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });

  } else if (username === 'user' && password === 'password') {
    const user = { username: 'user', role: 'user' };

    // Create the session
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
  } else {
    // Return an error message if login fails
    return { error: 'Invalid username or password' };
  }

  // Redirect to the home page on successful login
  redirect('/');
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/auth/signin');
}
