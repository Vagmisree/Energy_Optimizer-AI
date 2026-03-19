'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, X, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Peak Hour Alert',
      message: 'Peak rates start in 15 minutes. Turn off non-essential devices.',
      time: 'now',
      icon: '⏰'
    },
    {
      id: 2,
      type: 'success',
      title: 'Savings Milestone',
      message: 'You\'ve saved ₹500 this month! Keep up the great work.',
      time: '2h ago',
      icon: '🎉'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Usage Spike',
      message: 'Usage increased by 25% today. Check running appliances.',
      time: '4h ago',
      icon: '⚠️'
    },
  ])

  const dismissNotification = (id: number) => {
    setNotifications(n => n.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative h-10 w-10 rounded-lg hover:bg-primary/10"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 glass rounded-xl p-4 z-50 border border-primary/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{notif.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissNotification(notif.id)}
                      className="h-6 w-6 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  )
}

export function LiveStatusBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Card className="glass p-4 flex items-start gap-4 bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-l-amber-500">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm">System Status Update</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Peak hour pricing active until 10 PM. Now is a great time to shift non-essential loads!
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDismissed(true)}
        className="h-6 w-6 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </Card>
  )
}
