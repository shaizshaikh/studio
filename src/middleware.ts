
export { default } from "next-auth/middleware";

export const config = {
  // Matcher to protect all routes under /admin
  matcher: ["/admin/:path*"],
  // Note: The signIn page is configured in the NextAuth options (pages.signIn)
  // in src/app/api/auth/[...nextauth]/route.ts
};
