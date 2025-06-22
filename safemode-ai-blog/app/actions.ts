"use server"

import { SignJWT, jwtVerify } from 'jose';
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

async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        // This can happen if the token is invalid or expired
        console.error("Failed to decrypt session:", error);
        return null;
    }
}

export async function login(formData: FormData) {
  // ... (login logic remains the same)
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === 'admin' && password === 'safemode2024') {
    const user = { username: 'admin', role: 'admin' };
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });
    cookies().set('session', session, { expires, httpOnly: true });
  } else if (username === 'user' && password === 'password') {
    const user = { username: 'user', role: 'user' };
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });
    cookies().set('session', session, { expires, httpOnly: true });
  } else {
    return { error: 'Invalid username or password' };
  }
  redirect('/');
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
