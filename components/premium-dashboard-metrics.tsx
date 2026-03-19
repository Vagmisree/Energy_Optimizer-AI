'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Zap, Leaf, DollarSign } from 'lucide-react'

const savingsData = [
  { month: 'Jan', savings: 250, actual: 200 },
  { month: 'Feb', savings: 380, actual: 320 },
  { month: 'Mar', savings: 520, actual: 450 },
  { month: 'Apr', savings: 680, actual: 620 },
  { month: 'May', savings: 850, actual: 780 },
  { month: 'Jun', savings: 1050, actual: 950 },
]

const consumptionTrend = [
  { week: 'W1', usage: 340, target: 300 },
  { week: 'W2', usage: 320, target: 300 },
  { week: 'W3', usage: 310, target: 300 },
  { week: 'W4', usage: 290, target: 300 },
]

const applianceBreakdown = [
  { name: 'AC', value: 45, color: 'var(--chart-1)' },
  { name: 'Water Heater', value: 20, color: 'var(--chart-2)' },
  { name: 'Refrigerator', value: 15, color: 'var(--chart-3)' },
  { name: 'Lighting', value: 12, color: 'var(--chart-4)' },
  { name: 'Others', value: 8, color: 'var(--chart-5)' },
]

export function PremiumDashboardMetrics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass p-6 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="bg-primary/10">This Month</Badge>
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Savings</p>
            <p className="text-4xl font-bold text-primary">₹950</p>
            <p className="text-xs text-emerald-600 mt-2">+12% vs target</p>
          </div>
        </Card>

        <Card className="glass p-6 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="bg-accent/10">Target Met</Badge>
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">CO2 Reduced</p>
            <p className="text-4xl font-bold text-emerald-600">127 kg</p>
            <p className="text-xs text-muted-foreground mt-2">Equivalent to 2 trees planted</p>
          </div>
        </Card>

        <Card className="glass p-6 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="bg-secondary/10">Optimized</Badge>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Energy Score</p>
            <p className="text-4xl font-bold text-primary">82/100</p>
            <p className="text-xs text-muted-foreground mt-2">Excellent efficiency</p>
          </div>
        </Card>
      </div>

      {/* Savings Trajectory */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Monthly Savings Trajectory</h3>
          <Badge className="bg-emerald-500/20 text-emerald-600">+28% Growth</Badge>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="var(--chart-3)" strokeWidth={3} name="Potential" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="actual" stroke="var(--chart-1)" strokeWidth={3} name="Actual" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Weekly Consumption Trend */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Consumption vs Target</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumptionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="usage" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Actual Usage" />
              <Bar dataKey="target" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Appliance Breakdown */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Energy Usage by Appliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applianceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applianceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {applianceBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color, width: `${item.value}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
