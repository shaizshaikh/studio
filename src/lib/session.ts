// src/lib/session.ts
import { IronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import crypto from 'crypto'; // For generating a temporary secret

// --- Session Secret Configuration ---
let sessionSecret = process.env.SESSION_SECRET;
const MIN_SECRET_LENGTH = 32;

if (!sessionSecret || sessionSecret.length < MIN_SECRET_LENGTH) {
  if (process.env.NODE_ENV === 'production') {
    // This is a critical failure in production if a proper secret isn't set.
    console.error(
      `CRITICAL SECURITY WARNING: SESSION_SECRET is not set or is less than ${MIN_SECRET_LENGTH} characters long in your .env file. ` +
      'For production, a strong, persistent secret is MANDATORY. Shutting down or using a default insecure secret is risky. ' +
      'Please generate a strong secret (e.g., `openssl rand -hex 32`) and set it as SESSION_SECRET in your environment variables.'
    );
    // In a real production scenario, you might throw an error here to prevent startup with an insecure config.
    // For the context of Firebase Studio, we'll log an error and generate one, but this is NOT truly production-ready.
    sessionSecret = crypto.randomBytes(32).toString('hex'); // Generate a temporary one anyway for now
     console.warn(
      `PRODUCTION WARNING (FALLBACK): Using a dynamically generated SESSION_SECRET. Sessions WILL NOT PERSIST across server restarts or deployments. This is INSECURE for production.`
    );
  } else {
    // For development, if no secret is provided or it's too short, generate a temporary one.
    if (!sessionSecret) {
      console.warn(
        'DEVELOPMENT WARNING: SESSION_SECRET not found in .env. Generating a temporary secret. ' +
        'Sessions will not persist across server restarts. For persistent sessions during development, ' +
        `set a SESSION_SECRET (at least ${MIN_SECRET_LENGTH} characters) in your .env file (e.g., using \`openssl rand -hex 32\`).`
      );
    } else if (sessionSecret.length < MIN_SECRET_LENGTH) {
        console.warn(
            `DEVELOPMENT WARNING: SESSION_SECRET in .env is less than ${MIN_SECRET_LENGTH} characters long. ` +
            `A temporary secret is being generated. For persistent sessions and better security, please provide a longer secret. `+
            'Sessions will not persist across server restarts.'
        );
    }
    // Fallback to generating a new secret if the provided one is too short or missing for dev
     if (!sessionSecret || sessionSecret.length < MIN_SECRET_LENGTH) {
        sessionSecret = crypto.randomBytes(32).toString('hex');
    }
  }
}
// --- End Session Secret Configuration ---

export const sessionOptions = {
  password: sessionSecret, // This is used as the encryption key by iron-session
  cookieName: 'devops-digest-auth-session', // Choose a unique name for your session cookie
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    httpOnly: true, // Prevent client-side JavaScript access to the cookie
    path: '/',      // Cookie available for all paths
    maxAge: undefined, // Makes it a session cookie (expires when browser closes)
    // Alternatively, for persistent login (e.g., 7 days):
    // maxAge: 60 * 60 * 24 * 7, // in seconds
  },
};

// Define the shape of your session data
export interface SessionData {
  username?: string;
  isLoggedIn?: boolean;
  // You can add other properties like userId, roles, etc.
}

// Helper function to get the current session from the cookies
export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await IronSession.fromCookies<SessionData>(cookies(), sessionOptions);
  
  // Ensure default structure if session is new or IronSessionData is empty
  if (session.username === undefined) {
    session.username = undefined; // Explicitly set to undefined if not present
  }
  if (session.isLoggedIn === undefined) {
    session.isLoggedIn = false; // Default to false if not present
  }
  return session;
}
