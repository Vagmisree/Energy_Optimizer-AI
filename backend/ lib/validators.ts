import { z } from "zod"

export const userIdSchema = z.object({
  userId: z.string().min(1, "userId is required")
})

export const applianceSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2),
  category: z.string().min(2),
  wattage: z.number().int().positive(),
  dailyHours: z.number().min(0).max(24),
  isSmartEnabled: z.boolean().optional().default(false),
  priority: z.number().int().min(1).max(5).optional().default(3)
})

export const ingestSchema = z.object({
  userId: z.string().min(1),
  timestamp: z.string().datetime().optional(),
  source: z.string().optional().default("manual"),
  appliances: z.array(
    z.object({
      applianceId: z.string().optional(),
      name: z.string().min(2),
      category: z.string().min(1),
      wattage: z.number().positive(),
      hours: z.number().min(0).max(24),
      peakShare: z.number().min(0).max(1).optional().default(0.5)
    })
  ).min(1),
  city: z.string().optional(),
  tariffRatePeak: z.number().optional(),
  tariffRateOffPeak: z.number().optional()
})

export const optimizeSchema = z.object({
  userId: z.string().min(1),
  actionType: z.enum([
    "SHIFT_TO_OFF_PEAK",
    "REDUCE_AC_TEMP",
    "TURN_OFF_DEVICE",
    "SCHEDULE_APPLIANCE",
    "ENABLE_ECO_MODE"
  ]),
  applianceName: z.string().min(2),
  oldValue: z.string(),
  newValue: z.string()
})

export const historyQuerySchema = z.object({
  userId: z.string().min(1),
  range: z.enum(["7d", "30d", "90d", "12m"]).optional().default("30d")
})

export const alertPatchSchema = z.object({
  userId: z.string().min(1),
  alertIds: z.array(z.string()).min(1)
})
