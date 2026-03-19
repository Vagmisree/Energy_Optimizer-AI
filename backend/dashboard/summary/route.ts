import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateHourlyUsage, generateMonthlyTrend } from "@/lib/energy-engine"
import { z } from "zod"

const querySchema = z.object({
  userId: z.string().min(1),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    userId: url.searchParams.get("userId"),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    include: {
      appliances: true,
      readings: { orderBy: { timestamp: "desc" }, take: 90 },
      alerts: { orderBy: { createdAt: "desc" }, take: 10 },
      recommendations: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const latest = user.readings[0]
  const currentUsage = latest?.totalUsageKwh ?? 0
  const estimatedBill = latest?.totalBill ?? 0
  const co2Saved = Math.max(0, 18.5 - currentUsage * 0.03)
  const energyScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 - currentUsage * 0.08 - user.alerts.filter((a) => !a.isRead).length * 2
      )
    )
  )

  const applianceBreakdown = user.appliances
    .map((a) => {
      const dailyKwh = (a.wattage / 1000) * a.dailyHours
      return {
        name: a.name,
        usage: Math.round((dailyKwh / Math.max(1, currentUsage)) * 100),
        kWh: Number(dailyKwh.toFixed(2)),
        cost: Number((dailyKwh * user.tariffRatePeak).toFixed(2)),
      }
    })
    .sort((a, b) => b.kWh - a.kWh)

  const monthlyData = generateMonthlyTrend(
    user.readings
      .slice()
      .reverse()
      .map((r) => ({
        timestamp: r.timestamp,
        totalUsageKwh: r.totalUsageKwh,
        totalBill: r.totalBill,
      }))
  )

  const hourlyUsage = generateHourlyUsage(new Date())

  return NextResponse.json({
    currentUsage,
    estimatedBill,
    co2Saved: Number(co2Saved.toFixed(2)),
    energyScore,
    totalMonthlyBill: Number(
      user.readings.reduce((sum, r) => sum + r.totalBill, 0).toFixed(2)
    ),
    unreadAlerts: user.alerts.filter((a) => !a.isRead).length,
    topAppliances: applianceBreakdown.slice(0, 4),
    applianceBreakdown,
    monthlyData,
    hourlyUsage,
    alerts: user.alerts.slice(0, 5),
    recommendations: user.recommendations.slice(0, 5),
    lastUpdated: latest?.timestamp ?? new Date(),
    behaviorProfile:
      currentUsage < 250 ? "Eco Saver" : currentUsage < 450 ? "Balanced User" : "High Consumer",
  })
}
