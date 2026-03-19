
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const querySchema = z.object({
  userId: z.string().min(1),
})

const patchSchema = z.object({
  userId: z.string().min(1),
  alertIds: z.array(z.string().min(1)).min(1),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    userId: url.searchParams.get("userId"),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: parsed.data.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json({
    alerts,
    unreadCount: alerts.filter((a) => !a.isRead).length,
  })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const data = patchSchema.parse(body)

    await prisma.alert.updateMany({
      where: {
        userId: data.userId,
        id: { in: data.alertIds },
      },
      data: { isRead: true },
    })

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        eventType: "ALERTS_MARKED_READ",
        payload: { alertIds: data.alertIds },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid request" },
      { status: 400 }
    )
  }
}
