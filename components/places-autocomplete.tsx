"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGoogleMaps } from "./google-maps-provider"
import type { PlaceResult } from "@/types"

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: PlaceResult) => void
  placeholder: string
  type: "pickup" | "destination"
  focused: boolean
  onFocus: () => void
  onBlur: () => void
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  type,
  focused,
  onFocus,
  onBlur,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const { isLoaded, placesError } = useGoogleMaps() // Added placesError
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState(false) // Track initialization errors

  useEffect(() => {
    if (placesError) {
      setIsInitializing(false)
      setInitError(true)
      return
    }

    const googleMaps = (window as any).google?.maps
    if (!isLoaded || !inputRef.current || autocompleteRef.current || !googleMaps) return

    if (!googleMaps.places) {
      setIsInitializing(false)
      setInitError(true)
      return
    }

    try {
      setIsInitializing(false)

      autocompleteRef.current = new googleMaps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "geometry", "name", "place_id"],
      })

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (place) {
          onChange(place.formatted_address || place.name || "")
          onPlaceSelect(place as PlaceResult)
        }
      })
    } catch (error) {
      console.error("Failed to initialize Places Autocomplete:", error)
      setInitError(true)
    }
  }, [isLoaded, placesError, onChange, onPlaceSelect])

  const handleManualSubmit = () => {
    if (value.trim()) {
      // Create a mock place result for manual input
      onPlaceSelect({
        formatted_address: value,
        name: value,
        place_id: `manual_${Date.now()}`,
        geometry: {
          location: {
            lat: () => 0,
            lng: () => 0,
          },
        },
      })
    }
  }

  const Icon = type === "pickup" ? MapPin : Navigation
  const iconColor = type === "pickup" ? "text-success" : "text-destructive"
  const glowColor = type === "pickup" ? "bg-success/10" : "bg-destructive/10"

  return (
    <div className={cn("relative transition-all duration-300", focused && "scale-[1.02]")}>
      <Icon
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 z-10",
          iconColor,
          focused && "scale-125",
        )}
      />
      {!isLoaded && isInitializing && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {initError && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Places API unavailable. Type location manually.
          </div>
        </div>
      )}
      <Input
        ref={inputRef}
        placeholder={initError ? `${placeholder} (type manually)` : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={(e) => {
          onBlur()
          if (initError) {
            handleManualSubmit()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && initError) {
            handleManualSubmit()
          }
        }}
        className={cn(
          "pl-10 h-14 text-lg border-2 focus:border-primary transition-all duration-300",
          initError && "pr-10",
        )}
      />
      {focused && <div className={cn("absolute inset-0 -z-10 rounded-lg blur-xl animate-pulse", glowColor)} />}
    </div>
  )
}
