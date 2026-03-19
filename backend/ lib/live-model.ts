
function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000
  }
  return hash
}

export function buildLiveTelemetry(userId: string) {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  const seed = hashString(userId)
  const base = 1.15 + (seed % 9) * 0.13
  const dayFactor = [0, 6].includes(now.getDay()) ? 1.08 : 1.0
  const summerBoost = [3, 4, 5].includes(now.getMonth()) ? 1.14 : 1.0

  const acLoad = hour >= 13 && hour <= 18 ? 1.85 : hour >= 19 && hour <= 22 ? 1.35 : 0.58
  const lightingLoad = hour >= 18 || hour <= 6 ? 1.15 : 0.36
  const fridgeLoad = 0.92
  const otherLoad = hour >= 8 && hour <= 21 ? 0.82 : 0.44

  const wave = Math.sin((hour + minute / 60) * 0.9) * 0.12
  const currentUsage = (base * dayFactor * summerBoost * (acLoad + lightingLoad + fridgeLoad + otherLoad)) / 2.2 + wave
  const activeDevices = Math.max(2, Math.round(3 + (hour >= 18 ? 3 : 1) + (seed % 2)))
  const temperature = hour >= 13 && hour <= 18 ? 34 : hour >= 19 ? 31 : 28

  return {
    currentUsageKwh: Number(currentUsage.toFixed(2)),
    activeDevices,
    temperature,
    status: currentUsage > 3.8 ? "High Load" : currentUsage > 2.3 ? "Normal" : "Low Load",
    peakRisk: hour >= 18 && hour <= 22 ? "HIGH" : hour >= 13 && hour <= 17 ? "MEDIUM" : "LOW",
    timestamp: now.toISOString()
  }
}
