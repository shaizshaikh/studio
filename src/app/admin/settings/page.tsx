
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>Manage general settings for your blog.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Settings related to site title, description, theme, etc., will be available here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">(Coming Soon)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage admin users and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User management features will appear here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">(Coming Soon)</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect with third-party services.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage integrations like analytics, email marketing, etc.
          </p>
          <p className="text-sm text-muted-foreground mt-2">(Coming Soon)</p>
        </CardContent>
      </Card>
    </div>
  );
}
