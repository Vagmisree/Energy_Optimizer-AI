'use client'

import { Trophy, Flame, Star, Target, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  points: number
  unlockedDate?: string
}

interface GamificationProps {
  dailyStreak: number
  weeklyChallenge: {
    name: string
    progress: number
    goal: number
    reward: number
  }
  achievements: Achievement[]
  totalPoints: number
  level: number
}

export function GamificationDashboard({
  dailyStreak,
  weeklyChallenge,
  achievements,
  totalPoints,
  level,
}: GamificationProps) {
  const streakMilestones = [7, 14, 30, 60, 100]
  const nextMilestone = streakMilestones.find(m => m > dailyStreak) || streakMilestones[streakMilestones.length - 1]

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">{level}</div>
          <p className="text-sm text-muted-foreground">Current Level</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(totalPoints % 1000) / 10}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-orange-500 mb-1">{dailyStreak}</div>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <Star className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-3xl font-bold text-accent mb-1">{totalPoints}</div>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary mb-1">{achievements.filter(a => a.unlocked).length}</div>
          <p className="text-sm text-muted-foreground">Achievements</p>
        </div>
      </div>

      {/* Daily Streak */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-6 h-6 text-orange-500" />
          <div>
            <h3 className="font-semibold text-foreground">Daily Login Streak</h3>
            <p className="text-sm text-muted-foreground">Keep coming back to maintain your streak</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'p-2 rounded-lg text-center',
                i < dailyStreak % 7 ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-muted/50 border border-border'
              )}
            >
              <p className="text-xs font-bold">{i + 1}</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-foreground mb-1">Next Milestone</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{nextMilestone} day streak</span>
            <span className="text-sm font-bold text-primary">{nextMilestone - dailyStreak} days to go</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(dailyStreak / nextMilestone) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Challenge */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-accent" />
          <div>
            <h3 className="font-semibold text-foreground">This Week's Challenge</h3>
            <p className="text-sm text-muted-foreground">Complete to earn bonus points</p>
          </div>
        </div>

        <div className="mb-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-medium text-foreground">{weeklyChallenge.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Reward: {weeklyChallenge.reward} points</p>
            </div>
            {weeklyChallenge.progress >= weeklyChallenge.goal && (
              <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Completed</Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-foreground">
                {weeklyChallenge.progress}/{weeklyChallenge.goal}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${(weeklyChallenge.progress / weeklyChallenge.goal) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">Achievements</h3>
            <p className="text-sm text-muted-foreground">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={cn(
                'p-4 rounded-lg border text-center transition-all',
                achievement.unlocked
                  ? 'bg-primary/10 border-primary/30 cursor-pointer hover:scale-105'
                  : 'bg-muted/30 border-border opacity-60 grayscale'
              )}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <h4 className="text-xs font-bold text-foreground mb-1">{achievement.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
              <Badge variant="outline" className="text-xs">{achievement.points} pts</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Leaderboard Component
interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  isUser?: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  userRank: number
}

export function Leaderboard({ entries, userRank }: LeaderboardProps) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary" />
        <div>
          <h3 className="font-semibold text-foreground">Community Leaderboard</h3>
          <p className="text-sm text-muted-foreground">Your Rank: #{userRank}</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map(entry => (
          <div
            key={entry.rank}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg border transition-colors',
              entry.isUser
                ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20'
                : 'border-border hover:bg-muted/50'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{entry.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{entry.points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
