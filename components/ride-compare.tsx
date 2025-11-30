"use client"

import { useState, useCallback } from "react"
import { MapPin, Navigation, ArrowRight, Zap, Loader2, Search, Route, Map, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { RideCard } from "@/components/ride-card"
import { MagneticButton } from "@/components/magnetic-button"
import { GoogleMapsProvider, useGoogleMaps } from "@/components/google-maps-provider"
import { PlacesAutocomplete } from "@/components/places-autocomplete"
import { RouteMap } from "@/components/route-map"
import type { PlaceResult } from "@/types"

const popularRoutes = [
  { from: "Mumbai", to: "Pune", distance: 148 },
  { from: "Delhi", to: "Noida", distance: 25 },
  { from: "Bangalore", to: "Mysore", distance: 145 },
  { from: "Chennai", to: "Pondicherry", distance: 150 },
]

const rideServices = [
  {
    id: "uber",
    name: "Uber",
    logo: "🚗",
    color: "bg-foreground",
    textColor: "text-background",
    types: [
      { name: "UberGo", basePrice: 8, perKm: 9, icon: "🚙" },
      { name: "Uber Premier", basePrice: 12, perKm: 14, icon: "🚘" },
      { name: "Uber XL", basePrice: 15, perKm: 18, icon: "🚐" },
    ],
  },
  {
    id: "ola",
    name: "Ola",
    logo: "🟢",
    color: "bg-success",
    textColor: "text-success-foreground",
    types: [
      { name: "Ola Mini", basePrice: 7, perKm: 8, icon: "🚙" },
      { name: "Ola Prime", basePrice: 10, perKm: 12, icon: "🚘" },
      { name: "Ola SUV", basePrice: 14, perKm: 16, icon: "🚐" },
    ],
  },
  {
    id: "rapido",
    name: "Rapido",
    logo: "🏍️",
    color: "bg-accent",
    textColor: "text-accent-foreground",
    types: [
      { name: "Rapido Bike", basePrice: 3, perKm: 4, icon: "🏍️" },
      { name: "Rapido Auto", basePrice: 5, perKm: 6, icon: "🛺" },
      { name: "Rapido Cab", basePrice: 7, perKm: 8, icon: "🚗" },
    ],
  },
  {
    id: "indrive",
    name: "InDrive",
    logo: "💚",
    color: "bg-chart-1",
    textColor: "text-chart-1",
    types: [
      { name: "InDrive Economy", basePrice: 6, perKm: 7, icon: "🚙" },
      { name: "InDrive Comfort", basePrice: 9, perKm: 11, icon: "🚘" },
      { name: "InDrive Business", basePrice: 13, perKm: 15, icon: "🚐" },
    ],
  },
]

interface RideOption {
  service: string
  serviceLogo: string
  serviceColor: string
  type: string
  icon: string
  price: number
  eta: number
  savings: number
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

function RideCompareInner() {
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [pickupPlace, setPickupPlace] = useState<PlaceResult | null>(null)
  const [destinationPlace, setDestinationPlace] = useState<PlaceResult | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [rides, setRides] = useState<RideOption[]>([])
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null)
  const [rideType, setRideType] = useState<"all" | "bike" | "auto" | "cab">("all")
  const [focusedInput, setFocusedInput] = useState<"pickup" | "destination" | null>(null)
  const [showMap, setShowMap] = useState(false)

  const { placesError, isLoaded } = useGoogleMaps()

  const calculateRides = useCallback((dist: number) => {
    setIsSearching(true)
    setRides([])

    setTimeout(() => {
      const allRides: RideOption[] = []

      rideServices.forEach((service) => {
        service.types.forEach((type) => {
          const basePrice = type.basePrice + type.perKm * dist
          const surge = Math.random() > 0.7 ? 1 + Math.random() * 0.3 : 1
          const price = Math.round(basePrice * surge)
          const eta = Math.round(3 + Math.random() * 12)

          allRides.push({
            service: service.name,
            serviceLogo: service.logo,
            serviceColor: service.color,
            type: type.name,
            icon: type.icon,
            price,
            eta,
            savings: 0,
          })
        })
      })

      const sorted = allRides.sort((a, b) => a.price - b.price)
      const cheapest = sorted[0].price

      sorted.forEach((ride) => {
        ride.savings = Math.round(((ride.price - cheapest) / cheapest) * 100)
      })

      setRides(sorted)
      setSelectedRide(sorted[0])
      setIsSearching(false)
    }, 1500)
  }, [])

  const handleRouteCalculated = useCallback(
    (dist: number, dur: number) => {
      setDistance(dist)
      setDuration(dur)
      calculateRides(dist)
    },
    [calculateRides],
  )

  const handleQuickRoute = (route: (typeof popularRoutes)[0]) => {
    setPickup(route.from)
    setDestination(route.to)
    setPickupPlace(null)
    setDestinationPlace(null)
    setDistance(route.distance)
    setShowMap(false)
    calculateRides(route.distance)
  }

  const handleSearch = () => {
    if (pickupPlace && destinationPlace && !placesError) {
      setShowMap(true)
    } else if (pickup && destination) {
      const randomDistance = Math.round(5 + Math.random() * 50)
      setDistance(randomDistance)
      setDuration(Math.round(randomDistance * 2.5))
      calculateRides(randomDistance)
    }
  }

  const filteredRides = rides.filter((ride) => {
    if (rideType === "all") return true
    if (rideType === "bike") return ride.type.toLowerCase().includes("bike")
    if (rideType === "auto") return ride.type.toLowerCase().includes("auto")
    if (rideType === "cab")
      return !ride.type.toLowerCase().includes("bike") && !ride.type.toLowerCase().includes("auto")
    return true
  })

  return (
    <section id="compare" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 hover-scale cursor-default">
            <Zap className="h-3 w-3 mr-1 animate-pulse" />
            Real-time comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Compare fares across all platforms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your pickup and drop location to see prices from Uber, Ola, Rapido & InDrive
          </p>
        </div>

        {placesError && (
          <Alert className="max-w-4xl mx-auto mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <span className="font-medium">Places API unavailable.</span> Location autocomplete is disabled. You can
              still type locations manually or use popular routes below. To enable autocomplete, ensure the{" "}
              <span className="font-medium">Places API</span> is enabled in your Google Cloud Console.
            </AlertDescription>
          </Alert>
        )}

        <Card className="max-w-4xl mx-auto mb-8 border-2 shadow-xl hover:shadow-2xl transition-shadow duration-500 card-3d">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <PlacesAutocomplete
                value={pickup}
                onChange={setPickup}
                onPlaceSelect={(place) => {
                  setPickupPlace(place)
                  setShowMap(false)
                }}
                placeholder="Pickup location"
                type="pickup"
                focused={focusedInput === "pickup"}
                onFocus={() => setFocusedInput("pickup")}
                onBlur={() => setFocusedInput(null)}
              />
              <PlacesAutocomplete
                value={destination}
                onChange={setDestination}
                onPlaceSelect={(place) => {
                  setDestinationPlace(place)
                  setShowMap(false)
                }}
                placeholder="Drop location"
                type="destination"
                focused={focusedInput === "destination"}
                onFocus={() => setFocusedInput("destination")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <MagneticButton
              onClick={handleSearch}
              className={cn(
                "w-full h-14 text-lg bg-primary text-primary-foreground",
                (!pickup || !destination || isSearching) && "opacity-50 pointer-events-none",
              )}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Finding best prices...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Compare Prices
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </MagneticButton>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Route className="h-4 w-4" />
                Popular routes:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map((route, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickRoute(route)}
                    className={cn(
                      "px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium",
                      "transition-all duration-300 hover:bg-primary hover:text-primary-foreground",
                      "hover:scale-105 hover:shadow-lg active:scale-95",
                      "animate-slide-up opacity-0",
                    )}
                    style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    {route.from} → {route.to}
                    <span className="ml-2 text-xs opacity-60">{route.distance}km</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {showMap && pickupPlace && destinationPlace && !placesError && (
          <div className="max-w-4xl mx-auto mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your Route</h3>
            </div>
            <RouteMap pickup={pickupPlace} destination={destinationPlace} onRouteCalculated={handleRouteCalculated} />
          </div>
        )}

        {(rides.length > 0 || isSearching) && (
          <div className="max-w-4xl mx-auto">
            {distance && !isSearching && !showMap && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-secondary rounded-xl animate-slide-up">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-success" />
                      <div className="absolute inset-0 animate-ping-slow">
                        <MapPin className="h-4 w-4 text-success opacity-50" />
                      </div>
                    </div>
                    <span className="font-medium">{pickup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-px w-4 bg-muted-foreground/30" />
                    <div className="h-px w-4 bg-muted-foreground/30" />
                    <div className="h-px w-4 bg-muted-foreground/30" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-destructive" />
                    <span className="font-medium">{destination}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-lg px-4 py-2 animate-bounce-subtle">
                    {distance} km
                  </Badge>
                  {duration && (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      ~{duration} min
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {!isSearching && rides.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(["all", "cab", "auto", "bike"] as const).map((type, i) => (
                  <button
                    key={type}
                    onClick={() => setRideType(type)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                      "hover:scale-105 active:scale-95",
                      rideType === type
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-secondary text-secondary-foreground hover:bg-accent",
                      "animate-slide-up opacity-0",
                    )}
                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
                  >
                    {type === "all" && "All Options"}
                    {type === "cab" && "🚗 Cabs"}
                    {type === "auto" && "🛺 Auto"}
                    {type === "bike" && "🏍️ Bike"}
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-secondary overflow-hidden relative"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>
                ))}
              </div>
            )}

            {!isSearching && filteredRides.length > 0 && (
              <div className="grid gap-4">
                {filteredRides.map((ride, i) => (
                  <RideCard
                    key={`${ride.service}-${ride.type}`}
                    ride={ride}
                    isFirst={i === 0}
                    isSelected={selectedRide?.type === ride.type && selectedRide?.service === ride.service}
                    onSelect={() => setSelectedRide(ride)}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            )}

            {selectedRide && !isSearching && (
              <div className="mt-8 p-6 bg-primary rounded-2xl text-primary-foreground animate-slide-up relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Best price selected</p>
                    <p className="text-2xl font-bold">
                      {selectedRide.service} {selectedRide.type} - ₹{selectedRide.price}
                    </p>
                    {duration && <p className="text-sm opacity-80 mt-1">Estimated travel time: {duration} mins</p>}
                  </div>
                  <MagneticButton
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8"
                  >
                    Book Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </MagneticButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export function RideCompare() {
  if (GOOGLE_MAPS_API_KEY) {
    return (
      <GoogleMapsProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <RideCompareInner />
      </GoogleMapsProvider>
    )
  }

  return (
    <GoogleMapsProvider apiKey="">
      <RideCompareInner />
    </GoogleMapsProvider>
  )
}
