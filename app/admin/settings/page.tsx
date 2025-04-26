"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Key, RefreshCcw, Download, Upload, Bell, User, Lock, Copy, Trash2, Eye, EyeOff, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

function PasswordStrength({ value }: { value: string }) {
  let score = 0;
  if (value.length > 7) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const colors = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className={`h-2 w-24 rounded ${colors[score - 1] || "bg-gray-200"}`}></div>
      <span className="text-xs text-muted-foreground">{["Weak", "Fair", "Good", "Strong"][score - 1] || ""}</span>
    </div>
  );
}

export default function AdminSettingsPage() {
  // Profile
  const [avatar, setAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // Security
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, key: "sk-1234-xxxx", active: true, lastUsed: "2024-06-01" },
    { id: 2, key: "sk-5678-yyyy", active: false, lastUsed: "2024-05-20" },
  ]);
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  // Backup
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);
  // Notifications
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [testNotif, setTestNotif] = useState(false);

  // Handlers
  const handleCopyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };
  const handleRevokeKey = (id: number) => {
    if (window.confirm("Are you sure you want to revoke this API key?")) {
      setApiKeys(keys => keys.map(k => k.id === id ? { ...k, active: false } : k));
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleTestNotification = () => {
    setTestNotif(true);
    setTimeout(() => setTestNotif(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Admin Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-blue-50/60 p-2 rounded-lg flex gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2"><Lock className="h-4 w-4" />Security</TabsTrigger>
          <TabsTrigger value="apikeys" className="flex items-center gap-2"><Key className="h-4 w-4" />API Keys</TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2"><RefreshCcw className="h-4 w-4" />Backup/Restore</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
        </TabsList>
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="shadow-lg border bg-white/90">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your admin information and avatar</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Admin Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" />
                </div>
                <Button variant="outline" className="text-blue-600 border-blue-600">Update Profile</Button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-blue-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-600" onClick={() => avatarInputRef.current?.click()}>
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-lg border bg-white/90">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your admin password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type={showPassword ? "text" : "password"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} />
                <PasswordStrength value={password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type={showPassword ? "text" : "password"} />
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showPassword ? "Hide" : "Show"} Password
              </Button>
              <Button variant="outline" className="text-blue-600 border-blue-600 mt-2">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* API Keys Tab */}
        <TabsContent value="apikeys">
          <Card className="shadow-lg border bg-white/90">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Key</th>
                      <th>Status</th>
                      <th>Last Used</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="border-b last:border-0">
                        <td className="py-2 font-mono">{key.key}</td>
                        <td>
                          <Badge variant={key.active ? "default" : "outline"} className={key.active ? "bg-blue-600" : ""}>{key.active ? "Active" : "Revoked"}</Badge>
                        </td>
                        <td>{key.lastUsed}</td>
                        <td className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleCopyKey(key.id, key.key)} title="Copy">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleRevokeKey(key.id)} title="Revoke" disabled={!key.active}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {copiedKeyId === key.id && <span className="text-xs text-green-600 ml-1">Copied!</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-600 mt-2" onClick={() => setShowKeyModal(true)}>Generate New Key</Button>
              {showKeyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h3 className="font-semibold mb-2">Generate New API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">Are you sure you want to generate a new API key? This will be shown only once.</p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setShowKeyModal(false)}>Cancel</Button>
                      <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => { setShowKeyModal(false); /* Add real logic here */ }}>Generate</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Backup/Restore Tab */}
        <TabsContent value="backup">
          <Card className="shadow-lg border bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Download a backup or restore your admin data. Restoring will overwrite current data.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-600" onClick={() => setBackupProgress(100)}>
                  <Download className="h-4 w-4" /> Download Backup
                </Button>
                <span className="text-xs text-muted-foreground">Last backup: 2024-06-01</span>
              </div>
              {backupProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${backupProgress}%` }}></div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input type="file" onChange={e => setRestoreFile(e.target.files?.[0] || null)} className="max-w-xs" />
                <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-600" disabled={!restoreFile}>
                  <Upload className="h-4 w-4" /> Restore Data
                </Button>
              </div>
              {restoreFile && <span className="text-xs text-muted-foreground">Selected: {restoreFile.name}</span>}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-lg border bg-white/90">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive admin notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive instant updates about system activity</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Get updates about new features and offers</p>
                  </div>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <Label>Test Notification</Label>
                    <p className="text-sm text-muted-foreground">Send a test notification to your device</p>
                  </div>
                </div>
                <Button variant="outline" className="text-blue-600 border-blue-600" onClick={handleTestNotification}>Test</Button>
                {testNotif && <span className="text-green-600 text-xs ml-2">Sent!</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 