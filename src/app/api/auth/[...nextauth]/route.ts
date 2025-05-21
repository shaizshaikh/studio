import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs"; // Temporarily commented out for plaintext comparison

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          console.log("Auth Error: Missing credentials in authorize");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        // DANGEROUS: Using plaintext password from .env for debugging "Failed to fetch"
        // This is INSECURE and for DIAGNOSTIC PURPOSES ONLY.
        // In production, ADMIN_PASSWORD should be a HASH (e.g., ADMIN_PASSWORD_HASH)
        // and you MUST use bcrypt.compare().
        const adminPassword = process.env.ADMIN_PASSWORD; 

        if (!adminUsername || !adminPassword) {
          console.error(
            "CRITICAL AUTH CONFIG ERROR: ADMIN_USERNAME or ADMIN_PASSWORD (plaintext for debug) is not set in environment variables."
          );
          return null;
        }

        const emailMatch = credentials.email.toLowerCase() === adminUsername.toLowerCase();

        // DANGEROUS: Direct plaintext password comparison for debugging.
        // REVERT TO BCRYPT HASH COMPARISON FOR PRODUCTION.
        const passwordMatch = credentials.password === adminPassword;

        if (emailMatch && passwordMatch) {
          console.log("Successful plaintext authentication (DEBUG MODE)");
          // Return a user object
          return { id: "1", name: adminUsername, email: adminUsername };
        } else {
          console.log("Auth Error: Email or Password does not match (plaintext check)");
          return null;
        }

        /*
        // SECURE BCRYPT PASSWORD COMPARISON (Use this for production)
        // Ensure ADMIN_PASSWORD_HASH is set in .env
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error("CRITICAL AUTH CONFIG ERROR: ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set in environment variables.");
          return null;
        }
        
        const emailMatch = credentials.email.toLowerCase() === adminUsername.toLowerCase();
        
        if (!emailMatch) {
          console.log("Auth Error: Username does not match");
          return null;
        }

        try {
          // Ensure bcrypt is installed: npm install bcryptjs @types/bcryptjs
          const passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);
          if (passwordMatch) {
            console.log("Successful bcrypt authentication");
            return { id: "1", name: adminUsername, email: adminUsername };
          } else {
            console.log("Auth Error: Password does not match (bcrypt check)");
            return null;
          }
        } catch (error) {
          console.error("Auth Error: Error comparing password with bcrypt:", error);
          return null;
        }
        */
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
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development', // Enable for more logs during development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
