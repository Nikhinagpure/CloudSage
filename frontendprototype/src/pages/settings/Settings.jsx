import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input defaultValue="Demo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input defaultValue="User" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue="demo@saas.com" type="email" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" />
          </div>
          <Button variant="secondary">Update Password</Button>
        </CardContent>
      </Card>
      
      <Card className="border-red-500/50 bg-red-500/5 dark:bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
