
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Ensure bcryptjs is imported

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials in authorize");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH; // This is the HASH from .env

        // IMPORTANT SECURITY NOTE:
        // The ADMIN_PASSWORD_HASH in .env should be a bcrypt HASH of the password.
        // We are comparing the submitted plaintext password with this stored hash.

        if (!adminUsername || !adminPasswordHash) {
          console.error("CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set in environment variables.");
          return null; // Or throw an error
        }
        
        const emailMatch = credentials.email === adminUsername;
        if (!emailMatch) {
          console.log("Username does not match");
          return null;
        }

        try {
          const passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);
          if (passwordMatch) {
            // Any object returned will be saved in `user` property of the JWT
            return { id: "1", name: adminUsername, email: adminUsername };
          } else {
            console.log("Password does not match");
            return null;
          }
        } catch (error) {
          console.error("Error comparing password with bcrypt:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // The page to redirect to for signing in
    // error: '/auth/error', // Optional: Custom error page
  },
  session: {
    strategy: "jwt", // Using JWT for sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Add any other user properties to the token here
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Add any other properties from token to session.user here
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret used to sign and encrypt JWTs and cookies
  // debug: process.env.NODE_ENV === 'development', // Optional: Enable debug messages in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
