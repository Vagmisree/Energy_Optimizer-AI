import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { buildForecast, buildSevenDayForecast } from "@/lib/forecast-engine"
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
      readings: { orderBy: { timestamp: "asc" }, take: 90 },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const forecast = buildForecast(
    user.readings.map((r) => ({
      timestamp: r.timestamp,
      totalUsageKwh: r.totalUsageKwh,
      totalBill: r.totalBill,
    })),
    user.tariffRatePeak,
    user.monthlyBudget
  )

  const sevenDay = buildSevenDayForecast(
    user.readings.map((r) => ({
      timestamp: r.timestamp,
      totalUsageKwh: r.totalUsageKwh,
      totalBill: r.totalBill,
    })),
    user.tariffRatePeak
  )

  const saved = await prisma.forecast.create({
    data: {
      userId: user.id,
      month: new Date().toLocaleString("en-IN", { month: "long", year: "numeric" }),
      predictedUsageKwh: forecast.predictedUsageKwh,
      predictedBill: forecast.predictedBill,
      confidenceScore: forecast.confidenceScore,
      explanation: forecast.explanation,
    },
  })

  return NextResponse.json({
    forecast: saved,
    meta: forecast,
    sevenDay,
  })
}
