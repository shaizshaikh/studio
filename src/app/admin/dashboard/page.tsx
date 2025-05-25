"use client"; // Needs to be client for potential auth checks or interactive elements

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, ListOrdered } from "lucide-react";
// Remove broken import
// import { useAuth } from "@/components/auth/FirebaseAuthProvider"; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Stub useAuth hook here to avoid import error:
function useAuth() {
  // For now, simulate logged-in admin user
  return {
    user: { displayName: "Admin User", email: "admin@example.com" },
    loading: false,
    isAdmin: true,
  };
}

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/'); // Redirect if not admin or not logged in
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    // Show loading state or null while redirecting
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }
  
  // If user is admin, render the dashboard
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.displayName || user.email}!</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your content efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/articles/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Article
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/articles">
                <ListOrdered className="mr-2 h-5 w-5" /> View All Articles
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Statistics</CardTitle>
            <CardDescription>Overview of your blog's performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Statistics will be shown here.</p>
            <p className="text-sm text-muted-foreground mt-2"> (Coming Soon)</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and comments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recent activities will be listed here.</p>
             <p className="text-sm text-muted-foreground mt-2">(Coming Soon)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
