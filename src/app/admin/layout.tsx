
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, PlusSquare, Edit, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/auth/FirebaseAuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to homepage (or a general login page if we had one)
        router.push('/'); 
      } else if (!isAdmin) {
        // Logged in, but not the admin user, redirect to homepage
        console.warn("Non-admin user attempted to access admin area. Redirecting.");
        router.push('/');
      }
      // If user is present and isAdmin is true, they can stay.
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    // Render a loading state or null while checking auth and redirecting
    // This prevents a flash of admin content if the user is not authorized.
    return <div className="flex items-center justify-center min-h-screen">Verifying access...</div>;
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
            {/* Logout is handled in the main Header component */}
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
