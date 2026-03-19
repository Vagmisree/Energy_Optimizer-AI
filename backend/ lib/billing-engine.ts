import { calculateMonthlyBill } from "@/lib/billing-engine"

export type ApplianceInput = {
  name: string
  category: string
  wattage: number
  hours: number
  peakShare?: number
}

export type EnergyInput = {
  appliances: ApplianceInput[]
  tariffRatePeak: number
  tariffRateOffPeak: number
  city?: string
  timestamp?: string
}

const CATEGORY_MULTIPLIER: Record<string, number> = {
  ac: 1.25,
  airconditioner: 1.25,
  heater: 1.2,
  waterheater: 1.2,
  refrigerator: 0.95,
  fridge: 0.95,
  lighting: 0.6,
  light: 0.6,
  fan: 0.45,
  appliance: 1.0,
  tv: 0.75
}

function getSeasonMultiplier(month: number) {
  if ([3, 4, 5].includes(month)) return 1.18
  if ([6, 7, 8].includes(month)) return 0.96
  if ([10, 11, 0].includes(month)) return 1.04
  return 1.0
}

function getTimeMultiplier(hour: number) {
  if (hour >= 14 && hour <= 18) return 1.18
  if (hour >= 19 && hour <= 22) return 1.12
  if (hour >= 0 && hour <= 5) return 0.88
  return 1.0
}

function normalizeCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "")
}

export function calculateEnergyProfile(input: EnergyInput) {
  const now = input.timestamp ? new Date(input.timestamp) : new Date()
  const seasonMultiplier = getSeasonMultiplier(now.getMonth())
  const timeMultiplier = getTimeMultiplier(now.getHours())
  const weekendMultiplier = [0, 6].includes(now.getDay()) ? 1.08 : 1.0

  let totalUsageKwh = 0
  let peakUsageKwh = 0
  let offPeakUsageKwh = 0

  const applianceBreakdown = input.appliances.map((a) => {
    const normalized = normalizeCategory(a.category)
    const categoryMultiplier = CATEGORY_MULTIPLIER[normalized] ?? 1.0
    const baseKwh = (a.wattage / 1000) * a.hours
    const adjustedKwh = baseKwh * categoryMultiplier * seasonMultiplier * timeMultiplier * weekendMultiplier

    const peakShare = a.peakShare ?? (normalized.includes("ac") ? 0.62 : normalized.includes("heater") ? 0.52 : 0.42)
    const peakKwh = adjustedKwh * peakShare
    const offPeakKwh = adjustedKwh - peakKwh

    totalUsageKwh += adjustedKwh
    peakUsageKwh += peakKwh
    offPeakUsageKwh += offPeakKwh

    return {
      name: a.name,
      category: a.category,
      wattage: a.wattage,
      hours: a.hours,
      kwh: Number(adjustedKwh.toFixed(2)),
      peakKwh: Number(peakKwh.toFixed(2)),
      offPeakKwh: Number(offPeakKwh.toFixed(2))
    }
  })

  const bill = calculateMonthlyBill({
    peakKwh: peakUsageKwh,
    offPeakKwh: offPeakUsageKwh,
    tariffPeak: input.tariffRatePeak,
    tariffOffPeak: input.tariffRateOffPeak
  })

  const carbonKg = totalUsageKwh * 0.82
  const energyScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          (totalUsageKwh * 0.32) -
          (peakUsageKwh * 0.55) -
          Math.max(0, bill.total - 3000) / 120
      )
    )
  )

  const behaviorProfile =
    peakUsageKwh / Math.max(1, totalUsageKwh) > 0.58
      ? "Peak Hour Heavy User"
      : totalUsageKwh < 250
        ? "Eco Saver"
        : totalUsageKwh < 450
          ? "Balanced User"
          : "High Consumer"

  const topAppliances = [...applianceBreakdown]
    .sort((a, b) => b.kwh - a.kwh)
    .slice(0, 3)

  return {
    totalUsageKwh: Number(totalUsageKwh.toFixed(2)),
    peakUsageKwh: Number(peakUsageKwh.toFixed(2)),
    offPeakUsageKwh: Number(offPeakUsageKwh.toFixed(2)),
    totalBill: bill.total,
    billBreakdown: bill,
    carbonKg: Number(carbonKg.toFixed(2)),
    energyScore,
    behaviorProfile,
    topAppliances,
    applianceBreakdown
  }
}

export function generateHourlyUsage(date = new Date()) {
  const month = date.getMonth()
  const isSummer = [3, 4, 5].includes(month)

  return Array.from({ length: 24 }, (_, hour) => {
    const nightBase = hour <= 5 ? 10 : 0
    const morningBase = hour >= 6 && hour <= 10 ? 18 : 0
    const afternoonPeak = hour >= 13 && hour <= 17 ? (isSummer ? 34 : 24) : 0
    const eveningPeak = hour >= 18 && hour <= 22 ? 30 : 0
    const lateNight = hour >= 23 ? 12 : 0

    const usage = Math.round(
      14 + nightBase + morningBase + afternoonPeak + eveningPeak + lateNight
    )

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      usage,
      isPeak: hour >= 18 && hour <= 22
    }
  })
}

export function generateMonthlyTrend(readings: Array<{ timestamp: Date; totalUsageKwh: number; totalBill: number }>) {
  const buckets = new Map<string, { usage: number; bill: number; count: number }>()

  for (const r of readings) {
    const key = r.timestamp.toLocaleString("en-IN", { month: "short", year: "numeric" })
    const current = buckets.get(key) ?? { usage: 0, bill: 0, count: 0 }
    current.usage += r.totalUsageKwh
    current.bill += r.totalBill
    current.count += 1
    buckets.set(key, current)
  }

  return [...buckets.entries()].map(([month, value]) => ({
    month,
    usage: Number((value.usage / value.count).toFixed(2)),
    bill: Number((value.bill / value.count).toFixed(2))
  }))
}
