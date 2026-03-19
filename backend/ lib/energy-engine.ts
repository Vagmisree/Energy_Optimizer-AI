export type BillingInput = {
  peakKwh: number
  offPeakKwh: number
  tariffPeak: number
  tariffOffPeak: number
}

const FIXED_CHARGE = 45
const METER_RENT = 20

export function calculateMonthlyBill(input: BillingInput) {
  const energyCharge = input.peakKwh * input.tariffPeak + input.offPeakKwh * input.tariffOffPeak
  const duty = energyCharge * 0.06
  const tax = (energyCharge + FIXED_CHARGE + METER_RENT + duty) * 0.05
  const total = energyCharge + FIXED_CHARGE + METER_RENT + duty + tax

  return {
    energyCharge: Number(energyCharge.toFixed(2)),
    fixedCharge: FIXED_CHARGE,
    meterRent: METER_RENT,
    duty: Number(duty.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  }
}

export function calculateSlabBill(units: number) {
  const slabs = [
    { min: 0, max: 50, rate: 3.25, name: "0-50" },
    { min: 50, max: 100, rate: 4.05, name: "51-100" },
    { min: 100, max: 200, rate: 5.45, name: "101-200" },
    { min: 200, max: 300, rate: 6.95, name: "201-300" },
    { min: 300, max: 400, rate: 7.50, name: "301-400" },
    { min: 400, max: 500, rate: 8.00, name: "401-500" },
    { min: 500, max: Infinity, rate: 8.50, name: "500+" }
  ]

  let remaining = units
  let total = 0
  const breakdown: Array<{ slab: string; units: number; rate: number; amount: number }> = []

  for (const slab of slabs) {
    if (remaining <= 0) break
    const slabUnits = Math.min(remaining, slab.max - slab.min)
    if (slabUnits > 0) {
      const amount = slabUnits * slab.rate
      total += amount
      breakdown.push({
        slab: slab.name,
        units: Number(slabUnits.toFixed(2)),
        rate: slab.rate,
        amount: Number(amount.toFixed(2))
      })
      remaining -= slabUnits
    }
  }

  return {
    total: Number(total.toFixed(2)),
    breakdown
  }
}
