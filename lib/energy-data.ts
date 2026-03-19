// Mock energy data for demonstration
export const energyStats = {
  currentUsage: 342,
  estimatedBill: 2850,
  co2Saved: 12.5,
  energyScore: 78,
}

export const monthlyData = [
  { month: "Jan", usage: 285, prediction: 290, bill: 2280, savings: 120 },
  { month: "Feb", usage: 298, prediction: 305, bill: 2384, savings: 95 },
  { month: "Mar", usage: 312, prediction: 320, bill: 2496, savings: 80 },
  { month: "Apr", usage: 356, prediction: 345, bill: 2848, savings: 0 },
  { month: "May", usage: 398, prediction: 380, bill: 3184, savings: 0 },
  { month: "Jun", usage: 445, prediction: 420, bill: 3560, savings: 0 },
  { month: "Jul", usage: 468, prediction: 450, bill: 3744, savings: 0 },
  { month: "Aug", usage: 452, prediction: 440, bill: 3616, savings: 50 },
  { month: "Sep", usage: 378, prediction: 385, bill: 3024, savings: 150 },
  { month: "Oct", usage: 325, prediction: 335, bill: 2600, savings: 200 },
  { month: "Nov", usage: 295, prediction: 305, bill: 2360, savings: 180 },
  { month: "Dec", usage: 342, prediction: 350, bill: 2736, savings: 140 },
]

export const applianceBreakdown = [
  { name: "Air Conditioner", usage: 38, kWh: 130, cost: 1040 },
  { name: "Refrigerator", usage: 20, kWh: 68, cost: 544 },
  { name: "Water Heater", usage: 14, kWh: 48, cost: 384 },
  { name: "Washing Machine", usage: 8, kWh: 27, cost: 216 },
  { name: "Lighting", usage: 10, kWh: 34, cost: 272 },
  { name: "TV & Entertainment", usage: 6, kWh: 20, cost: 160 },
  { name: "Others", usage: 4, kWh: 15, cost: 120 },
]

export const hourlyUsage = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  usage: Math.floor(Math.random() * 30 + 10) + (i >= 18 && i <= 22 ? 25 : 0),
  isPeak: i >= 18 && i <= 22,
}))

export const aiInsights = [
  {
    id: 1,
    type: "warning",
    title: "AC Usage Alert",
    description: "AC consumes 40% of your energy. Consider raising temperature by 2°C to save 15%.",
    savings: 450,
  },
  {
    id: 2,
    type: "tip",
    title: "LED Opportunity",
    description: "Switching to LED bulbs can save you approximately 300 INR per month.",
    savings: 300,
  },
  {
    id: 3,
    type: "success",
    title: "Off-Peak Usage",
    description: "Great job! You've shifted 30% of laundry to off-peak hours this week.",
    savings: 200,
  },
  {
    id: 4,
    type: "info",
    title: "Solar Potential",
    description: "Based on your roof area, solar panels could cover 60% of your energy needs.",
    savings: 1500,
  },
]

export const achievements = [
  { id: 1, name: "Beginner Saver", icon: "leaf", unlocked: true, description: "Saved your first 100 kWh" },
  { id: 2, name: "Smart Optimizer", icon: "brain", unlocked: true, description: "Used AI recommendations 10 times" },
  { id: 3, name: "Eco Champion", icon: "trophy", unlocked: false, description: "Reduce bill by 30% in a month" },
  { id: 4, name: "Peak Shifter", icon: "clock", unlocked: true, description: "Shifted 50% usage to off-peak" },
  { id: 5, name: "Green Warrior", icon: "tree", unlocked: false, description: "Save 100kg CO2 emissions" },
]

export const energyPersonalities = [
  { type: "eco_saver", name: "Eco Saver", emoji: "leaf", description: "You prioritize sustainability" },
  { type: "balanced", name: "Balanced User", emoji: "scale", description: "Good balance of comfort and savings" },
  { type: "high_consumer", name: "High Consumer", emoji: "zap", description: "Focus on comfort over savings" },
]

export function calculateSavings(
  units: number,
  appliances: string[],
  usageHours: number,
  isPeakUsage: boolean
): { predictedUsage: number; estimatedBill: number; potentialSavings: number } {
  const baseRate = 8 // INR per unit
  const peakMultiplier = isPeakUsage ? 1.25 : 1
  
  const applianceMultiplier = appliances.reduce((acc, appliance) => {
    const multipliers: Record<string, number> = {
      ac: 1.4,
      refrigerator: 1.15,
      heater: 1.3,
      washing: 1.1,
      lighting: 1.05,
    }
    return acc * (multipliers[appliance] || 1)
  }, 1)
  
  const predictedUsage = Math.round(units * applianceMultiplier * (usageHours / 8))
  const estimatedBill = Math.round(predictedUsage * baseRate * peakMultiplier)
  const potentialSavings = Math.round(estimatedBill * 0.25) // 25% potential savings
  
  return { predictedUsage, estimatedBill, potentialSavings }
}
