"use client"

import { Trophy, Leaf, Brain, Clock, TreePine, Zap, Target, Star, Award, Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "@/components/animated-counter"

const achievements = [
  {
    id: 1,
    name: "Beginner Saver",
    description: "Saved your first 100 kWh",
    icon: Leaf,
    unlocked: true,
    progress: 100,
    xp: 100,
    date: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Smart Optimizer",
    description: "Used AI recommendations 10 times",
    icon: Brain,
    unlocked: true,
    progress: 100,
    xp: 200,
    date: "Feb 3, 2024",
  },
  {
    id: 3,
    name: "Peak Shifter",
    description: "Shifted 50% usage to off-peak hours",
    icon: Clock,
    unlocked: true,
    progress: 100,
    xp: 300,
    date: "Feb 20, 2024",
  },
  {
    id: 4,
    name: "Eco Champion",
    description: "Reduce bill by 30% in a month",
    icon: Trophy,
    unlocked: false,
    progress: 78,
    xp: 500,
    date: null,
  },
  {
    id: 5,
    name: "Green Warrior",
    description: "Save 100kg CO2 emissions",
    icon: TreePine,
    unlocked: false,
    progress: 65,
    xp: 400,
    date: null,
  },
  {
    id: 6,
    name: "Energy Master",
    description: "Maintain 90+ energy score for 3 months",
    icon: Zap,
    unlocked: false,
    progress: 33,
    xp: 750,
    date: null,
  },
]

const energyPersonality = {
  type: "Balanced User",
  icon: Target,
  description: "You maintain a good balance between comfort and energy savings",
  traits: [
    "Moderate energy consumer",
    "Responsive to optimization tips",
    "Growing sustainability awareness",
  ],
}

const stats = {
  totalXP: 600,
  level: 3,
  nextLevelXP: 1000,
  achievementsUnlocked: 3,
  totalAchievements: 6,
  streak: 12,
}

export default function AchievementsPage() {
  const levelProgress = (stats.totalXP / stats.nextLevelXP) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground">
              Track your progress and earn rewards for saving energy
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-xl font-bold text-foreground">
                <AnimatedCounter value={stats.totalXP} />
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <p className="text-xl font-bold text-foreground">Level {stats.level}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Medal className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-xl font-bold text-foreground">
                {stats.achievementsUnlocked}/{stats.totalAchievements}
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
              <p className="text-xl font-bold text-foreground">{stats.streak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Level Progress</h3>
            <p className="text-sm text-muted-foreground">
              {stats.nextLevelXP - stats.totalXP} XP needed for Level {stats.level + 1}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{stats.totalXP} XP</p>
            <p className="text-sm text-muted-foreground">/ {stats.nextLevelXP} XP</p>
          </div>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out glow-sm"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Energy Personality */}
      <div className="glass rounded-2xl p-6 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <energyPersonality.icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{energyPersonality.type}</h3>
            <p className="text-muted-foreground mt-1">{energyPersonality.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {energyPersonality.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">All Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]",
                achievement.unlocked
                  ? "border-2 border-primary/30"
                  : "opacity-70"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                    achievement.unlocked
                      ? "bg-primary text-primary-foreground glow-sm"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <achievement.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{achievement.name}</h4>
                    {achievement.unlocked && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        +{achievement.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>

                  {!achievement.unlocked && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{achievement.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary/50 rounded-full transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {achievement.date && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Unlocked: {achievement.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Setting */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Savings Goal</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Target: Save ₹1,000/month</span>
              <span className="text-sm font-medium text-primary">₹780 saved</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000 glow-sm"
                style={{ width: "78%" }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              You&apos;re 78% towards your goal! Keep up the great work.
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-primary/10">
            <p className="text-3xl font-bold text-primary">78%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
      </div>
    </div>
  )
}
