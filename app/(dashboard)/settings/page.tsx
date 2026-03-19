"use client"

import { useState } from "react"
import { Settings, User, Bell, Shield, Palette, Zap, MapPin, Home, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "home", name: "Home Setup", icon: Home },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "privacy", name: "Privacy", icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai",
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    usageAlerts: true,
    savingsTips: true,
    weeklyReport: true,
    monthlyReport: true,
  })
  
  // Home settings
  const [homeSettings, setHomeSettings] = useState({
    homeSize: "1500",
    residents: "4",
    electricityProvider: "Tata Power",
    tariffPlan: "Residential",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground glow-sm"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass rounded-2xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">Update your personal information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
                <p className="text-sm text-muted-foreground">Control how you receive updates</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Browser and mobile alerts</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Text message alerts</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Alert Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Usage Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified about unusual usage patterns</p>
                      </div>
                      <Switch
                        checked={notifications.usageAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, usageAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Savings Tips</p>
                        <p className="text-sm text-muted-foreground">Receive AI-powered saving recommendations</p>
                      </div>
                      <Switch
                        checked={notifications.savingsTips}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, savingsTips: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Summary of your weekly energy usage</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">Monthly Reports</p>
                        <p className="text-sm text-muted-foreground">Detailed monthly analysis</p>
                      </div>
                      <Switch
                        checked={notifications.monthlyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Home Setup</h2>
                <p className="text-sm text-muted-foreground">Configure your home details for accurate predictions</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeSize">Home Size (sq ft)</Label>
                  <Input
                    id="homeSize"
                    type="number"
                    value={homeSettings.homeSize}
                    onChange={(e) => setHomeSettings({ ...homeSettings, homeSize: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residents">Number of Residents</Label>
                  <Input
                    id="residents"
                    type="number"
                    value={homeSettings.residents}
                    onChange={(e) => setHomeSettings({ ...homeSettings, residents: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Electricity Provider</Label>
                  <Input
                    id="provider"
                    value={homeSettings.electricityProvider}
                    onChange={(e) => setHomeSettings({ ...homeSettings, electricityProvider: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tariff">Tariff Plan</Label>
                  <Input
                    id="tariff"
                    value={homeSettings.tariffPlan}
                    onChange={(e) => setHomeSettings({ ...homeSettings, tariffPlan: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tip:</span> Accurate home details help our AI provide more precise energy predictions and savings recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize the look and feel</p>
              </div>
              
              <div className="p-4 rounded-xl bg-background/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">Switch between light and dark mode using the toggle in the sidebar</p>
                  </div>
                  <Palette className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border-2 border-border bg-background text-center cursor-pointer hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3" />
                  <p className="font-medium text-foreground">Light Mode</p>
                  <p className="text-xs text-muted-foreground">Clean and minimal</p>
                </div>
                <div className="p-6 rounded-xl border-2 border-primary bg-card text-center cursor-pointer glow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 mx-auto mb-3" />
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Privacy Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your data and privacy preferences</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium text-foreground">Usage Analytics</p>
                    <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium text-foreground">Personalized Recommendations</p>
                    <p className="text-sm text-muted-foreground">Allow AI to learn from your patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium text-foreground">Data Sharing with Provider</p>
                    <p className="text-sm text-muted-foreground">Share data with your electricity provider</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="text-destructive hover:text-destructive rounded-xl">
                  Delete All My Data
                </Button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl glow"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
