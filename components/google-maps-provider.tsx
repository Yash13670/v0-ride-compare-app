"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | null
  placesError: boolean // Added placesError to track Places API specific errors
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
  placesError: false,
})

export const useGoogleMaps = () => useContext(GoogleMapsContext)

interface GoogleMapsProviderProps {
  children: ReactNode
  apiKey: string
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [placesError, setPlacesError] = useState(false) // Track Places API errors

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already loaded
    if ((window as any).google?.maps) {
      setIsLoaded(true)
      if (!(window as any).google.maps.places) {
        setPlacesError(true)
      }
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      const handleLoad = () => {
        setIsLoaded(true)
        if (!(window as any).google?.maps?.places) {
          setPlacesError(true)
        }
      }
      existingScript.addEventListener("load", handleLoad)
      return () => existingScript.removeEventListener("load", handleLoad)
    }

    // Create unique callback name
    const callbackName = `initGoogleMaps_${Date.now()}`

    // Define callback on window
    ;(window as any)[callbackName] = () => {
      setIsLoaded(true)
      if (!(window as any).google?.maps?.places) {
        setPlacesError(true)
      }
      delete (window as any)[callbackName]
    }

    const handleGoogleMapsError = (e: ErrorEvent) => {
      if (e.message?.includes("ApiTargetBlockedMapError") || e.message?.includes("Places API")) {
        setPlacesError(true)
      }
    }
    window.addEventListener("error", handleGoogleMapsError)

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=${callbackName}`
    script.async = true
    script.defer = true

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps"))
      delete (window as any)[callbackName]
    }

    document.head.appendChild(script)

    return () => {
      delete (window as any)[callbackName]
      window.removeEventListener("error", handleGoogleMapsError)
    }
  }, [apiKey])

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, placesError }}>{children}</GoogleMapsContext.Provider>
  )
}
