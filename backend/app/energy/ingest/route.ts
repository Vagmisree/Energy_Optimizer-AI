
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ingestSchema } from "@/lib/validators"
import { calculateEnergyProfile } from "@/lib/energy-engine"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = ingestSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { appliances: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const profile = calculateEnergyProfile({
      appliances: data.appliances.length
        ? data.appliances
        : user.appliances.map((a) => ({
            name: a.name,
            category: a.category,
            wattage: a.wattage,
            hours: a.dailyHours,
            peakShare: a.category.toLowerCase().includes("ac") ? 0.62 : 0.45,
          })),
      tariffRatePeak: data.tariffRatePeak ?? user.tariffRatePeak,
      tariffRateOffPeak: data.tariffRateOffPeak ?? user.tariffRateOffPeak,
      city: data.city ?? user.city,
      timestamp: data.timestamp,
    })

    const reading = await prisma.energyReading.create({
      data: {
        userId: user.id,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        totalUsageKwh: profile.totalUsageKwh,
        totalBill: profile.totalBill,
        peakUsageKwh: profile.peakUsageKwh,
        offPeakUsageKwh: profile.offPeakUsageKwh,
        carbonKg: profile.carbonKg,
        source: data.source ?? "manual",
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "ENERGY_INGESTED",
        payload: {
          readingId: reading.id,
          usage: profile.totalUsageKwh,
          bill: profile.totalBill,
          energyScore: profile.energyScore,
        },
      },
    })

    return NextResponse.json({
      success: true,
      reading,
      profile,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid request" },
      { status: 400 }
    )
  }
}
