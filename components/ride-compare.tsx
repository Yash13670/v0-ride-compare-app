"use client"

import { useState, useCallback, useEffect } from "react"
import {
  MapPin,
  Navigation,
  ArrowRight,
  Zap,
  Loader2,
  Search,
  Route,
  Map,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  Check,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { RideCard } from "@/components/ride-card"
import { MagneticButton } from "@/components/magnetic-button"
import { GoogleMapsProvider, useGoogleMaps } from "@/components/google-maps-provider"
import { PlacesAutocomplete } from "@/components/places-autocomplete"
import { RouteMap } from "@/components/route-map"
import { calculateAllFares, getSurgeStatus, type RideOption, getBookingUrl } from "@/lib/fare-calculator"
import { createClient } from "@/lib/supabase/client"
import type { PlaceResult } from "@/types"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const popularRoutes = [
  { from: "Mumbai, Maharashtra", to: "Pune, Maharashtra", distance: 148 },
  { from: "Delhi", to: "Noida, UP", distance: 25 },
  { from: "Bangalore, Karnataka", to: "Mysore, Karnataka", distance: 145 },
  { from: "Chennai, Tamil Nadu", to: "Pondicherry", distance: 150 },
  { from: "Hyderabad", to: "Secunderabad", distance: 8 },
  { from: "Gurgaon, Haryana", to: "Delhi Airport", distance: 28 },
]

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
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isSavingRoute, setIsSavingRoute] = useState(false)
  const [routeSaved, setRouteSaved] = useState(false)
  const [searchSaved, setSearchSaved] = useState(false)

  const { placesError, isLoaded } = useGoogleMaps()
  const surgeStatus = getSurgeStatus()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const saveRideSearch = useCallback(
    async (pickupLoc: string, destLoc: string, dist: number, dur: number | null, cheapestRide: RideOption | null) => {
      if (!user) return

      const supabase = createClient()
      await supabase.from("ride_searches").insert({
        user_id: user.id,
        pickup_location: pickupLoc,
        destination_location: destLoc,
        pickup_lat: pickupPlace?.geometry?.location?.lat ?? null,
        pickup_lng: pickupPlace?.geometry?.location?.lng ?? null,
        destination_lat: destinationPlace?.geometry?.location?.lat ?? null,
        destination_lng: destinationPlace?.geometry?.location?.lng ?? null,
        distance_km: dist,
        duration_mins: dur,
        cheapest_service: cheapestRide?.service ?? null,
        cheapest_price: cheapestRide?.price ?? null,
        ride_type: rideType === "all" ? "cab" : rideType,
      })
      setSearchSaved(true)
      setTimeout(() => setSearchSaved(false), 3000)
    },
    [user, pickupPlace, destinationPlace, rideType],
  )

  const handleSaveRoute = async () => {
    if (!user || !pickup || !destination) return

    setIsSavingRoute(true)
    const supabase = createClient()

    const routeName = `${pickup.split(",")[0]} to ${destination.split(",")[0]}`

    await supabase.from("saved_routes").insert({
      user_id: user.id,
      name: routeName,
      pickup_location: pickup,
      destination_location: destination,
      pickup_lat: pickupPlace?.geometry?.location?.lat ?? null,
      pickup_lng: pickupPlace?.geometry?.location?.lng ?? null,
      destination_lat: destinationPlace?.geometry?.location?.lat ?? null,
      destination_lng: destinationPlace?.geometry?.location?.lng ?? null,
    })

    setIsSavingRoute(false)
    setRouteSaved(true)
    setTimeout(() => setRouteSaved(false), 3000)
  }

  const calculateRides = useCallback(
    (dist: number, pickupLoc: string, destLoc: string, dur?: number) => {
      setIsSearching(true)
      setRides([])

      setTimeout(() => {
        const calculatedRides = calculateAllFares(dist, pickupLoc, destLoc, dur)

        // Persist previous fares in localStorage and attach previous price as originalPrice
        try {
          if (typeof window !== "undefined") {
            const storageKey = `ridewise:fares:${encodeURIComponent(pickupLoc)}:${encodeURIComponent(destLoc)}:${dist}`
            const prevRaw = localStorage.getItem(storageKey)
            const prevMap: Record<string, number> = {}
            if (prevRaw) {
              try {
                const prevArr = JSON.parse(prevRaw) as Array<{ service: string; type: string; price: number }>
                prevArr.forEach((p) => {
                  prevMap[`${p.service}|${p.type}`] = p.price
                })
              } catch (e) {
                // ignore parse errors
              }
            }

            // Attach originalPrice when available
            const withOriginal = calculatedRides.map((r) => ({
              ...r,
              originalPrice: prevMap[`${r.service}|${r.type}`] ?? r.price,
            }))

            setRides(withOriginal)
            setSelectedRide(withOriginal[0])

            // Save current prices for next time
            const toStore = calculatedRides.map((r) => ({ service: r.service, type: r.type, price: r.price }))
            try {
              localStorage.setItem(storageKey, JSON.stringify(toStore))
            } catch (e) {
              // ignore storage errors
            }
          } else {
            setRides(calculatedRides)
            setSelectedRide(calculatedRides[0])
          }
        } catch (err) {
          // Fallback: set normally
          setRides(calculatedRides)
          setSelectedRide(calculatedRides[0])
        }

        setIsSearching(false)

        if (user && calculatedRides.length > 0) {
          saveRideSearch(pickupLoc, destLoc, dist, dur ?? null, calculatedRides[0])
        }
      }, 1500)
    },
    [user, saveRideSearch],
  )

  const handleRouteCalculated = useCallback(
    (dist: number, dur: number) => {
      setDistance(dist)
      setDuration(dur)
      calculateRides(dist, pickup, destination, dur)
    },
    [calculateRides, pickup, destination],
  )

  const handleQuickRoute = (route: (typeof popularRoutes)[0]) => {
    setPickup(route.from)
    setDestination(route.to)
    setPickupPlace(null)
    setDestinationPlace(null)
    setDistance(route.distance)
    setShowMap(false)
    setRouteSaved(false)
    const estimatedDuration = Math.round((route.distance / 40) * 60)
    setDuration(estimatedDuration)
    calculateRides(route.distance, route.from, route.to, estimatedDuration)
  }

  const handleSearch = async () => {
    setRouteSaved(false)

    // If both places are selected and Places API is available, show the map (RouteMap will calculate route)
    if (pickupPlace && destinationPlace && !placesError) {
      setShowMap(true)
      return
    }

    if (pickup && destination) {
      setIsSearching(true)

      try {
        // Try server-side Distance Matrix first
        const res = await fetch('/api/distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: pickup, destination: destination }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data && typeof data.distance_km === 'number') {
            setDistance(data.distance_km)
            setDuration(data.duration_min ?? null)
            calculateRides(data.distance_km, pickup, destination, data.duration_min ?? undefined)
            return
          }
        }
      } catch (err) {
        console.warn('Distance API failed, falling back to estimate', err)
      } finally {
        setIsSearching(false)
      }

      // Fallback deterministic estimate (avoid Math.random to prevent
      // server/client hydration mismatches). Use a small heuristic based
      // on input string lengths so result is stable across renders.
      const seed = (pickup.length + destination.length) % 46
      const fallbackDistance = Math.max(5, Math.min(50, Math.round(seed + 5)))
      const estimatedDuration = Math.round((fallbackDistance / 25) * 60)
      setDistance(fallbackDistance)
      setDuration(estimatedDuration)
      calculateRides(fallbackDistance, pickup, destination, estimatedDuration)
    }
  }

  const filteredRides = rides.filter((ride) => {
    if (rideType === "all") return true
    return ride.category === rideType
  })

  const maxPrice = rides.length > 0 ? Math.max(...rides.map((r) => r.price)) : 0
  const minPrice = rides.length > 0 ? Math.min(...rides.map((r) => r.price)) : 0
  const potentialSavings = maxPrice - minPrice

  return (
    <section id="compare" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 hover-scale cursor-default">
            <Zap className="h-3 w-3 mr-1 animate-pulse" />
            Real-time price comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Compare fares across all platforms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get accurate fare estimates from Uber, Ola, Rapido & InDrive based on real pricing formulas
          </p>
        </div>

        {searchSaved && user && (
          <Alert className="max-w-4xl mx-auto mb-6 border-green-500/50 bg-green-500/10 animate-slide-up">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm">
              Search saved to your history! View it in your{" "}
              <a href="/dashboard" className="underline font-medium">
                dashboard
              </a>
              .
            </AlertDescription>
          </Alert>
        )}

        {surgeStatus.active && (
          <Alert className="max-w-4xl mx-auto mb-6 border-orange-500/50 bg-orange-500/10">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-sm">
              <span className="font-medium">Surge pricing active ({surgeStatus.multiplier}x).</span>{" "}
              {surgeStatus.reason}. Prices may be higher than usual.
            </AlertDescription>
          </Alert>
        )}

        {placesError && (
          <Alert className="max-w-4xl mx-auto mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <span className="font-medium">Places API unavailable.</span> Location autocomplete is disabled. You can
              still type locations manually or use popular routes below.
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
                placeholder="Enter pickup location"
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
                placeholder="Enter drop location"
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
                  Fetching prices from all platforms...
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
                    {route.from.split(",")[0]} → {route.to.split(",")[0]}
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
            {distance && !isSearching && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-secondary rounded-xl animate-slide-up">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <div className="absolute inset-0 animate-ping-slow">
                        <MapPin className="h-4 w-4 text-green-500 opacity-50" />
                      </div>
                    </div>
                    <span className="font-medium">{pickup.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-px w-4 bg-muted-foreground/30" />
                    <div className="h-px w-4 bg-muted-foreground/30" />
                    <div className="h-px w-4 bg-muted-foreground/30" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{destination.split(",")[0]}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-lg px-4 py-2 animate-bounce-subtle">
                    {distance} km
                  </Badge>
                  {duration && (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {duration} min
                    </Badge>
                  )}
                  {potentialSavings > 0 && (
                    <Badge className="text-lg px-4 py-2 bg-green-500/20 text-green-600 border-green-500/30">
                      Save up to ₹{potentialSavings}
                    </Badge>
                  )}
                  {user && (
                    <button
                      onClick={handleSaveRoute}
                      disabled={isSavingRoute || routeSaved}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        routeSaved
                          ? "bg-green-500/20 text-green-600"
                          : "bg-primary/10 text-primary hover:bg-primary/20",
                      )}
                    >
                      {routeSaved ? (
                        <>
                          <Check className="h-4 w-4" />
                          Saved!
                        </>
                      ) : isSavingRoute ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          Save Route
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isSearching && rides.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(["all", "cab", "auto", "bike"] as const).map((type, i) => {
                  const count = rides.filter((r) => type === "all" || r.category === type).length
                  return (
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
                      {type === "all" && `All Options (${count})`}
                      {type === "cab" && `Cabs (${count})`}
                      {type === "auto" && `Auto (${count})`}
                      {type === "bike" && `Bike (${count})`}
                    </button>
                  )
                })}
              </div>
            )}

            {isSearching && (
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                    <p className="text-sm opacity-80 mb-1">Best price found</p>
                    <p className="text-2xl font-bold">
                      {selectedRide.serviceLogo} {selectedRide.service} {selectedRide.type} - ₹{selectedRide.price}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm opacity-80">
                      {duration && <span>Travel time: ~{duration} mins</span>}
                      <span>ETA: {selectedRide.eta} min</span>
                      {selectedRide.savings === 0 && potentialSavings > 0 && (
                        <span className="text-green-300">You save ₹{potentialSavings} vs expensive option</span>
                      )}
                    </div>
                  </div>
                  <MagneticButton
                    size="lg"
                    onClick={() => {
                      try {
                        const url = getBookingUrl(selectedRide, pickup, destination)
                        if (url) {
                          // Redirect in same tab as requested
                          window.location.href = url
                        }
                      } catch (err) {
                        console.error("Booking redirect failed", err)
                      }
                    }}
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
