// src/app/auth/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs'; 

export type LoginFormState = {
  message: string;
  success: boolean;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string[];
  };
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return {
      message: 'Username and password are required.',
      success: false,
      errors: { 
        general: ['Username and password are required.']
      }
    };
  }

  const envAdminUsername = process.env.ADMIN_USERNAME;
  const envAdminPasswordHash = process.env.ADMIN_PASSWORD_HASH; // HASHED password from .env

  if (!envAdminUsername || !envAdminPasswordHash) {
    console.error("CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set in .env file for authentication.");
    return {
      message: 'Authentication service is not configured correctly by the administrator.',
      success: false,
      errors: { general: ['Authentication system configuration error.'] }
    };
  }

  const isUsernameMatch = (username === envAdminUsername);
  let isPasswordMatch = false;
  if (isUsernameMatch && password && envAdminPasswordHash) {
    try {
      isPasswordMatch = await bcrypt.compare(password, envAdminPasswordHash);
    } catch (compareError) {
      console.error("Error comparing password hash:", compareError);
      // Treat hash comparison errors as a login failure to be safe
      isPasswordMatch = false;
    }
  }
  
  if (isUsernameMatch && isPasswordMatch) {
    const session = await getSession();
    session.username = username;
    session.isLoggedIn = true;
    await session.save(); // Explicitly save the session to set/update the cookie

    redirect('/admin'); 
    // redirect() throws an error to end the request, so this return is for type safety.
    return { message: 'Logged in successfully!', success: true }; 
  } else {
    if (!isUsernameMatch) {
        console.warn(`Login attempt failed: Incorrect username "${username}".`);
    } else {
        console.warn(`Login attempt failed for username "${username}": Incorrect password.`);
    }
    return {
      message: 'Invalid username or password.',
      success: false,
      errors: { general: ['Invalid username or password.'] }
    };
  }
}

export async function logoutAction() {
  const session = await getSession();
  await session.destroy(); // Destroys the session and clears the cookie
  redirect('/login');
}
