'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-96 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-2xl rounded-lg" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="glass p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-4 w-48 rounded-lg mb-6" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </Card>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="glass p-6 animate-pulse">
          <div className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-3xl">⚡</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">No Data Yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start monitoring your energy usage to see insights, recommendations, and savings opportunities.
      </p>
      <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
        Get Started
      </button>
    </div>
  )
}

export function ErrorState({ message = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Error Loading Data</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {message}
      </p>
      <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
        Try Again
      </button>
    </div>
  )
}
