declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions)
  }

  class DirectionsService {
    route(
      request: DirectionsRequest,
      callback: (result: DirectionsResult | null, status: DirectionsStatus) => void,
    ): void
  }

  class DirectionsRenderer {
    constructor(options?: DirectionsRendererOptions)
    setDirections(directions: DirectionsResult): void
  }

  interface MapOptions {
    center?: LatLngLiteral
    zoom?: number
    styles?: MapTypeStyle[]
    disableDefaultUI?: boolean
    zoomControl?: boolean
    fullscreenControl?: boolean
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface MapTypeStyle {
    elementType?: string
    featureType?: string
    stylers: { [key: string]: string }[]
  }

  interface DirectionsRequest {
    origin: LatLng | LatLngLiteral | string | places.PlaceResult
    destination: LatLng | LatLngLiteral | string | places.PlaceResult
    travelMode: TravelMode
  }

  interface DirectionsResult {
    routes: DirectionsRoute[]
  }

  interface DirectionsRoute {
    legs: DirectionsLeg[]
  }

  interface DirectionsLeg {
    distance?: { text: string; value: number }
    duration?: { text: string; value: number }
  }

  interface DirectionsRendererOptions {
    map?: Map
    suppressMarkers?: boolean
    polylineOptions?: PolylineOptions
  }

  interface PolylineOptions {
    strokeColor?: string
    strokeWeight?: number
    strokeOpacity?: number
  }

  type DirectionsStatus =
    | "OK"
    | "NOT_FOUND"
    | "ZERO_RESULTS"
    | "MAX_WAYPOINTS_EXCEEDED"
    | "INVALID_REQUEST"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "UNKNOWN_ERROR"

  enum TravelMode {
    DRIVING = "DRIVING",
    WALKING = "WALKING",
    BICYCLING = "BICYCLING",
    TRANSIT = "TRANSIT",
  }

  class LatLng {
    constructor(lat: number, lng: number)
    lat(): number
    lng(): number
  }

  namespace places {
    class Autocomplete {
      constructor(input: HTMLInputElement, options?: AutocompleteOptions)
      addListener(event: string, handler: () => void): void
      getPlace(): PlaceResult
    }

    interface AutocompleteOptions {
      componentRestrictions?: { country: string | string[] }
      fields?: string[]
      types?: string[]
    }

    interface PlaceResult {
      formatted_address?: string
      geometry?: {
        location: LatLng
      }
      name?: string
      place_id?: string
    }
  }
}
