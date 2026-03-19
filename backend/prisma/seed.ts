
import { prisma } from "../lib/db"

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@energy.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@energy.ai",
      city: "Hyderabad",
      homeSize: 3,
      tariffRatePeak: 10.5,
      tariffRateOffPeak: 6.2,
      monthlyBudget: 3500,
      appliances: {
        create: [
          { name: "Air Conditioner", category: "AC", wattage: 1800, dailyHours: 6, isSmartEnabled: true, priority: 1 },
          { name: "Refrigerator", category: "Refrigerator", wattage: 180, dailyHours: 24, isSmartEnabled: false, priority: 1 },
          { name: "Water Heater", category: "Heater", wattage: 2000, dailyHours: 1.5, isSmartEnabled: false, priority: 2 },
          { name: "Washing Machine", category: "Appliance", wattage: 500, dailyHours: 1, isSmartEnabled: false, priority: 3 },
          { name: "Lighting", category: "Lighting", wattage: 120, dailyHours: 7, isSmartEnabled: false, priority: 2 }
        ]
      }
    },
    include: { appliances: true }
  })

  const today = new Date()
  const readings = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))

    const trend = 286 + i * 2.8
    const weekendBoost = [0, 6].includes(d.getDay()) ? 18 : 0
    const seasonalBoost = d.getMonth() >= 3 && d.getMonth() <= 5 ? 22 : 0
    const usage = Math.round(trend + weekendBoost + seasonalBoost)

    return {
      userId: user.id,
      timestamp: d,
      totalUsageKwh: usage,
      totalBill: Number((usage * 8.4).toFixed(2)),
      peakUsageKwh: Number((usage * 0.57).toFixed(2)),
      offPeakUsageKwh: Number((usage * 0.43).toFixed(2)),
      carbonKg: Number((usage * 0.82).toFixed(2)),
      source: "seed"
    }
  })

  await prisma.energyReading.createMany({ data: readings })

  console.log("Seeded demo user:", user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
