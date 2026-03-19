"use client"

import { useState, useRef, useEffect } from "react"

import { Bot, Send, User, Sparkles, Zap, Lightbulb, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  { icon: TrendingDown, text: "How can I reduce my electricity bill?" },
  { icon: Zap, text: "Which appliances use the most energy?" },
  { icon: Lightbulb, text: "What are the best energy-saving tips?" },
  { icon: Sparkles, text: "Analyze my consumption patterns" },
]

const aiResponses: Record<string, string> = {
  "how can i reduce my electricity bill": `Based on your usage patterns, here are personalized recommendations to reduce your bill:

**1. Optimize AC Usage (Save ₹400-600/month)**
- Set temperature to 24-25°C instead of lower settings
- Clean filters monthly for 15% better efficiency
- Use timer to turn off during sleeping hours

**2. Switch to LED Lighting (Save ₹200-300/month)**
- Replace incandescent bulbs with LED
- Use task lighting instead of room lighting
- Install motion sensors in less-used areas

**3. Shift to Off-Peak Hours (Save ₹150-250/month)**
- Run washing machine after 10 PM
- Charge devices during off-peak hours
- Schedule heavy appliances for weekends

**Potential Total Savings: ₹750-1,150/month**`,

  "which appliances use the most energy": `Based on your home analysis, here's your energy consumption breakdown:

**Top Energy Consumers:**

1. **Air Conditioner - 40%** (₹1,140/month)
   - Tip: Each degree higher saves 6% energy

2. **Refrigerator - 18%** (₹513/month)
   - Tip: Keep it 3/4 full for optimal efficiency

3. **Water Heater - 15%** (₹428/month)
   - Tip: Lower thermostat to 50°C

4. **Lighting - 12%** (₹342/month)
   - Tip: LED bulbs use 75% less energy

5. **Others - 15%** (₹428/month)
   - TV, computer, fans, etc.

**Quick Win:** Focusing on AC optimization alone could save you ₹400-600/month!`,

  "what are the best energy-saving tips": `Here are the most effective energy-saving tips for your home:

**Immediate Actions (No Cost):**
- Unplug devices when not in use (saves ₹100-150/month)
- Use natural light during daytime
- Turn off lights when leaving a room
- Set AC to 24°C minimum

**Short-term Investments (₹1,000-5,000):**
- LED bulbs - payback in 3-4 months
- Smart power strips - eliminates phantom loads
- Timer switches for water heater
- Ceiling fan regulators

**Long-term Investments (₹10,000+):**
- 5-star rated appliances
- Solar water heater
- Rooftop solar panels
- Smart home automation

**Your Personalized Priority:**
Start with AC optimization and LED conversion - these two changes alone can reduce your bill by 25-30%!`,

  "analyze my consumption patterns": `I've analyzed your energy consumption patterns over the past 3 months:

**Key Findings:**

**Peak Usage Times:**
- Highest: 6 PM - 10 PM (40% of daily usage)
- Secondary peak: 2 PM - 4 PM (AC usage)
- Lowest: 11 PM - 6 AM

**Weekly Patterns:**
- Weekends show 25% higher usage
- Saturday is your highest consumption day
- Tuesday-Wednesday are most efficient

**Monthly Trends:**
- Summer months (Apr-Jun): +35% usage
- Monsoon (Jul-Sep): -15% usage
- Winter (Oct-Feb): +10% usage

**Efficiency Score: 78/100**

**Recommendations:**
1. Shift 30% of peak usage to off-peak hours
2. Install a programmable thermostat
3. Consider solar panels for daytime usage

Implementing these changes could improve your score to 90+ and save ₹800-1,200/month!`,
}

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  for (const [key, response] of Object.entries(aiResponses)) {
    if (lowerMessage.includes(key) || key.split(" ").some(word => lowerMessage.includes(word))) {
      return response
    }
  }
  
  return `Thank you for your question! Based on your energy profile, I can help you with:

- **Bill Reduction Strategies** - Personalized tips to lower your electricity costs
- **Appliance Optimization** - Identify and optimize high-consumption devices
- **Usage Pattern Analysis** - Understand your consumption habits
- **Savings Calculations** - Estimate potential savings from changes

Your current energy score is **78/100**, and there's potential to save **₹500-1,200/month** with the right optimizations.

What specific aspect would you like me to focus on?`
}

// Format time consistently to avoid hydration mismatch
function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${formattedHours}:${formattedMinutes} ${ampm}`
}

const initialMessage: Omit<Message, 'timestamp'> & { timestamp?: Date } = {
  id: "1",
  role: "assistant",
  content: `Hello! I'm your AI Energy Assistant. I can help you:

- Analyze your energy consumption patterns
- Provide personalized savings recommendations
- Answer questions about reducing electricity bills
- Suggest optimal usage schedules

What would you like to know about your energy usage?`,
}

export default function AssistantPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Set mounted state and initialize messages on client only
  useEffect(() => {
    setMounted(true)
    setMessages([{ ...initialMessage, timestamp: new Date() }])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(input),
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, aiMessage])
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Energy Assistant</h1>
              <p className="text-sm text-muted-foreground">Powered by advanced AI for personalized insights</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Energy Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by advanced AI for personalized insights</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 max-w-3xl",
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                message.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={cn(
                "rounded-2xl p-4 max-w-[80%]",
                message.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "glass"
              )}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {message.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-foreground my-2">
                        {line.replace(/\*\*/g, "")}
                      </p>
                    )
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <p key={i} className="text-muted-foreground my-1 pl-4">
                        {line}
                      </p>
                    )
                  }
                  if (line.trim() === "") {
                    return <br key={i} />
                  }
                  return (
                    <p key={i} className="text-foreground my-1">
                      {line}
                    </p>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3" suppressHydrationWarning>
                {mounted ? formatTime(message.timestamp) : ''}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedQuestion(q.text)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-sm font-medium text-foreground"
              >
                <q.icon className="w-4 h-4 text-primary" />
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-3 max-w-3xl mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your energy usage..."
            className="flex-1 h-12 rounded-xl bg-background/50"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="lg"
            disabled={!input.trim() || isTyping}
            className="h-12 px-6 rounded-xl glow"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
