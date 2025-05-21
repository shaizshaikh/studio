"use server";

import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

console.log("NextAuth API route loaded...");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("AUTHORIZE FUNCTION CALLED in NextAuth API route");
        if (!credentials?.email || !credentials.password) {
          console.log("Auth Error: Missing credentials in authorize function.");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error(
            "CRITICAL AUTH CONFIG ERROR: ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set in environment variables."
          );
          return null; // Critical config error
        }
        
        console.log("Credentials received:", { email: credentials.email }); // Don't log password
        console.log("Comparing with ADMIN_USERNAME:", adminUsername);
        // console.log("Comparing with ADMIN_PASSWORD_HASH:", adminPasswordHash); // Avoid logging hash unless deep debugging

        const emailMatch = credentials.email.toLowerCase() === adminUsername.toLowerCase();
        
        if (!emailMatch) {
          console.log("Auth Error: Email does not match.");
          return null;
        }

        // Securely compare the submitted password with the stored hash
        try {
          const passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);
          if (passwordMatch) {
            console.log("Successful authentication for:", adminUsername);
            // Return a user object
            return { id: "1", name: adminUsername, email: adminUsername };
          } else {
            console.log("Auth Error: Password does not match for user:", adminUsername);
            return null; // Indicates failed authentication
          }
        } catch (error) {
          console.error("Error during bcrypt.compare:", error);
          return null; // Error during password comparison
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // error: '/auth/error', // Optional: Custom error page for auth errors
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.email = user.email; // email is already part of the default token
        // token.name = user.name; // name is already part of the default token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // session.user.email = token.email as string; // already there
        // session.user.name = token.name as string; // already there
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development', // Enable for more logs during development
};

console.log("authOptions defined in NextAuth API route:", { 
  signInPage: authOptions.pages?.signIn, 
  secretPresent: !!authOptions.secret 
});


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };