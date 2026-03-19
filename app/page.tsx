"use client"

import { useState } from "react"
import { Zap, IndianRupee, Leaf, Target, Sparkles, TrendingDown, AlertCircle, ChevronRight } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/stat-card"
import { UsageChart } from "@/components/charts/usage-chart"
import { BillChart } from "@/components/charts/bill-chart"
import { ApplianceChart } from "@/components/charts/appliance-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { EnergyScoreCard } from "@/components/energy-score-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LiveStatusBanner } from "@/components/notifications"
import { energyStats } from "@/lib/energy-data"

export default function Home() {
  const [hoveredCTA, setHoveredCTA] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 glass sticky top-0 z-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              <Zap className="w-3 h-3 mr-1" />
              All Systems Optimal
            </Badge>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Premium Header with Quick CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Energy Intelligence Hub
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  AI-powered insights and recommendations to optimize your energy consumption and reduce costs
                </p>
              </div>

              {/* Live Status Banner */}
              <LiveStatusBanner />

              {/* Highlighted CTA Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'predict', label: 'Predict Energy', icon: TrendingDown, color: 'primary' },
                  { id: 'generate', label: 'Generate AI Plan', icon: Sparkles, color: 'accent' },
                  { id: 'optimize', label: 'Optimize Bill', icon: Zap, color: 'primary' },
                  { id: 'simulate', label: 'Run Simulation', icon: AlertCircle, color: 'secondary' },
                ].map((cta) => {
                  const Icon = cta.icon
                  const isHovered = hoveredCTA === cta.id
                  return (
                    <Button
                      key={cta.id}
                      onMouseEnter={() => setHoveredCTA(cta.id)}
                      onMouseLeave={() => setHoveredCTA(null)}
                      className={`relative h-12 font-semibold group overflow-hidden ${
                        isHovered 
                          ? 'ring-2 ring-offset-2 ring-offset-background ring-primary shadow-lg scale-105' 
                          : 'ring-1 ring-offset-2 ring-offset-background ring-primary/50'
                      } transition-all duration-300 bg-gradient-to-r from-primary/90 to-accent/20 hover:from-primary hover:to-accent/40 text-primary-foreground`}
                    >
                      <Icon className={`w-4 h-4 mr-2 transition-transform ${isHovered ? 'scale-110' : ''}`} />
                      {cta.label}
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Alert Banner */}
            <Card className="glass border-l-4 border-l-accent bg-accent/5 p-4 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Peak Hour Opportunity</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're using 45% more energy during 2-5 PM. Shifting AC usage to early morning could save ₹180/month.
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto flex-shrink-0">
                Take Action
              </Button>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Energy Usage"
                value={energyStats.currentUsage}
                suffix=" kWh"
                icon={Zap}
                trend={{ value: 12, isPositive: false }}
                glowColor="primary"
              />
              <StatCard
                title="Estimated Bill"
                value={energyStats.estimatedBill}
                prefix="₹"
                icon={IndianRupee}
                trend={{ value: 8, isPositive: false }}
                glowColor="secondary"
              />
              <StatCard
                title="CO2 Saved"
                value={energyStats.co2Saved}
                suffix=" kg"
                decimals={1}
                icon={Leaf}
                trend={{ value: 15, isPositive: true }}
                glowColor="accent"
              />
              <StatCard
                title="Energy Score"
                value={energyStats.energyScore}
                suffix="/100"
                icon={Target}
                trend={{ value: 5, isPositive: true }}
                glowColor="primary"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageChart />
              <BillChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ApplianceChart />
              <AIInsightsPanel />
              <EnergyScoreCard score={energyStats.energyScore} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
