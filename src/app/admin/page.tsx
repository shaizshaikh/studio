
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, ListOrdered } from "lucide-react";

export default function AdminDashboardPage() {
  // In a real app, this page would show stats, recent articles, etc.
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      
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
            {/* Add more quick actions here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Statistics</CardTitle>
            <CardDescription>Overview of your blog's performance.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for stats - e.g., total articles, views, comments */}
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

      {/* Placeholder for a list of recent articles or other relevant info */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">More Features</h2>
        <p className="text-muted-foreground">
          This dashboard will expand with more content management tools, analytics, and settings.
        </p>
      </div>
    </div>
  );
}
