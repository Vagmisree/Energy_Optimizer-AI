"use client"

import { Zap, IndianRupee, Leaf, Target } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/stat-card"
import { UsageChart } from "@/components/charts/usage-chart"
import { BillChart } from "@/components/charts/bill-chart"
import { ApplianceChart } from "@/components/charts/appliance-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { EnergyScoreCard } from "@/components/energy-score-card"
import { energyStats } from "@/lib/energy-data"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 glass">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your energy consumption and optimize your electricity usage
              </p>
            </div>

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
