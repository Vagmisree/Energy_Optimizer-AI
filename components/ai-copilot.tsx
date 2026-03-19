'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Send, Loader2 } from 'lucide-react'

export function AICopilot() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Energy AI Copilot. Ask me anything about your energy consumption, bills, or recommendations. For example: "Why is my bill high?" or "How can I save more energy?"'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let assistantResponse = ''
      
      if (userMessage.toLowerCase().includes('bill')) {
        assistantResponse = 'Your bill has increased by 15% this month, primarily due to increased AC usage during peak hours (2-5 PM). The weather has been hotter, and your AC is running 3 hours more daily. I recommend pre-cooling your home during off-peak hours (6-9 AM) to save ₹180/month.'
      } else if (userMessage.toLowerCase().includes('save')) {
        assistantResponse = 'Here are the top 3 ways to save money immediately:\n1. Shift AC usage to off-peak hours: ₹180/month\n2. Replace incandescent bulbs with LED: ₹720/month\n3. Disable phantom loads: ₹150/month\nTotal potential savings: ₹1,050/month!'
      } else if (userMessage.toLowerCase().includes('appliance')) {
        assistantResponse = 'Your AC is the largest energy consumer at 45% of your total usage. Followed by water heater (20%) and refrigerator (15%). Focus on AC optimization for maximum impact.'
      } else {
        assistantResponse = 'I can help! Try asking: "Why is my bill high?", "How can I save more?", "Which appliance uses most energy?", or "What are my recommendations?"'
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4 p-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask me about your energy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          className="bg-muted/50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function NotificationsCenter() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Usage Spike Alert',
      message: 'Your energy usage is 25% higher than usual today.',
      time: '15 mins ago',
      icon: '⚠️'
    },
    {
      id: 2,
      type: 'success',
      title: 'Monthly Savings Achieved',
      message: 'You saved ₹450 this month by shifting appliance usage!',
      time: '2 hours ago',
      icon: '🎉'
    },
    {
      id: 3,
      type: 'info',
      title: 'Peak Hour Coming',
      message: 'Peak rates start in 30 minutes. Turn off non-essential devices.',
      time: '5 hours ago',
      icon: '⏰'
    },
    {
      id: 4,
      type: 'success',
      title: 'Goal Progress',
      message: 'You\'re 76% towards your ₹500/month savings goal!',
      time: '1 day ago',
      icon: '🌟'
    }
  ])

  const typeColors = {
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-700'
  }

  return (
    <div className="space-y-2">
      {notifications.map((notif) => (
        <Card
          key={notif.id}
          className={`glass p-4 border-l-4 cursor-pointer hover:shadow-md transition-all ${
            typeColors[notif.type as keyof typeof typeColors]
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{notif.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notif.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
