"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, MapPin, Clock, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const appliances = [
  { id: "ac", name: "Air Conditioner", icon: "❄️" },
  { id: "refrigerator", name: "Refrigerator", icon: "🧊" },
  { id: "heater", name: "Water Heater", icon: "🔥" },
  { id: "washing", name: "Washing Machine", icon: "🫧" },
  { id: "lighting", name: "Lighting", icon: "💡" },
  { id: "tv", name: "Television", icon: "📺" },
  { id: "computer", name: "Computer", icon: "💻" },
  { id: "fan", name: "Fan/Cooler", icon: "🌀" },
]

const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
]

export default function AnalyzePage() {
  const router = useRouter()
  const [units, setUnits] = useState("")
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([])
  const [usageHours, setUsageHours] = useState([8])
  const [isPeakUsage, setIsPeakUsage] = useState(false)
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const toggleAppliance = (id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Store form data in sessionStorage for results page
    const formData = {
      units: Number(units),
      appliances: selectedAppliances,
      usageHours: usageHours[0],
      isPeakUsage,
      location,
    }
    sessionStorage.setItem("energyAnalysis", JSON.stringify(formData))
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    router.push("/analyze/results")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analyze Energy</h1>
        <p className="text-muted-foreground">
          Enter your consumption details to get AI-powered predictions and savings tips
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Units Consumed */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="units" className="text-lg font-semibold">Units Consumed</Label>
              <p className="text-sm text-muted-foreground">Enter your monthly kWh usage</p>
            </div>
          </div>
          <Input
            id="units"
            type="number"
            placeholder="e.g., 350"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="text-lg h-12 bg-background/50"
            required
          />
        </div>

        {/* Appliance Selection */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <Label className="text-lg font-semibold">Select Appliances</Label>
            <p className="text-sm text-muted-foreground">Choose the appliances you use regularly</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {appliances.map((appliance) => (
              <button
                key={appliance.id}
                type="button"
                onClick={() => toggleAppliance(appliance.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  selectedAppliances.includes(appliance.id)
                    ? "border-primary bg-primary/10 glow-sm"
                    : "border-border bg-background/50 hover:border-primary/50"
                )}
              >
                <span className="text-2xl block mb-2">{appliance.icon}</span>
                <span className="text-sm font-medium text-foreground">{appliance.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Usage Hours Slider */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-semibold">Average Usage Hours</Label>
              <p className="text-sm text-muted-foreground">Hours of appliance usage per day</p>
            </div>
          </div>
          <div className="px-2">
            <Slider
              value={usageHours}
              onValueChange={setUsageHours}
              max={24}
              min={1}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>1 hour</span>
              <span className="text-primary font-semibold text-lg">{usageHours[0]} hours/day</span>
              <span>24 hours</span>
            </div>
          </div>
        </div>

        {/* Peak Usage Toggle */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {isPeakUsage ? (
                  <ToggleRight className="w-5 h-5 text-primary" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label className="text-lg font-semibold">Peak Hour Usage</Label>
                <p className="text-sm text-muted-foreground">Do you primarily use energy during peak hours (6PM - 10PM)?</p>
              </div>
            </div>
            <Button
              type="button"
              variant={isPeakUsage ? "default" : "outline"}
              onClick={() => setIsPeakUsage(!isPeakUsage)}
              className={cn(
                "rounded-xl px-6",
                isPeakUsage && "glow-sm"
              )}
            >
              {isPeakUsage ? "Yes" : "No"}
            </Button>
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-semibold">Location</Label>
              <p className="text-sm text-muted-foreground">Select your city for accurate rates</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-200 text-center font-medium",
                  location === loc
                    ? "border-primary bg-primary/10 text-primary glow-sm"
                    : "border-border bg-background/50 hover:border-primary/50 text-foreground"
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !units || selectedAppliances.length === 0 || !location}
          className="w-full h-14 text-lg font-semibold rounded-2xl glow hover:glow transition-all duration-300"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing with AI...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Predict Energy Usage
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
