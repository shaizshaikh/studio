// src/lib/session.ts
import { IronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// --- Session Secret Configuration ---
let sessionSecret = process.env.SESSION_SECRET;
const MIN_SECRET_LENGTH = 32;

if (!sessionSecret || sessionSecret.length < MIN_SECRET_LENGTH) {
  const warningMessage =
    `SESSION_SECRET is not set, is less than ${MIN_SECRET_LENGTH} characters long, or was auto-generated. ` +
    'For production, a strong, persistent secret is MANDATORY. ' +
    'If this is a development environment and the secret was auto-generated, sessions WILL NOT PERSIST across server restarts. ' +
    'To enable persistent sessions, set a strong SESSION_SECRET (e.g., `openssl rand -hex 32`) in your .env file.';

  if (process.env.NODE_ENV === 'production') {
    console.error(`CRITICAL SECURITY WARNING: ${warningMessage}`);
    // In a real production scenario, you might throw an error or exit to prevent startup with an insecure config.
    // For Firebase Studio context, we'll allow fallback to a generated one but log a critical error.
    sessionSecret = crypto.randomBytes(32).toString('hex');
    console.warn(
        `PRODUCTION FALLBACK: Using a dynamically generated SESSION_SECRET. Sessions WILL NOT PERSIST across server restarts or deployments. This is INSECURE for production.`
      );
  } else {
    // For development, if no secret is provided or it's too short, generate a temporary one and warn.
    console.warn(`DEVELOPMENT WARNING: ${warningMessage}`);
    if (!sessionSecret || sessionSecret.length < MIN_SECRET_LENGTH) {
        sessionSecret = crypto.randomBytes(32).toString('hex');
    }
  }
}
// --- End Session Secret Configuration ---

export const sessionOptions = {
  password: sessionSecret,
  cookieName: 'devops-digest-auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    maxAge: undefined, // Session cookie by default (expires when browser closes)
    // For persistent login (e.g., 7 days):
    // maxAge: 60 * 60 * 24 * 7, // in seconds
    sameSite: 'lax' as 'lax' | 'strict' | 'none' | undefined, // Added for modern browsers
  },
};

export interface SessionData {
  username?: string;
  isLoggedIn?: boolean;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await IronSession.fromCookies<SessionData>(cookies(), sessionOptions);
  
  // Ensure default structure if session is new or IronSessionData is empty
  // This is crucial for the middleware check.
  if (session.isLoggedIn === undefined) {
    session.isLoggedIn = false; 
  }
  if (session.username === undefined) {
    session.username = undefined;
  }
  return session;
}
