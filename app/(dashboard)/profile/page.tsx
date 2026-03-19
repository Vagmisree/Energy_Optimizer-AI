'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Trophy, TrendingDown, Zap, Leaf, Target, Calendar, Share2 } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Energy Profile
          </h1>
          <p className="text-muted-foreground mt-2">Your journey to energy optimization</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Share2 className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
      </div>

      {/* Profile Summary Card */}
      <Card className="glass p-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Smart Optimizer</p>
            <p className="text-xs text-muted-foreground">Energy Persona</p>
          </div>
          
          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Total Savings</p>
            <p className="text-3xl font-bold text-primary">₹2,850</p>
            <p className="text-xs text-emerald-600 mt-1">+15% vs last month</p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">CO2 Reduced</p>
            <p className="text-3xl font-bold text-emerald-600">127 kg</p>
            <p className="text-xs text-emerald-600 mt-1">Equivalent to 1 tree</p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Energy Score</p>
            <p className="text-3xl font-bold text-accent">82/100</p>
            <p className="text-xs text-amber-600 mt-1">Excellent</p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Active Days</p>
            <p className="text-3xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="glass w-full justify-start">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly Summary
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Milestones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '⚡', title: 'Lightning Strike', desc: 'Reduced usage by 30%', locked: false },
              { emoji: '🌱', title: 'Green Guardian', desc: 'Saved 50kg CO2', locked: false },
              { emoji: '💰', title: 'Money Saver', desc: 'Saved ₹1000', locked: false },
              { emoji: '🎯', title: 'Goal Getter', desc: 'Achieved monthly goal', locked: false },
              { emoji: '📈', title: 'Data Master', desc: 'Analyzed 100 days of data', locked: true },
              { emoji: '🏆', title: 'Peak Performance', desc: 'Maintained 90+ score', locked: true },
            ].map((achievement, idx) => (
              <Card
                key={idx}
                className={`glass p-6 text-center transition-all ${
                  achievement.locked ? 'opacity-50 grayscale' : 'hover:border-primary/50'
                }`}
              >
                <p className="text-4xl mb-2">{achievement.emoji}</p>
                <p className="font-semibold text-foreground">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.desc}</p>
                {achievement.locked && <Badge className="mt-3 bg-muted">Locked</Badge>}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card className="glass p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Week of Mar 17-23, 2024</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-foreground">Usage Decreased</span>
                  </div>
                  <span className="font-bold text-emerald-600">12% ↓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Bill Savings</span>
                  </div>
                  <span className="font-bold text-primary">₹320 📉</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-foreground">CO2 Impact</span>
                  </div>
                  <span className="font-bold text-emerald-600">18.2 kg reduced</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-semibold text-foreground mb-3">Key Actions This Week</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Shifted 4 wash cycles to off-peak hours (saved ₹80)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Reduced AC usage by 2 hours during peak (saved ₹120)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Replaced 8 bulbs with LED (will save ₹200/month)</span>
                </li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="space-y-3">
            {[
              { icon: '💰', title: 'First ₹1000 Saved', status: 'completed', progress: 100 },
              { icon: '🌱', title: 'Green Guardian (100kg CO2)', status: 'completed', progress: 100 },
              { icon: '⚡', title: 'Energy Expert (365 days)', status: 'in-progress', progress: 68 },
              { icon: '🏆', title: 'Perfect Month (90+ score)', status: 'in-progress', progress: 82 },
              { icon: '🎯', title: 'Millennial ₹5000 Saved', status: 'locked', progress: 57 },
            ].map((milestone, idx) => (
              <Card key={idx} className="glass p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{milestone.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{milestone.title}</p>
                      <Badge variant={
                        milestone.status === 'completed' ? 'default' :
                        milestone.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {milestone.status === 'completed' ? '✓ Unlocked' :
                         milestone.status === 'in-progress' ? `${milestone.progress}%` : 'Locked'}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
