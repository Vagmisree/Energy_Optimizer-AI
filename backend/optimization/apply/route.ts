
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { optimizeSchema } from "@/lib/validators"

function savingsFor(actionType: string) {
  switch (actionType) {
    case "SHIFT_TO_OFF_PEAK":
      return 420
    case "REDUCE_AC_TEMP":
      return 280
    case "TURN_OFF_DEVICE":
      return 160
    case "SCHEDULE_APPLIANCE":
      return 240
    case "ENABLE_ECO_MODE":
      return 200
    default:
      return 120
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = optimizeSchema.parse(body)

    const action = await prisma.optimizationAction.create({
      data: {
        userId: data.userId,
        actionType: data.actionType,
        applianceName: data.applianceName,
        oldValue: data.oldValue,
        newValue: data.newValue,
        estimatedSavings: savingsFor(data.actionType),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        eventType: "OPTIMIZATION_APPLIED",
        payload: action,
      },
    })

    await prisma.recommendation.updateMany({
      where: {
        userId: data.userId,
        title: { contains: data.applianceName, mode: "insensitive" },
      },
      data: { isApplied: true },
    })

    return NextResponse.json({
      success: true,
      action,
      message: "Optimization applied successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid request" },
      { status: 400 }
    )
  }
}
