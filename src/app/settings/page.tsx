import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/settings/ThemeToggle";
import Image from "next/image";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Settings</CardTitle>
            <CardDescription>Manage your application preferences and account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Appearance</h3>
              <ThemeToggle />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium text-foreground">Account (Placeholder)</h3>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="User123" disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled />
              </div>
              <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium text-foreground">Notifications (Placeholder)</h3>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders" className="text-base">Task Reminders</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Receive notifications for upcoming due dates.
                  </p>
                </div>
                <Switch id="task-reminders" aria-label="Toggle task reminders" disabled />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Get important updates via email.
                  </p>
                </div>
                <Switch id="email-notifications" aria-label="Toggle email notifications" defaultChecked disabled/>
              </div>
            </div>
          </CardContent>
        </Card>
         <div className="text-center p-6 bg-card rounded-lg shadow-md">
            <Image src="https://picsum.photos/seed/settings_footer/400/200" alt="Decorative settings image" width={400} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="abstract tech" />
            <p className="text-muted-foreground">More settings and features coming soon!</p>
        </div>
      </div>
    </AppLayout>
  );
}
