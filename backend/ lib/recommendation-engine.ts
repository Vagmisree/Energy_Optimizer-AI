
export type InsightInput = {
  totalUsageKwh: number
  peakUsageKwh: number
  carbonKg: number
  topAppliances: Array<{ name: string; kwh: number }>
  monthlyBudget: number
}

export function generateRecommendations(input: InsightInput) {
  const recommendations: Array<{
    title: string
    description: string
    impactScore: number
    estimatedSavings: number
    priority: number
    category: "AC" | "LIGHTING" | "APPLIANCE" | "BILLING" | "SOLAR" | "SCHEDULING" | "BEHAVIOR"
  }> = []

  const peakRatio = input.peakUsageKwh / Math.max(1, input.totalUsageKwh)
  const top = input.topAppliances[0]

  if (peakRatio > 0.58) {
    recommendations.push({
      title: "Shift High-Load Appliances to Off-Peak Hours",
      description:
        "Your peak-hour usage is high. Running washing machine, geyser, and heavy loads after 10 PM will lower cost.",
      impactScore: 94,
      estimatedSavings: 420,
      priority: 1,
      category: "SCHEDULING"
    })
  }

  if (top && /ac|air/i.test(top.name)) {
    recommendations.push({
      title: "Optimize AC Temperature",
      description:
        "Raise AC temperature by 1–2°C and use fan assist. This usually saves meaningful monthly power.",
      impactScore: 90,
      estimatedSavings: 360,
      priority: 1,
      category: "AC"
    })
  }

  if (input.totalUsageKwh > 350) {
    recommendations.push({
      title: "Replace Old Lighting With LEDs",
      description:
        "Lighting load is easy to reduce. LED migration gives steady monthly savings and longer bulb life.",
      impactScore: 76,
      estimatedSavings: 180,
      priority: 2,
      category: "LIGHTING"
    })
  }

  if (input.monthlyBudget < 3000 && input.totalUsageKwh > 300) {
    recommendations.push({
      title: "Enable Budget Guardrail Alerts",
      description:
        "Set a monthly spending threshold so you are notified before overspending.",
      impactScore: 68,
      estimatedSavings: 0,
      priority: 3,
      category: "BILLING"
    })
  }

  if (input.carbonKg > 220) {
    recommendations.push({
      title: "Solar Feasibility Review",
      description:
        "Your usage pattern suggests solar could cover part of the load and reduce long-term bill pressure.",
      impactScore: 71,
      estimatedSavings: 900,
      priority: 3,
      category: "SOLAR"
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Maintain Current Efficiency",
      description: "Your current pattern is stable. Continue tracking peak-hour usage for best savings.",
      impactScore: 58,
      estimatedSavings: 90,
      priority: 3,
      category: "BEHAVIOR"
    })
  }

  return recommendations
}
