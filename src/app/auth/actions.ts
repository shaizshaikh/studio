
'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export type LoginFormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const envAdminUsername = process.env.ADMIN_USERNAME;
  const envAdminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (!envAdminUsername || !envAdminPasswordHash) {
    console.error(
      'CRITICAL: Admin username or password hash is not set in environment variables.'
    );
    return { error: 'Server configuration error. Please contact administrator.' };
  }

  const isUsernameMatch = email === envAdminUsername;
  let isValidPassword = false;

  if (isUsernameMatch) {
    try {
      isValidPassword = await bcrypt.compare(password, envAdminPasswordHash);
    } catch (bcryptError) {
      console.error('Error comparing password with bcrypt:', bcryptError);
      return { error: 'An error occurred during login. Please try again.' };
    }
  }

  if (isUsernameMatch && isValidPassword) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.username = email;
    await session.save();
    redirect('/admin');
    // Note: The redirect will prevent this return from being reached by the client,
    // but it's good practice for type consistency.
    // return { success: true, message: 'Logged in successfully!' }; 
  } else {
    return { error: 'Invalid username or password.' };
  }
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}
