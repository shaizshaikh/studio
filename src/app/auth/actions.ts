// src/app/auth/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
// bcryptjs would be used if comparing hashed passwords.
// For this simplified dev setup, we're doing direct string comparison.
// import bcrypt from 'bcryptjs'; 

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
  const envAdminPassword = process.env.ADMIN_PASSWORD; // Plaintext password from .env

  if (!envAdminUsername || typeof envAdminPassword === 'undefined') { // Check if ADMIN_PASSWORD could be an empty string
    console.error("CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_USERNAME or ADMIN_PASSWORD not set in .env file for authentication.");
    return {
      message: 'Authentication service is not configured correctly by the administrator.',
      success: false,
      errors: { general: ['Authentication system configuration error.'] }
    };
  }

  // --- DEVELOPMENT ONLY: Plaintext Password Comparison ---
  // WARNING: This direct plaintext password comparison is for EASE OF SETUP in a
  //          DEVELOPMENT environment like Firebase Studio and is HIGHLY INSECURE
  //          for any production or publicly accessible application.
  //
  // FOR PRODUCTION DEPLOYMENT, YOU ABSOLUTELY MUST:
  // 1. Generate a strong BCRYPT HASH of your chosen admin password.
  // 2. Store this HASH (not the plaintext password) in your ADMIN_PASSWORD
  //    (or a new ADMIN_PASSWORD_HASH) environment variable.
  // 3. Update this login logic to use `await bcrypt.compare(password, envAdminPasswordHash)`
  //    for secure password verification.
  //
  // This current simplified check is ONLY to reduce manual steps for you during this dev phase.
  const DANGEROUS_plaintextPasswordCheck = (username === envAdminUsername && password === envAdminPassword);

  if (DANGEROUS_plaintextPasswordCheck) {
    const session = await getSession();
    session.username = username;
    session.isLoggedIn = true;
    await session.save(); // Explicitly save the session to set/update the cookie

    // Revalidate and redirect AFTER session is saved
    // No revalidatePath needed for login, middleware handles access control to /admin
    redirect('/admin'); 
    // redirect() throws an error to end the request, so this return is for type safety.
    return { message: 'Logged in successfully!', success: true }; 
  } else {
    if (username !== envAdminUsername) {
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
