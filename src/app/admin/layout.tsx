
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { PlusSquare, Edit, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/auth/FirebaseAuthProvider'; // Using Firebase Auth
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to homepage.
        // User can then use the "Sign in" button in the main header.
        console.log("AdminLayout: No user found, redirecting to /");
        router.push('/');
      } else if (!isAdmin) {
        // Logged in, but not the admin user, redirect to homepage.
        console.warn("AdminLayout: Non-admin user attempted to access admin area. Redirecting to /");
        router.push('/');
      }
      // If user is present and isAdmin is true, they can stay.
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    // Render a loading state or null while checking auth and redirecting.
    // This prevents a flash of admin content if the user is not authorized.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg mb-4">Verifying admin access...</p>
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // If execution reaches here, user is authenticated and is an admin.
  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/admin/dashboard" className="text-2xl font-semibold text-primary hover:opacity-80 transition-opacity">
            Admin Panel
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/dashboard" tooltip="Dashboard">
                <LayoutDashboard /> 
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/articles/new" tooltip="New Article">
                <PlusSquare />
                <span>New Article</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/articles" tooltip="Manage Articles">
                <Edit />
                <span>Manage Articles</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Logout is handled in the main Header component via Firebase Auth */}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6 md:p-8 ml-0 md:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]/sidebar-wrapper:md:ml-[var(--sidebar-width)] transition-all duration-200 ease-linear">
        <div className="md:hidden mb-4">
            <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
