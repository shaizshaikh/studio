
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
          console.log("Auth Error: Missing credentials in authorize");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
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
          const passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);
          if (passwordMatch) {
            // Any object returned will be saved in `user` property of the JWT / session
            return { id: "1", name: adminUsername, email: adminUsername };
          } else {
            console.log("Auth Error: Password does not match");
            return null;
          }
        } catch (error) {
          console.error("Auth Error: Error comparing password with bcrypt:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // The custom login page
    // error: '/auth/error', // Optional: Custom error page for auth errors
  },
  session: {
    strategy: "jwt", // Using JWT for sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id and email to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email; // Ensure email is in token
        token.name = user.name;   // Ensure name is in token
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string; // Ensure email is in session
        session.user.name = token.name as string;   // Ensure name is in session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret used to sign and encrypt JWTs and cookies
  // debug: process.env.NODE_ENV === 'development', // Optional: Enable for more logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
