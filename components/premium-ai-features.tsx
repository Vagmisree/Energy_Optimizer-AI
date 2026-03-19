'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Sparkles, TrendingDown, Zap, Leaf, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react'

export function AIEnergyInsights() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-generated insights
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          title: 'Peak Hour Pattern Detected',
          description: 'Your AC consumption increases by 45% between 2-5 PM, coinciding with peak pricing hours.',
          impact: 'High',
          savings: 180,
          confidence: 94,
          factor: 'Weather & Peak Hours',
          explanation: 'When outdoor temperature rises, your AC works harder during peak rate periods. Shifting AC usage to early morning (6-9 AM) could save ~₹180/month.'
        },
        {
          id: 2,
          title: 'Appliance Standby Drain',
          description: 'Devices in standby mode consume 25% of your baseline energy even when not in use.',
          impact: 'Medium',
          savings: 95,
          confidence: 87,
          factor: 'Always-On Devices',
          explanation: 'Your TV, microwave, and chargers continue drawing power. Using smart power strips could eliminate this waste and save ₹95/month.'
        },
        {
          id: 3,
          title: 'Washing Machine Optimization',
          description: 'Running your washing machine during off-peak hours (11 PM - 6 AM) could reduce costs.',
          impact: 'Low',
          savings: 45,
          confidence: 78,
          factor: 'Time-of-Use Rates',
          explanation: 'Off-peak electricity is 30% cheaper. Shifting just 3 washes/week to off-peak hours saves ₹45/month with zero lifestyle change.'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <Card className="glass p-6 space-y-4">
        <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="glass p-5 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {insight.title}
                  <Badge variant={insight.impact === 'High' ? 'default' : insight.impact === 'Medium' ? 'secondary' : 'outline'} className="text-xs">
                    {insight.impact} Impact
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₹{insight.savings}</p>
              <p className="text-xs text-muted-foreground">Potential savings</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mt-4 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              WHY THIS HAPPENED ({insight.confidence}% confidence)
            </p>
            <p className="text-sm text-foreground">{insight.explanation}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>Factor: {insight.factor}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Apply Suggestion
            </Button>
            <Button size="sm" variant="outline">
              Learn More
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function EnergyPersona() {
  const persona = {
    name: 'Smart Optimizer',
    description: 'You actively monitor energy usage and seek optimization opportunities.',
    level: 'Advanced',
    score: 82,
    traits: ['Data-driven', 'Eco-conscious', 'Cost-focused', 'Tech-savvy'],
    icon: '🎯',
    recommendation: 'You\'re already doing well! Focus on shifting appliance usage to off-peak hours for maximum savings.'
  }

  return (
    <Card className="glass p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-4xl mb-2">{persona.icon}</div>
          <h3 className="text-2xl font-bold text-foreground">{persona.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{persona.description}</p>
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold text-sm">
            {persona.score}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">{persona.level}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {persona.traits.map((trait) => (
          <Badge key={trait} variant="outline" className="bg-primary/5">
            {trait}
          </Badge>
        ))}
      </div>

      <div className="bg-background/50 rounded-lg p-4 border border-primary/20">
        <p className="text-sm font-medium text-foreground mb-2">💡 Personalized Recommendation</p>
        <p className="text-sm text-muted-foreground">{persona.recommendation}</p>
      </div>
    </Card>
  )
}

export function EnergyForecast() {
  const forecastData = [
    { day: 'Mon', best: 250, expected: 320, worst: 420 },
    { day: 'Tue', best: 260, expected: 330, worst: 430 },
    { day: 'Wed', best: 240, expected: 310, worst: 410 },
    { day: 'Thu', best: 280, expected: 350, worst: 450 },
    { day: 'Fri', best: 290, expected: 360, worst: 460 },
    { day: 'Sat', best: 300, expected: 370, worst: 470 },
    { day: 'Sun', best: 270, expected: 340, worst: 440 },
  ]

  return (
    <Card className="glass p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          7-Day Energy Forecast
        </h3>
        <p className="text-sm text-muted-foreground mt-1">AI prediction with confidence ranges</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            formatter={(value: number) => `${value}kWh`}
          />
          <Legend />
          <Line type="monotone" dataKey="best" stroke="var(--chart-3)" strokeWidth={2} name="Best Case" />
          <Line type="monotone" dataKey="expected" stroke="var(--chart-1)" strokeWidth={2} name="Expected" />
          <Line type="monotone" dataKey="worst" stroke="var(--destructive)" strokeWidth={2} name="Worst Case" />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground font-medium">This Week Avg</p>
          <p className="text-2xl font-bold text-primary mt-1">342 kWh</p>
        </div>
        <div className="bg-accent/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground font-medium">Next Week Trend</p>
          <p className="text-lg font-bold text-accent flex items-center justify-center gap-1 mt-1">
            <ArrowUp className="w-4 h-4" /> 8%
          </p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground font-medium">Confidence</p>
          <p className="text-lg font-bold text-green-600 mt-1">91%</p>
        </div>
      </div>
    </Card>
  )
}
