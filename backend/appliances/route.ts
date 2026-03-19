
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { applianceSchema, userIdSchema } from "@/lib/validators"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = userIdSchema.safeParse({ userId: url.searchParams.get("userId") })

  if (!parsed.success) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const appliances = await prisma.appliance.findMany({
    where: { userId: parsed.data.userId },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  })

  return NextResponse.json({ appliances })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = applianceSchema.parse(body)

    const appliance = await prisma.appliance.create({
      data: {
        userId: data.userId,
        name: data.name,
        category: data.category,
        wattage: data.wattage,
        dailyHours: data.dailyHours,
        isSmartEnabled: data.isSmartEnabled,
        priority: data.priority,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        eventType: "APPLIANCE_CREATED",
        payload: appliance,
      },
    })

    return NextResponse.json({ success: true, appliance })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid request" },
      { status: 400 }
    )
  }
}
