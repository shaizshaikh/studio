
"use client";

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Login Page (Test)</h1>
      <p className="mb-4">If you see this, the /login route is working.</p>
      <p className="mb-8">The login form would go here.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
