"use client"

import { useState } from "react"
import { Gamepad2, Thermometer, Lightbulb, Clock, Zap, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/animated-counter"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

interface Scenario {
  id: string
  name: string
  description: string
  icon: typeof Thermometer
  savingsPercent: number
  active: boolean
}

const initialScenarios: Scenario[] = [
  {
    id: "ac",
    name: "Reduce AC by 2°C",
    description: "Raise AC temperature from 22°C to 24°C",
    icon: Thermometer,
    savingsPercent: 15,
    active: false,
  },
  {
    id: "led",
    name: "Switch to LED",
    description: "Replace all bulbs with LED lighting",
    icon: Lightbulb,
    savingsPercent: 12,
    active: false,
  },
  {
    id: "offpeak",
    name: "Off-Peak Usage",
    description: "Shift heavy appliances to off-peak hours",
    icon: Clock,
    savingsPercent: 10,
    active: false,
  },
  {
    id: "standby",
    name: "Eliminate Standby",
    description: "Unplug devices when not in use",
    icon: Zap,
    savingsPercent: 8,
    active: false,
  },
]

const baseData = {
  bill: 2850,
  usage: 342,
}

export default function SimulatorPage() {
  const [scenarios, setScenarios] = useState(initialScenarios)

  const toggleScenario = (id: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
  }

  const resetAll = () => {
    setScenarios(initialScenarios)
  }

  const activeScenarios = scenarios.filter((s) => s.active)
  const totalSavingsPercent = activeScenarios.reduce((acc, s) => acc + s.savingsPercent, 0)
  const newBill = Math.round(baseData.bill * (1 - totalSavingsPercent / 100))
  const newUsage = Math.round(baseData.usage * (1 - totalSavingsPercent / 100))
  const monthlySavings = baseData.bill - newBill
  const yearlySavings = monthlySavings * 12

  const chartData = [
    { name: "Current", value: baseData.bill, fill: "hsl(var(--chart-5))" },
    { name: "Simulated", value: newBill, fill: "hsl(var(--chart-1))" },
  ]

  const breakdownData = scenarios.map((s) => ({
    name: s.name.split(" ").slice(0, 2).join(" "),
    savings: s.active ? Math.round((s.savingsPercent / 100) * baseData.bill) : 0,
    potential: Math.round((s.savingsPercent / 100) * baseData.bill),
    active: s.active,
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Energy Simulator</h1>
            <p className="text-muted-foreground">
              See how different changes affect your bill instantly
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={resetAll} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Toggle Scenarios</h3>
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => toggleScenario(scenario.id)}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
                scenario.active
                  ? "border-primary bg-primary/10 glow-sm"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    scenario.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <scenario.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{scenario.name}</p>
                    <span
                      className={cn(
                        "text-sm font-medium px-2 py-0.5 rounded-full",
                        scenario.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      -{scenario.savingsPercent}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground">New Bill</p>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={newBill} prefix="₹" duration={300} />
              </p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground">New Usage</p>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={newUsage} suffix=" kWh" duration={300} />
              </p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Monthly Savings</p>
              <p className="text-2xl font-bold text-primary">
                <AnimatedCounter value={monthlySavings} prefix="₹" duration={300} />
              </p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Yearly Savings</p>
              <p className="text-2xl font-bold text-emerald-500">
                <AnimatedCounter value={yearlySavings} prefix="₹" duration={300} />
              </p>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Bill Comparison</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`₹${value}`, "Bill"]}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-5" />
                <span className="text-muted-foreground">Current: ₹{baseData.bill}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-muted-foreground">Simulated: ₹{newBill}</span>
              </div>
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Savings Breakdown</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number, name: string) => [
                      `₹${value}`,
                      name === "savings" ? "Active Savings" : "Potential",
                    ]}
                  />
                  <Bar dataKey="potential" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Message */}
          {activeScenarios.length > 0 && (
            <div className="glass rounded-2xl p-6 border-2 border-primary/30 animate-pulse-glow">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Great choices! You could save ₹{yearlySavings.toLocaleString()}/year
                </h3>
                <p className="text-muted-foreground">
                  By implementing {activeScenarios.length} optimization{activeScenarios.length > 1 ? "s" : ""}, 
                  you&apos;ll reduce your bill by {totalSavingsPercent}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
