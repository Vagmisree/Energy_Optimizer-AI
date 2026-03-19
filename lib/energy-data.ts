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

// Indian Electricity Tariff Slabs
const TARIFF_SLABS = [
  { min: 0, max: 50, rate: 3.25 },
  { min: 50, max: 100, rate: 4.05 },
  { min: 100, max: 200, rate: 5.45 },
  { min: 200, max: 300, rate: 6.95 },
  { min: 300, max: 400, rate: 7.50 },
  { min: 400, max: 500, rate: 8.00 },
  { min: 500, max: Infinity, rate: 8.50 },
]

function calculateSlabBill(units: number): number {
  let remainingUnits = units
  let total = 0

  for (const slab of TARIFF_SLABS) {
    if (remainingUnits <= 0) break
    const slabUnits = Math.min(remainingUnits, slab.max - slab.min)
    if (slabUnits > 0) {
      total += slabUnits * slab.rate
      remainingUnits -= slabUnits
    }
  }

  return total
}

export function calculateSavings(
  units: number,
  appliances: string[],
  usageHours: number,
  isPeakUsage: boolean
): { predictedUsage: number; estimatedBill: number; potentialSavings: number } {
  // Base consumption adjustment based on appliances
  const applianceFactors: Record<string, number> = {
    ac: 0.38, // AC typically 38% of bill
    refrigerator: 0.12,
    heater: 0.14,
    washing: 0.08,
    lighting: 0.10,
    tv: 0.06,
    computer: 0.08,
    fan: 0.04,
  }
  
  // Calculate total appliance factor
  let totalFactor = 0
  appliances.forEach(app => {
    totalFactor += applianceFactors[app.toLowerCase()] || 0.05
  })
  
  // Normalize if too high
  totalFactor = Math.min(totalFactor, 1.0)
  if (totalFactor === 0) totalFactor = 0.6 // Default assumption
  
  // Adjust usage based on hours (8 hours is baseline)
  const hoursFactor = 0.7 + (usageHours / 24) * 0.6
  
  // Peak usage adds 20% surcharge
  const peakMultiplier = isPeakUsage ? 1.20 : 1.0
  
  // Predict usage
  const predictedUsage = Math.round(units * hoursFactor)
  
  // Calculate bill using slab structure
  const baseEnergy = calculateSlabBill(predictedUsage)
  const fixedCharges = 55 // Fixed + meter rent
  const fuelAdjustment = Math.round(predictedUsage * 0.15)
  const taxes = Math.round((baseEnergy + fixedCharges + fuelAdjustment) * 0.11) // 11% taxes and duties
  
  const estimatedBill = Math.round((baseEnergy + fixedCharges + fuelAdjustment + taxes) * peakMultiplier)
  
  // Savings potential: 18-25% based on appliances and peak usage
  const savingsRate = isPeakUsage ? 0.25 : 0.18
  const potentialSavings = Math.round(estimatedBill * savingsRate)
  
  return { predictedUsage, estimatedBill, potentialSavings }
}
