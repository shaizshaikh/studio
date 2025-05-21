
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, PlusSquare, Edit, Settings } from 'lucide-react'; // Removed LogOut for now

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Authentication checks will be re-implemented with Firebase Auth.
  // For now, we assume the user is authenticated if they reach this layout.

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/admin" className="text-2xl font-semibold text-primary hover:opacity-80 transition-opacity">
            Admin Panel
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" tooltip="Dashboard">
                <Home />
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
              <SidebarMenuButton href="/admin/settings" tooltip="Settings (Placeholder)">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Logout button/form will be re-added here based on Firebase Auth state */}
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
