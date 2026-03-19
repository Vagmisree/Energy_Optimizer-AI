'use client'

import { useState, useCallback, useEffect } from 'react'

// Hook for managing notification state
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: number
    type: 'success' | 'warning' | 'error' | 'info'
    message: string
    duration?: number
  }>>([])

  const addNotification = useCallback((
    message: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info',
    duration = 3000
  ) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message, duration }])

    if (duration) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifications, addNotification, removeNotification }
}

// Hook for managing energy metrics
export function useEnergyMetrics() {
  const [metrics, setMetrics] = useState({
    currentUsage: 342,
    estimatedBill: 2850,
    co2Saved: 127.4,
    energyScore: 82,
  })

  const updateMetric = useCallback((key: string, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  return { metrics, updateMetric }
}

// Hook for managing AI recommendations state
export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Array<{
    id: number
    title: string
    savings: number
    implemented: boolean
  }>>([])

  const implementRecommendation = useCallback((id: number) => {
    setRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, implemented: true } : r)
    )
  }, [])

  return { recommendations, implementRecommendation }
}

// Hook for managing goals
export function useGoals() {
  const [goals, setGoals] = useState<Array<{
    id: number
    title: string
    target: number
    current: number
    deadline: string
  }>>([])

  const updateGoalProgress = useCallback((id: number, current: number) => {
    setGoals(prev =>
      prev.map(g => g.id === id ? { ...g, current } : g)
    )
  }, [])

  return { goals, updateGoalProgress }
}

// Hook for managing dark mode
export function usePremiumTheme() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark')
    }
  }, [])

  return { isDark, toggleTheme }
}

// Hook for handling animations
export function useAnimationTrigger(triggerValue: any, delay = 0) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, delay || 300)

    return () => clearTimeout(timer)
  }, [triggerValue, delay])

  return isAnimating
}

// Hook for managing sidebar state
export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return { isOpen, toggle }
}

// Hook for fetching energy data with caching
export function useEnergyData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        usage: 342,
        bill: 2850,
        co2: 127.4,
        score: 82,
      })
      setLoading(false)
    }, 500)
  }, [])

  return { data, loading, error }
}
