"use client"

import { Clock, Zap, Sun, Moon, AlertCircle, CheckCircle, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const timeSlots = [
  { time: "00:00 - 06:00", type: "off-peak", rate: "₹4/kWh", savings: "50%", label: "Super Off-Peak" },
  { time: "06:00 - 09:00", type: "normal", rate: "₹6/kWh", savings: "25%", label: "Morning" },
  { time: "09:00 - 17:00", type: "normal", rate: "₹7/kWh", savings: "12%", label: "Day Time" },
  { time: "17:00 - 18:00", type: "normal", rate: "₹7/kWh", savings: "12%", label: "Evening" },
  { time: "18:00 - 22:00", type: "peak", rate: "₹10/kWh", savings: "0%", label: "Peak Hours" },
  { time: "22:00 - 24:00", type: "off-peak", rate: "₹5/kWh", savings: "38%", label: "Night" },
]

const scheduledTasks = [
  {
    appliance: "Washing Machine",
    currentTime: "19:00",
    suggestedTime: "22:00",
    savings: "₹45/cycle",
    icon: "🫧",
  },
  {
    appliance: "Dishwasher",
    currentTime: "20:00",
    suggestedTime: "23:00",
    savings: "₹30/cycle",
    icon: "🍽️",
  },
  {
    appliance: "Water Heater",
    currentTime: "07:00",
    suggestedTime: "05:00",
    savings: "₹20/day",
    icon: "🔥",
  },
  {
    appliance: "EV Charging",
    currentTime: "18:00",
    suggestedTime: "01:00",
    savings: "₹150/charge",
    icon: "🔌",
  },
]

const weeklySchedule = [
  { day: "Mon", peak: 2, offPeak: 5, savings: 180 },
  { day: "Tue", peak: 3, offPeak: 4, savings: 150 },
  { day: "Wed", peak: 2, offPeak: 6, savings: 200 },
  { day: "Thu", peak: 4, offPeak: 3, savings: 120 },
  { day: "Fri", peak: 3, offPeak: 4, savings: 160 },
  { day: "Sat", peak: 5, offPeak: 5, savings: 140 },
  { day: "Sun", peak: 4, offPeak: 6, savings: 170 },
]

export default function SchedulerPage() {
  const totalWeeklySavings = weeklySchedule.reduce((acc, day) => acc + day.savings, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Smart Scheduler</h1>
            <p className="text-muted-foreground">
              Optimize your appliance usage for maximum savings
            </p>
          </div>
        </div>
      </div>

      {/* Time-of-Use Rates */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Time-of-Use Electricity Rates</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105",
                slot.type === "peak" && "border-amber-500/50 bg-amber-500/10",
                slot.type === "off-peak" && "border-emerald-500/50 bg-emerald-500/10",
                slot.type === "normal" && "border-border bg-card"
              )}
            >
              <div className="flex justify-center mb-2">
                {slot.type === "peak" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : slot.type === "off-peak" ? (
                  <Moon className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Clock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{slot.label}</p>
              <p className="text-sm font-medium text-foreground mt-1">{slot.time}</p>
              <p className={cn(
                "text-lg font-bold mt-2",
                slot.type === "peak" && "text-amber-500",
                slot.type === "off-peak" && "text-emerald-500",
                slot.type === "normal" && "text-foreground"
              )}>
                {slot.rate}
              </p>
              <p className={cn(
                "text-xs mt-1",
                slot.type === "off-peak" ? "text-emerald-500" : "text-muted-foreground"
              )}>
                Save {slot.savings}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Smart Scheduling Suggestions</h3>
          </div>

          <div className="space-y-4">
            {scheduledTasks.map((task, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-background/50 border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{task.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{task.appliance}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {task.currentTime}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {task.suggestedTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{task.savings}</p>
                    <p className="text-xs text-muted-foreground">potential</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Weekly Schedule Overview</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Weekly Savings</p>
              <p className="text-xl font-bold text-primary">₹{totalWeeklySavings}</p>
            </div>
          </div>

          <div className="space-y-3">
            {weeklySchedule.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-10 text-sm font-medium text-muted-foreground">{day.day}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${(day.peak / (day.peak + day.offPeak)) * 100}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(day.offPeak / (day.peak + day.offPeak)) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-medium text-emerald-500">
                  +₹{day.savings}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-muted-foreground">Peak Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Off-Peak Usage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl p-6 border-2 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pro Tips for Maximum Savings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary/5">
            <p className="font-medium text-foreground">Use Timer Functions</p>
            <p className="text-sm text-muted-foreground mt-1">
              Set your appliances to run automatically during off-peak hours
            </p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5">
            <p className="font-medium text-foreground">Batch Your Tasks</p>
            <p className="text-sm text-muted-foreground mt-1">
              Run multiple loads together during the cheapest rate periods
            </p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5">
            <p className="font-medium text-foreground">Pre-cool Your Home</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cool your home before peak hours to reduce AC usage at night
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
