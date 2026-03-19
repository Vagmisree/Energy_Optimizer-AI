import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const querySchema = z.object({
  userId: z.string().min(1),
  range: z.enum(["7d", "30d", "90d", "12m"]).optional().default("30d"),
})

function getStartDate(range: "7d" | "30d" | "90d" | "12m") {
  const now = new Date()
  const copy = new Date(now)
  if (range === "7d") copy.setDate(now.getDate() - 7)
  if (range === "30d") copy.setDate(now.getDate() - 30)
  if (range === "90d") copy.setDate(now.getDate() - 90)
  if (range === "12m") copy.setMonth(now.getMonth() - 12)
  return copy
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    userId: url.searchParams.get("userId"),
    range: (url.searchParams.get("range") ?? "30d"),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const startDate = getStartDate(parsed.data.range)

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    include: {
      readings: {
        where: { timestamp: { gte: startDate } },
        orderBy: { timestamp: "asc" },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const daily = user.readings.map((r) => ({
    date: r.timestamp.toISOString().slice(0, 10),
    usage: r.totalUsageKwh,
    bill: r.totalBill,
    peakUsage: r.peakUsageKwh,
    offPeakUsage: r.offPeakUsageKwh,
  }))

  const monthlyMap = new Map<string, { usage: number; bill: number; count: number }>()

  for (const r of user.readings) {
    const key = r.timestamp.toLocaleString("en-IN", { month: "short", year: "numeric" })
    const current = monthlyMap.get(key) ?? { usage: 0, bill: 0, count: 0 }
    current.usage += r.totalUsageKwh
    current.bill += r.totalBill
    current.count += 1
    monthlyMap.set(key, current)
  }

  const monthly = [...monthlyMap.entries()].map(([month, value]) => ({
    month,
    usage: Number((value.usage / value.count).toFixed(2)),
    bill: Number((value.bill / value.count).toFixed(2)),
  }))

  const hourlyUsage = Array.from({ length: 24 }, (_, hour) => {
    const base = 12 + (hour >= 18 && hour <= 22 ? 20 : hour >= 13 && hour <= 17 ? 14 : 6)
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      usage: base,
      isPeak: hour >= 18 && hour <= 22,
    }
  })

  return NextResponse.json({
    range: parsed.data.range,
    daily,
    monthly,
    hourlyUsage,
    totalUsage: Number(
      user.readings.reduce((s, r) => s + r.totalUsageKwh, 0).toFixed(2)
    ),
    totalBill: Number(
      user.readings.reduce((s, r) => s + r.totalBill, 0).toFixed(2)
    ),
  })
}
