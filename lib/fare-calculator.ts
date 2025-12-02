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
      // Metro-tuned Rapido bike pricing (can be enabled per-city)
      baseFare: 20,
      perKmRate: 5,
      perMinRate: 0.45,
      minimumFare: 30,
      bookingFee: 2,
    },
    rapidoAuto: {
      // Rapido auto (auto-rickshaw) tuned to match observed website ranges
      // Keep auto cheaper than car (cab) while increasing from earlier estimates
      baseFare: 35,
      perKmRate: 8,
      perMinRate: 1.0,
      minimumFare: 45,
      bookingFee: 5,
    },
    rapidoCab: {
      // Rapido 'cab' (economy car) — keep higher than auto
      baseFare: 55,
      perKmRate: 10,
      perMinRate: 1.2,
      minimumFare: 65,
      bookingFee: 8,
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
  // Deterministic surge based on hour of day. Avoid randomness to keep
  // server-render and client-render consistent during hydration.
  const hour = new Date().getHours()

  // Peak hours: 8-10 AM and 5-8 PM (higher surge)
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return 1.3 // fixed peak multiplier
  }

  // Late night: 10 PM - 6 AM (slight surge)
  if (hour >= 22 || hour < 6) {
    return 1.15 // fixed late-night multiplier
  }

  // Normal hours: no surge
  return 1
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

// Find best city key from a freeform location string
function getCityKeyFromString(location: string): string {
  const lower = location.toLowerCase()
  for (const city of Object.keys(cityPricing)) {
    if (city === "default") continue
    if (lower.includes(city)) return city
  }
  return "default"
}

// Per-service adjustments to reflect differences between providers
// Raised above 1.0 to better match publicly displayed fares (can be tuned)
const serviceGlobalAdjustment: Record<string, number> = {
  uber: 1.12,
  ola: 1.10,
  // Raise Rapido adjustment to better match observed auto fares
  rapido: 1.25,
  indrive: 1.0,
}

// Calculate fare for a specific service type
function calculateServiceFare(
  config: FareConfig,
  distanceKm: number,
  durationMin: number,
  cityMultiplier: number,
  timeSurge: number,
  serviceAdjust = 1,
): number {
  const baseCost = config.baseFare
  const distanceCost = distanceKm * config.perKmRate
  const timeCost = durationMin * config.perMinRate

  let totalFare = (baseCost + distanceCost + timeCost) * cityMultiplier * timeSurge * serviceAdjust
  totalFare += config.bookingFee * serviceAdjust

  // Apply minimum fare
  totalFare = Math.max(totalFare, config.minimumFare * cityMultiplier * serviceAdjust)

  return Math.round(totalFare)
}

// Provider-specific finalization: rounding, slabs, special rules
function finalizeFare(provider: string, fare: number): number {
  if (provider === "uber") {
    // Uber typically shows whole-rupee fares and may round up
    return Math.ceil(fare)
  }

  if (provider === "ola") {
    // Ola usually displays rounded fares (nearest rupee)
    return Math.round(fare)
  }

  if (provider === "rapido") {
    // Rapido display rules heuristic:
    // - Bikes and autos in metro city short trips tend to be rounded up to nearest rupee
    // - Larger fares use 5-rupee slabs
    if (fare < 80) return Math.ceil(fare)
    return Math.ceil(fare / 5) * 5
  }

  if (provider === "indrive") {
    // InDrive uses negotiated pricing; present rounded to nearest 5 for readability
    return Math.ceil(fare / 5) * 5
  }

  return Math.round(fare)
}

// Estimate duration from distance (average speed based on city traffic)
function estimateDuration(distanceKm: number, isIntercity: boolean): number {
  // Average speeds: City = 20-25 km/h, Intercity = 40-50 km/h
  const avgSpeed = isIntercity ? 45 : 22
  const baseMinutes = (distanceKm / avgSpeed) * 60

  // Use a deterministic traffic factor to avoid SSR/CSR mismatches.
  // We bias slightly upward for city traffic and keep intercity stable.
  const trafficFactor = isIntercity ? 1 : 1.05
  return Math.round(baseMinutes * trafficFactor)
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

  // Determine city key to decide availability of some vehicle categories (bikes, etc.)
  const cityKey = getCityKeyFromString(pickup)
  const bikeAvailableCities = [
    "mumbai",
    "delhi",
    "bangalore",
    "bengaluru",
    "pune",
    "hyderabad",
    "chennai",
    "kolkata",
  ]
  const isBikeSupported = bikeAvailableCities.includes(cityKey)

  const allRides: RideOption[] = []

  // helper: deterministic ETA estimation (arrival time in minutes)
  function getEtaForCategory(distanceKm: number, category: "bike" | "auto" | "cab") {
    if (category === "bike") {
      // bikes usually reach faster for short distances
      return Math.max(2, Math.round(distanceKm / 3) + 1)
    }
    if (category === "auto") {
      return Math.max(3, Math.round(distanceKm / 2) + 1)
    }
    // cab
    return Math.max(4, Math.round(distanceKm / 1.5) + 2)
  }

  // Uber rides
  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "UberGo",
    icon: "🚙",
    price: finalizeFare('uber', calculateServiceFare(servicePricing.uber.uberGo, distanceKm, duration, cityMultiplier, timeSurge, serviceGlobalAdjustment.uber)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "Uber Premier",
    icon: "🚘",
    price: finalizeFare('uber', calculateServiceFare(servicePricing.uber.uberPremier, distanceKm, duration, cityMultiplier, timeSurge, serviceGlobalAdjustment.uber)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Uber",
    serviceLogo: "🚗",
    serviceColor: "bg-foreground",
    type: "Uber XL",
    icon: "🚐",
    price: finalizeFare('uber', calculateServiceFare(servicePricing.uber.uberXL, distanceKm, duration, cityMultiplier, timeSurge, serviceGlobalAdjustment.uber)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  // Only show bike/auto for shorter distances
  if (distanceKm <= 25) {
    if (isBikeSupported) {
      allRides.push({
        service: "Uber",
        serviceLogo: "🚗",
        serviceColor: "bg-foreground",
        type: "Uber Moto",
        icon: "🏍️",
        price: finalizeFare('uber', calculateServiceFare(servicePricing.uber.uberMoto, distanceKm, duration, cityMultiplier, timeSurge * 0.9, serviceGlobalAdjustment.uber)),
        eta: getEtaForCategory(distanceKm, "bike"),
        savings: 0,
        category: "bike",
      })
    }

    allRides.push({
      service: "Uber",
      serviceLogo: "🚗",
      serviceColor: "bg-foreground",
      type: "Uber Auto",
      icon: "🛺",
      price: finalizeFare('uber', calculateServiceFare(servicePricing.uber.uberAuto, distanceKm, duration, cityMultiplier, timeSurge * 0.95, serviceGlobalAdjustment.uber)),
      eta: getEtaForCategory(distanceKm, "auto"),
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
    price: finalizeFare('ola', calculateServiceFare(servicePricing.ola.olaMini, distanceKm, duration, cityMultiplier, timeSurge * 0.98, serviceGlobalAdjustment.ola)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Ola",
    serviceLogo: "🟢",
    serviceColor: "bg-green-600",
    type: "Ola Prime Sedan",
    icon: "🚘",
    price: finalizeFare('ola', calculateServiceFare(servicePricing.ola.olaPrime, distanceKm, duration, cityMultiplier, timeSurge * 0.98, serviceGlobalAdjustment.ola)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "Ola",
    serviceLogo: "🟢",
    serviceColor: "bg-green-600",
    type: "Ola Prime SUV",
    icon: "🚐",
    price: finalizeFare('ola', calculateServiceFare(servicePricing.ola.olaPrimeSUV, distanceKm, duration, cityMultiplier, timeSurge * 0.98, serviceGlobalAdjustment.ola)),
    eta: getEtaForCategory(distanceKm, "cab"),
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
      price: finalizeFare('ola', calculateServiceFare(servicePricing.ola.olaBike, distanceKm, duration, cityMultiplier, timeSurge * 0.85, serviceGlobalAdjustment.ola)),
      eta: getEtaForCategory(distanceKm, "bike"),
      savings: 0,
      category: "bike",
    })

    allRides.push({
      service: "Ola",
      serviceLogo: "🟢",
      serviceColor: "bg-green-600",
      type: "Ola Auto",
      icon: "🛺",
      price: finalizeFare('ola', calculateServiceFare(servicePricing.ola.olaAuto, distanceKm, duration, cityMultiplier, timeSurge * 0.9, serviceGlobalAdjustment.ola)),
      eta: getEtaForCategory(distanceKm, "auto"),
      savings: 0,
      category: "auto",
    })
  }

  // Compute Rapido prices first so we can enforce logical ordering (auto <= cab)
  const rapidoBikeRaw = calculateServiceFare(
    servicePricing.rapido.rapidoBike,
    distanceKm,
    duration,
    cityMultiplier,
    1,
    serviceGlobalAdjustment.rapido,
  )

  const rapidoAutoRaw = calculateServiceFare(
    servicePricing.rapido.rapidoAuto,
    distanceKm,
    duration,
    cityMultiplier,
    1,
    serviceGlobalAdjustment.rapido,
  )

  const rapidoCabRaw = calculateServiceFare(
    servicePricing.rapido.rapidoCab,
    distanceKm,
    duration,
    cityMultiplier,
    1,
    serviceGlobalAdjustment.rapido,
  )

  const rapidoBikePrice = finalizeFare("rapido", rapidoBikeRaw)
  let rapidoAutoPrice = finalizeFare("rapido", rapidoAutoRaw)
  const rapidoCabPrice = finalizeFare("rapido", rapidoCabRaw)

  // Ensure Rapido Auto is not priced higher than Rapido Cab — auto should be cheaper
  if (rapidoAutoPrice >= rapidoCabPrice) {
    // Try a conservative correction: make auto at least slightly cheaper than cab
    const corrected = Math.max(Math.ceil(rapidoCabPrice - 5), Math.ceil(rapidoAutoPrice * 0.9))
    rapidoAutoPrice = Math.max(1, corrected)
  }

  if (isBikeSupported) {
    allRides.push({
      service: "Rapido",
      serviceLogo: "🟡",
      serviceColor: "bg-yellow-500",
      type: "Rapido Bike",
      icon: "🏍️",
      price: rapidoBikePrice,
      eta: getEtaForCategory(distanceKm, "bike"),
      savings: 0,
      category: "bike",
    })
  }

  allRides.push({
    service: "Rapido",
    serviceLogo: "🟡",
    serviceColor: "bg-yellow-500",
    type: "Rapido Auto",
    icon: "🛺",
    price: rapidoAutoPrice,
    eta: getEtaForCategory(distanceKm, "auto"),
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
      price: rapidoCabPrice,
      eta: getEtaForCategory(distanceKm, "cab"),
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
    price: finalizeFare('indrive', calculateServiceFare(servicePricing.indrive.indriveEconomy, distanceKm, duration, cityMultiplier, 0.95, serviceGlobalAdjustment.indrive)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "InDrive",
    serviceLogo: "💚",
    serviceColor: "bg-green-500",
    type: "InDrive Comfort",
    icon: "🚘",
    price: finalizeFare('indrive', calculateServiceFare(servicePricing.indrive.indriveComfort, distanceKm, duration, cityMultiplier, 0.95, serviceGlobalAdjustment.indrive)),
    eta: getEtaForCategory(distanceKm, "cab"),
    savings: 0,
    category: "cab",
  })

  allRides.push({
    service: "InDrive",
    serviceLogo: "💚",
    serviceColor: "bg-green-500",
    type: "InDrive Business",
    icon: "🚐",
    price: finalizeFare('indrive', calculateServiceFare(servicePricing.indrive.indriveBusiness, distanceKm, duration, cityMultiplier, 0.95, serviceGlobalAdjustment.indrive)),
    eta: getEtaForCategory(distanceKm, "cab"),
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

// Build a provider booking URL. This returns a best-effort URL to the provider's web booking page
// including origin/destination as query parameters. Providers have different deep-link formats;
// we use commonly accepted web entry points and append encoded pickup/destination so the user
// lands on the provider site with the route context (some params may be ignored by provider).
export function getBookingUrl(ride: RideOption, pickup: string, destination: string): string {
  const o = encodeURIComponent(pickup)
  const d = encodeURIComponent(destination)

  const provider = ride.service.toLowerCase()

  if (provider === "uber") {
    // Uber web deep-link (mobile web)
    return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${o}&dropoff[formatted_address]=${d}`
  }

  if (provider === "ola") {
    // Ola booking entry with query hints
    return `https://book.olacabs.com/?pickup=${o}&destination=${d}`
  }

  if (provider === "rapido") {
    // Rapido web entry (bike/auto). Use generic site path with query params
    return `https://www.rapido.bike/?pickup=${o}&destination=${d}`
  }

  if (provider === "indrive") {
    // InDrive web entry
    return `https://indriver.com/?from=${o}&to=${d}`
  }

  // Fallback: open a Google search that helps user land on booking page quickly
  return `https://www.google.com/search?q=book+${provider}+from+${o}+to+${d}`
}
