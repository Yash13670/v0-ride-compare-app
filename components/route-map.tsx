"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useGoogleMaps } from "./google-maps-provider"
import { Loader2, MapPin, Navigation, Clock, Route } from "lucide-react"
import type { PlaceResult, DirectionsResult } from "@/types" // Updated import to use custom types

interface RouteMapProps {
  pickup: PlaceResult | null // Updated type
  destination: PlaceResult | null // Updated type
  onRouteCalculated: (distance: number, duration: number) => void
}

export function RouteMap({ pickup, destination, onRouteCalculated }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null) // Updated ref type to any
  const directionsRendererRef = useRef<any>(null) // Updated ref type to any
  const { isLoaded } = useGoogleMaps()
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Initialize map
  useEffect(() => {
    const googleMaps = (window as any).google?.maps
    if (!isLoaded || !mapRef.current || mapInstanceRef.current || !googleMaps) return

    mapInstanceRef.current = new googleMaps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1a1a" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e0e" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
    })

    directionsRendererRef.current = new googleMaps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#FACC15",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    })
  }, [isLoaded])

  // Memoize route calculation callback
  const handleRouteCalculated = useCallback(onRouteCalculated, [onRouteCalculated])

  // Calculate and display route
  useEffect(() => {
    const googleMaps = (window as any).google?.maps
    if (!isLoaded || !mapInstanceRef.current || !directionsRendererRef.current || !googleMaps) return
    if (!pickup?.geometry?.location || !destination?.geometry?.location) return

    setIsCalculating(true)

    const directionsService = new googleMaps.DirectionsService()

    directionsService.route(
      {
        origin: pickup.geometry.location,
        destination: destination.geometry.location,
        travelMode: googleMaps.TravelMode.DRIVING,
      },
      (result: DirectionsResult | null, status: string) => {
        // Updated types
        setIsCalculating(false)

        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)

          const route = result.routes[0]
          if (route?.legs?.[0]) {
            const leg = route.legs[0]
            const distanceKm = Math.round((leg.distance?.value || 0) / 1000)
            const durationMin = Math.round((leg.duration?.value || 0) / 60)

            setRouteInfo({
              distance: leg.distance?.text || "",
              duration: leg.duration?.text || "",
            })

            handleRouteCalculated(distanceKm, durationMin)
          }
        }
      },
    )
  }, [isLoaded, pickup, destination, handleRouteCalculated])

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-border" />

      {/* Route Info Overlay */}
      {routeInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 border shadow-lg animate-slide-up">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Route className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-bold text-lg">{routeInfo.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-bold text-lg">{routeInfo.duration}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 text-success" />
              <span>→</span>
              <Navigation className="h-3 w-3 text-destructive" />
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isCalculating && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="flex items-center gap-3 bg-background px-6 py-3 rounded-xl shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">Calculating route...</span>
          </div>
        </div>
      )}
    </div>
  )
}
