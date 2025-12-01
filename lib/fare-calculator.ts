// Realistic fare calculation based on actual pricing structures
// Note: These are approximations based on publicly available pricing info
// Actual prices may vary based on dynamic pricing, promotions, etc.

export interface FareConfig {
  baseFare: number
  perKmRate: number
  perMinRate: number
  minimumFare: number
  bookingFee: number
  surgeMultiplier?: number
}

export interface CityPricing {
  [city: string]: {
    tier: "metro" | "tier1" | "tier2" | "tier3"
    multiplier: number
  }
}

// City-based pricing tiers (metros are more expensive)
export const cityPricing: CityPricing = {
  // Metro cities
  mumbai: { tier: "metro", multiplier: 1.2 },
  delhi: { tier: "metro", multiplier: 1.15 },
  bangalore: { tier: "metro", multiplier: 1.25 },
  bengaluru: { tier: "metro", multiplier: 1.25 },
  chennai: { tier: "metro", multiplier: 1.1 },
  kolkata: { tier: "metro", multiplier: 1.05 },
  hyderabad: { tier: "metro", multiplier: 1.15 },

  // Tier 1 cities
  pune: { tier: "tier1", multiplier: 1.0 },
  ahmedabad: { tier: "tier1", multiplier: 0.95 },
  jaipur: { tier: "tier1", multiplier: 0.9 },
  lucknow: { tier: "tier1", multiplier: 0.85 },
  chandigarh: { tier: "tier1", multiplier: 0.95 },
  noida: { tier: "tier1", multiplier: 1.1 },
  gurgaon: { tier: "tier1", multiplier: 1.15 },
  gurugram: { tier: "tier1", multiplier: 1.15 },

  // Tier 2 cities
  mysore: { tier: "tier2", multiplier: 0.8 },
  pondicherry: { tier: "tier2", multiplier: 0.85 },
  kochi: { tier: "tier2", multiplier: 0.85 },
  indore: { tier: "tier2", multiplier: 0.8 },
  nagpur: { tier: "tier2", multiplier: 0.8 },
  bhopal: { tier: "tier2", multiplier: 0.75 },
  coimbatore: { tier: "tier2", multiplier: 0.8 },

  // Default for unknown cities
  default: { tier: "tier3", multiplier: 0.75 },
}

// Service-specific pricing configurations (base rates for tier1 cities)
export const servicePricing = {
  uber: {
    uberGo: {
      baseFare: 40,
      perKmRate: 11,
      perMinRate: 1.5,
      minimumFare: 50,
      bookingFee: 5,
    },
    uberPremier: {
      baseFare: 70,
      perKmRate: 15,
      perMinRate: 2,
      minimumFare: 100,
      bookingFee: 10,
    },
    uberXL: {
      baseFare: 100,
      perKmRate: 18,
      perMinRate: 2.5,
      minimumFare: 150,
      bookingFee: 15,
    },
    uberMoto: {
      baseFare: 15,
      perKmRate: 5,
      perMinRate: 0.5,
      minimumFare: 25,
      bookingFee: 2,
    },
    uberAuto: {
      baseFare: 25,
      perKmRate: 8,
      perMinRate: 1,
      minimumFare: 35,
      bookingFee: 3,
    },
  },
  ola: {
    olaMini: {
      baseFare: 35,
      perKmRate: 10,
      perMinRate: 1.25,
      minimumFare: 45,
      bookingFee: 5,
    },
    olaPrime: {
      baseFare: 60,
      perKmRate: 14,
      perMinRate: 1.75,
      minimumFare: 90,
      bookingFee: 8,
    },
    olaPrimeSUV: {
      baseFare: 90,
      perKmRate: 17,
      perMinRate: 2.25,
      minimumFare: 140,
      bookingFee: 12,
    },
    olaBike: {
      baseFare: 15,
      perKmRate: 4.5,
      perMinRate: 0.4,
      minimumFare: 20,
      bookingFee: 2,
    },
    olaAuto: {
      baseFare: 25,
      perKmRate: 7.5,
      perMinRate: 0.9,
      minimumFare: 30,
      bookingFee: 3,
    },
  },
  rapido: {
    rapidoBike: {
      baseFare: 10,
      perKmRate: 3.5,
      perMinRate: 0.3,
      minimumFare: 15,
      bookingFee: 0,
    },
    rapidoAuto: {
      baseFare: 20,
      perKmRate: 6,
      perMinRate: 0.75,
      minimumFare: 25,
      bookingFee: 0,
    },
    rapidoCab: {
      baseFare: 30,
      perKmRate: 9,
      perMinRate: 1,
      minimumFare: 40,
      bookingFee: 0,
    },
  },
  indrive: {
    // InDrive uses negotiated pricing, these are typical accepted rates
    indriveEconomy: {
      baseFare: 30,
      perKmRate: 8,
      perMinRate: 1,
      minimumFare: 40,
      bookingFee: 0,
    },
    indriveComfort: {
      baseFare: 50,
      perKmRate: 12,
      perMinRate: 1.5,
      minimumFare: 70,
      bookingFee: 0,
    },
    indriveBusiness: {
      baseFare: 80,
      perKmRate: 16,
      perMinRate: 2,
      minimumFare: 120,
      bookingFee: 0,
    },
  },
}

// Get time-of-day surge multiplier
function getTimeSurge(): number {
  const hour = new Date().getHours()

  // Peak hours: 8-10 AM and 5-8 PM (higher surge)
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return 1.2 + Math.random() * 0.3 // 1.2x - 1.5x
  }

  // Late night: 10 PM - 6 AM (slight surge)
  if (hour >= 22 || hour < 6) {
    return 1.1 + Math.random() * 0.2 // 1.1x - 1.3x
  }

  // Normal hours: minimal or no surge
  return 1 + Math.random() * 0.1 // 1.0x - 1.1x
}

// Get city multiplier
function getCityMultiplier(pickup: string, destination: string): number {
  const pickupLower = pickup.toLowerCase()
  const destLower = destination.toLowerCase()

  let pickupMultiplier = cityPricing.default.multiplier
  let destMultiplier = cityPricing.default.multiplier

  // Find city in pickup/destination strings
  for (const [city, data] of Object.entries(cityPricing)) {
    if (city !== "default") {
      if (pickupLower.includes(city)) {
        pickupMultiplier = data.multiplier
      }
      if (destLower.includes(city)) {
        destMultiplier = data.multiplier
      }
    }
  }

  // Use average of both cities
  return (pickupMultiplier + destMultiplier) / 2
}

// Calculate fare for a specific service type
function calculateServiceFare(
  config: FareConfig,
  distanceKm: number,
  durationMin: number,
  cityMultiplier: number,
  timeSurge: number,
): number {
  const baseCost = config.baseFare
  const distanceCost = distanceKm * config.perKmRate
  const timeCost = durationMin * config.perMinRate

  let totalFare = (baseCost + distanceCost + timeCost) * cityMultiplier * timeSurge
  totalFare += config.bookingFee

  // Apply minimum fare
  totalFare = Math.max(totalFare, config.minimumFare * cityMultiplier)

  return Math.round(totalFare)
}

// Estimate duration from distance (average speed based on city traffic)
function estimateDuration(distanceKm: number, isIntercity: boolean): number {
  // Average speeds: City = 20-25 km/h, Intercity = 40-50 km/h
  const avgSpeed = isIntercity ? 45 : 22
  const baseMinutes = (distanceKm / avgSpeed) * 60

  // Add some randomness for traffic variation
  const trafficVariation = 0.9 + Math.random() * 0.3 // 0.9x to 1.2x

  return Math.round(baseMinutes * trafficVariation)
}

export interface RideOption {
  service: string
  serviceLogo: string
  serviceColor: string
  type: string
  icon: string
  price: number
  eta: number
  savings: number
  category: "bike" | "auto" | "cab"
  originalPrice?: number
  discount?: number
}

// Main function to calculate all ride options
export function calculateAllFares(
  distanceKm: number,
  pickup: string,
  destination: string,
  providedDuration?: number,
): RideOption[] {
  const isIntercity = distanceKm > 30
  const duration = providedDuration || estimateDuration(distanceKm, isIntercity)
  const cityMultiplier = getCityMultiplier(pickup, destination)
  const timeSurge = getTimeSurge()

  const allRides: RideOption[] = []

  // Uber rides
  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "UberGo",
    icon: "🚙",
    price: calculateServiceFare(servicePricing.uber.uberGo, distanceKm, duration, cityMultiplier, timeSurge),
    eta: Math.round(3 + Math.random() * 7),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "Uber Premier",
    icon: "🚘",
    price: calculateServiceFare(servicePricing.uber.uberPremier, distanceKm, duration, cityMultiplier, timeSurge),
    eta: Math.round(5 + Math.random() * 10),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "Uber XL",
    icon: "🚐",
    price: calculateServiceFare(servicePricing.uber.uberXL, distanceKm, duration, cityMultiplier, timeSurge),
    eta: Math.round(8 + Math.random() * 12),
    savings: 0,
    category: "cab",
  })

  // Only show bike/auto for shorter distances
  if (distanceKm <= 25) {
    allRides.push({
      service: "Uber",
      serviceLogo: "🚗",
      serviceColor: "bg-foreground",
      type: "Uber Moto",
      icon: "🏍️",
      price: calculateServiceFare(servicePricing.uber.uberMoto, distanceKm, duration, cityMultiplier, timeSurge * 0.9),
      eta: Math.round(2 + Math.random() * 5),
      savings: 0,
      category: "bike",
    })

    allRides.push({
      service: "Uber",
      serviceLogo: "🚗",
      serviceColor: "bg-foreground",
      type: "Uber Auto",
      icon: "🛺",
      price: calculateServiceFare(servicePricing.uber.uberAuto, distanceKm, duration, cityMultiplier, timeSurge * 0.95),
      eta: Math.round(3 + Math.random() * 6),
      savings: 0,
      category: "auto",
    })
  }

  // Ola rides
  allRides.push({
    service: "Ola",
    serviceLogo: "🟢",
    serviceColor: "bg-green-600",
    type: "Ola Mini",
    icon: "🚙",
    price: calculateServiceFare(servicePricing.ola.olaMini, distanceKm, duration, cityMultiplier, timeSurge * 0.98),
    eta: Math.round(3 + Math.random() * 6),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Ola",
    serviceLogo: "🟢",
    serviceColor: "bg-green-600",
    type: "Ola Prime Sedan",
    icon: "🚘",
    price: calculateServiceFare(servicePricing.ola.olaPrime, distanceKm, duration, cityMultiplier, timeSurge * 0.98),
    eta: Math.round(5 + Math.random() * 8),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Ola",
    serviceLogo: "🟢",
    serviceColor: "bg-green-600",
    type: "Ola Prime SUV",
    icon: "🚐",
    price: calculateServiceFare(servicePricing.ola.olaPrimeSUV, distanceKm, duration, cityMultiplier, timeSurge * 0.98),
    eta: Math.round(7 + Math.random() * 10),
    savings: 0,
    category: "cab",
  })

  if (distanceKm <= 25) {
    allRides.push({
      service: "Ola",
      serviceLogo: "🟢",
      serviceColor: "bg-green-600",
      type: "Ola Bike",
      icon: "🏍️",
      price: calculateServiceFare(servicePricing.ola.olaBike, distanceKm, duration, cityMultiplier, timeSurge * 0.85),
      eta: Math.round(2 + Math.random() * 4),
      savings: 0,
      category: "bike",
    })

    allRides.push({
      service: "Ola",
      serviceLogo: "🟢",
      serviceColor: "bg-green-600",
      type: "Ola Auto",
      icon: "🛺",
      price: calculateServiceFare(servicePricing.ola.olaAuto, distanceKm, duration, cityMultiplier, timeSurge * 0.9),
      eta: Math.round(3 + Math.random() * 5),
      savings: 0,
      category: "auto",
    })
  }

  // Rapido rides (best for short distances)
  allRides.push({
    service: "Rapido",
    serviceLogo: "🟡",
    serviceColor: "bg-yellow-500",
    type: "Rapido Bike",
    icon: "🏍️",
    price: calculateServiceFare(servicePricing.rapido.rapidoBike, distanceKm, duration, cityMultiplier, 1), // No surge for Rapido
    eta: Math.round(2 + Math.random() * 4),
    savings: 0,
    category: "bike",
  })

  allRides.push({
    service: "Rapido",
    serviceLogo: "🟡",
    serviceColor: "bg-yellow-500",
    type: "Rapido Auto",
    icon: "🛺",
    price: calculateServiceFare(servicePricing.rapido.rapidoAuto, distanceKm, duration, cityMultiplier, 1),
    eta: Math.round(3 + Math.random() * 5),
    savings: 0,
    category: "auto",
  })

  if (distanceKm <= 50) {
    allRides.push({
      service: "Rapido",
      serviceLogo: "🟡",
      serviceColor: "bg-yellow-500",
      type: "Rapido Cab Economy",
      icon: "🚗",
      price: calculateServiceFare(servicePricing.rapido.rapidoCab, distanceKm, duration, cityMultiplier, 1),
      eta: Math.round(4 + Math.random() * 7),
      savings: 0,
      category: "cab",
    })
  }

  // InDrive rides (negotiated pricing - usually cheaper)
  allRides.push({
    service: "InDrive",
    serviceLogo: "💚",
    serviceColor: "bg-green-500",
    type: "InDrive Economy",
    icon: "🚙",
    price: calculateServiceFare(servicePricing.indrive.indriveEconomy, distanceKm, duration, cityMultiplier, 0.95),
    eta: Math.round(5 + Math.random() * 8),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "InDrive",
    serviceLogo: "💚",
    serviceColor: "bg-green-500",
    type: "InDrive Comfort",
    icon: "🚘",
    price: calculateServiceFare(servicePricing.indrive.indriveComfort, distanceKm, duration, cityMultiplier, 0.95),
    eta: Math.round(7 + Math.random() * 10),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "InDrive",
    serviceLogo: "💚",
    serviceColor: "bg-green-500",
    type: "InDrive Business",
    icon: "🚐",
    price: calculateServiceFare(servicePricing.indrive.indriveBusiness, distanceKm, duration, cityMultiplier, 0.95),
    eta: Math.round(10 + Math.random() * 12),
    savings: 0,
    category: "cab",
  })

  // Sort by price
  const sorted = allRides.sort((a, b) => a.price - b.price)

  // Calculate savings compared to cheapest
  const cheapest = sorted[0].price
  sorted.forEach((ride) => {
    ride.savings = Math.round(((ride.price - cheapest) / cheapest) * 100)
  })

  return sorted
}

// Get surge status for display
export function getSurgeStatus(): { active: boolean; multiplier: number; reason: string } {
  const hour = new Date().getHours()

  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return {
      active: true,
      multiplier: 1.3,
      reason: "Peak hours - High demand",
    }
  }

  if (hour >= 22 || hour < 6) {
    return {
      active: true,
      multiplier: 1.15,
      reason: "Late night surcharge",
    }
  }

  return {
    active: false,
    multiplier: 1,
    reason: "Normal pricing",
  }
}
