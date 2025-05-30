"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { PlusSquare, Edit, Settings, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-semibold text-primary hover:opacity-80 transition-opacity"
          >
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
              <SidebarMenuButton href="/admin/settings" tooltip="Settings (Future)">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
