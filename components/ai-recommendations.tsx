'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap, Wind, Lightbulb, Smartphone, Home, TrendingUp, Clock } from 'lucide-react'

export function SmartRecommendations() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const recommendations = [
    {
      id: 1,
      title: 'Schedule AC During Off-Peak Hours',
      impact: 'High',
      savings: 2160,
      carbonReduction: 450,
      difficulty: 'Easy',
      timeframe: '1 week',
      icon: Wind,
      description: 'Pre-cool your home during off-peak (6-9 AM, after 11 PM) and maintain temperature during peak hours.',
      steps: [
        'Install a smart thermostat',
        'Set cooling schedule for off-peak hours',
        'Target: 28°C during peak, 24°C during off-peak'
      ],
      estimatedSavings: '₹2,160/month'
    },
    {
      id: 2,
      title: 'Replace Incandescent with LED Bulbs',
      impact: 'Medium',
      savings: 720,
      carbonReduction: 150,
      difficulty: 'Very Easy',
      timeframe: 'Immediate',
      icon: Lightbulb,
      description: 'LED bulbs use 75% less energy and last 25x longer than traditional incandescent bulbs.',
      steps: [
        'List all incandescent bulbs in your home',
        'Buy equivalent LED replacements',
        'Replace bulbs (1 hour total)',
        'Dispose of old bulbs responsibly'
      ],
      estimatedSavings: '₹720/month'
    },
    {
      id: 3,
      title: 'Enable Power-Saving Mode on Devices',
      impact: 'Low',
      savings: 540,
      carbonReduction: 110,
      difficulty: 'Easy',
      timeframe: '2 days',
      icon: Smartphone,
      description: 'Enable sleep/power-saving mode on all devices to reduce phantom load.',
      steps: [
        'Identify always-on devices (TV, microwave, chargers)',
        'Enable power-saving modes in settings',
        'Use smart power strips for entertainment center',
        'Unplug devices when not in use'
      ],
      estimatedSavings: '₹540/month'
    },
    {
      id: 4,
      title: 'Optimize Refrigerator Settings',
      impact: 'Medium',
      savings: 890,
      carbonReduction: 185,
      difficulty: 'Easy',
      timeframe: '1 day',
      icon: Home,
      description: 'Adjust refrigerator temperature settings for optimal energy efficiency without compromising food safety.',
      steps: [
        'Set fridge to 37-40°F (3-4°C)',
        'Set freezer to 0°F (-18°C)',
        'Ensure door seals are tight',
        'Clean coils monthly'
      ],
      estimatedSavings: '₹890/month'
    }
  ]

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => {
        const Icon = rec.icon
        const isExpanded = expandedId === rec.id
        
        return (
          <Card 
            key={rec.id} 
            className={`glass p-4 cursor-pointer hover:border-primary/50 transition-all duration-300 ${
              isExpanded ? 'ring-2 ring-primary/50' : ''
            }`}
            onClick={() => setExpandedId(isExpanded ? null : rec.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{rec.savings}</p>
                <p className="text-xs text-green-600 font-medium">-{rec.carbonReduction}kg CO₂</p>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <Badge variant={rec.impact === 'High' ? 'default' : rec.impact === 'Medium' ? 'secondary' : 'outline'} className="text-xs">
                {rec.impact} Impact
              </Badge>
              <Badge variant="outline" className="text-xs">{rec.difficulty}</Badge>
              <Badge variant="outline" className="text-xs">{rec.timeframe}</Badge>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in fade-in duration-300">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Implementation Steps:</p>
                  <ol className="space-y-1">
                    {rec.steps.map((step, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="font-semibold text-primary">{idx + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Start This Action
                </Button>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export function GoalCoach() {
  const goals = [
    {
      id: 1,
      title: 'Save ₹500/Month',
      target: 500,
      current: 380,
      deadline: '30 days',
      progress: 76,
      status: 'On Track',
      nextAction: 'Implement AC scheduling - potential ₹150 savings',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Reduce CO₂ by 250kg',
      target: 250,
      current: 185,
      deadline: '60 days',
      progress: 74,
      status: 'On Track',
      nextAction: 'Switch to LED lights - saves 150kg CO₂ instantly',
      icon: '🌱'
    },
    {
      id: 3,
      title: 'Cut Usage by 20%',
      target: 20,
      current: 14,
      deadline: 'In Progress',
      progress: 70,
      status: 'Nearly There',
      nextAction: 'Power-saving mode + device unplugging for final 6%',
      icon: '⚡'
    }
  ]

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="glass p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h4 className="font-semibold text-foreground">{goal.title}</h4>
                <p className="text-xs text-muted-foreground">Target: {goal.target} • {goal.deadline}</p>
              </div>
            </div>
            <Badge className={goal.status === 'On Track' ? 'bg-green-500/20 text-green-600' : 'bg-amber-500/20 text-amber-600'}>
              {goal.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{goal.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">💡 Next Action</p>
            <p className="text-sm text-foreground">{goal.nextAction}</p>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            View Roadmap
          </Button>
        </Card>
      ))}
    </div>
  )
}

export function AutoSuggestions() {
  const suggestions = [
    { action: 'Run washing machine after 11 PM', savings: 45, icon: '🧺' },
    { action: 'Reduce AC usage by 1 hour', savings: 60, icon: '❄️' },
    { action: 'Switch off water heater during off-peak', savings: 75, icon: '💧' },
    { action: 'Use fan instead of AC for 2 hours', savings: 90, icon: '🌬️' },
  ]

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, idx) => (
        <Card key={idx} className="glass p-4 flex items-center justify-between hover:border-primary/50 transition-all group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{suggestion.icon}</span>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {suggestion.action}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">+₹{suggestion.savings}</p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
