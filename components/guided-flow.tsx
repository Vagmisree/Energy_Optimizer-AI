'use client'

import { useState } from 'react'
import { Check, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface GuidedStep {
  id: string
  title: string
  description: string
  completed: boolean
  status: 'completed' | 'current' | 'upcoming'
}

const DEFAULT_STEPS: GuidedStep[] = [
  {
    id: 'analyze',
    title: 'Analyze Your Usage',
    description: 'Review your current energy patterns and consumption data',
    completed: false,
    status: 'current',
  },
  {
    id: 'insights',
    title: 'Get AI Insights',
    description: 'Understand your usage patterns with AI-powered analysis',
    completed: false,
    status: 'upcoming',
  },
  {
    id: 'simulate',
    title: 'Run Simulation',
    description: 'Test optimization scenarios and see potential savings',
    completed: false,
    status: 'upcoming',
  },
  {
    id: 'plan',
    title: 'Create Action Plan',
    description: 'Get a personalized plan to reduce your bill',
    completed: false,
    status: 'upcoming',
  },
  {
    id: 'track',
    title: 'Track & Monitor',
    description: 'Monitor your progress and adjust as needed',
    completed: false,
    status: 'upcoming',
  },
]

interface GuidedUserFlowProps {
  currentStep?: string
  onStepChange?: (step: string) => void
}

export function GuidedUserFlow({ currentStep = 'analyze', onStepChange }: GuidedUserFlowProps) {
  const [steps, setSteps] = useState<GuidedStep[]>(
    DEFAULT_STEPS.map(step => ({
      ...step,
      status: step.id === currentStep ? 'current' : step.id === 'analyze' ? 'completed' : 
              (DEFAULT_STEPS.findIndex(s => s.id === currentStep) > DEFAULT_STEPS.findIndex(s => s.id === step.id)) ? 'completed' : 'upcoming'
    }))
  )

  const handleStepClick = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    const currentIndex = steps.findIndex(s => s.status === 'current')
    
    if (stepIndex <= currentIndex + 1) {
      setSteps(steps.map(step => ({
        ...step,
        status: step.id === stepId ? 'current' : 
                (steps.findIndex(s => s.id === step.id) < stepIndex) ? 'completed' : 'upcoming'
      })))
      onStepChange?.(stepId)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Your Optimization Journey</h3>
        <p className="text-sm text-muted-foreground mt-1">Follow these steps to reduce your energy bill</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id}>
            <button
              onClick={() => handleStepClick(step.id)}
              disabled={step.status === 'upcoming' && idx > steps.findIndex(s => s.status === 'current') + 1}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                step.status === 'completed' && 'bg-emerald-500/10 border-emerald-500/30 cursor-pointer',
                step.status === 'current' && 'bg-primary/10 border-primary/50 ring-2 ring-primary/20 cursor-pointer',
                step.status === 'upcoming' && 'bg-muted/30 border-border cursor-not-allowed opacity-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all',
                  step.status === 'completed' && 'bg-emerald-500 text-white',
                  step.status === 'current' && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  step.status === 'upcoming' && 'bg-muted text-muted-foreground border border-border'
                )}>
                  {step.status === 'completed' ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                {step.status !== 'upcoming' && <ChevronRight className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />}
              </div>
            </button>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="ml-5 my-1 h-3 border-l-2 border-muted"></div>
            )}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-bold text-primary">{steps.filter(s => s.status === 'completed').length}/5</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
        <p className="text-sm font-medium text-foreground mb-2">Next Step</p>
        <p className="text-sm text-muted-foreground mb-3">
          {steps.find(s => s.status === 'current')?.description}
        </p>
        <Button className="w-full" size="sm">
          Continue to {steps.find(s => s.status === 'current')?.title} →
        </Button>
      </div>
    </div>
  )
}

// Weekly Summary Component
interface WeeklySummaryData {
  period: string
  usageChange: number
  billChange: number
  topInsight: string
  recommendations: string[]
  achievements: string[]
}

interface WeeklySummaryProps {
  data: WeeklySummaryData
}

export function WeeklyAISummary({ data }: WeeklySummaryProps) {
  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Weekly Summary</h3>
        <p className="text-sm text-muted-foreground mt-1">{data.period}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn('p-4 rounded-xl border', data.usageChange < 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30')}>
          <p className="text-xs text-muted-foreground mb-1">Usage Change</p>
          <p className={`text-2xl font-bold ${data.usageChange < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {data.usageChange > 0 ? '+' : ''}{data.usageChange}%
          </p>
        </div>
        <div className={cn('p-4 rounded-xl border', data.billChange < 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30')}>
          <p className="text-xs text-muted-foreground mb-1">Bill Change</p>
          <p className={`text-2xl font-bold ${data.billChange < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {data.billChange > 0 ? '+' : ''}₹{data.billChange}
          </p>
        </div>
      </div>

      {/* Top Insight */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-sm font-medium text-foreground mb-1">Top Insight</p>
        <p className="text-sm text-muted-foreground">{data.topInsight}</p>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Recommendations</h4>
        {data.recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{rec}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <h4 className="text-sm font-medium text-emerald-600 mb-2">This Week's Achievements</h4>
          <div className="space-y-1">
            {data.achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-emerald-600">
                <Check className="w-4 h-4" />
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
