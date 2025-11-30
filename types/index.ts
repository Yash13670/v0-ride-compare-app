export interface LatLng {
  lat: () => number
  lng: () => number
}

export interface Geometry {
  location: LatLng
}

export interface PlaceResult {
  formatted_address?: string
  geometry?: Geometry
  name?: string
  place_id?: string
}

export interface DirectionsLeg {
  distance?: { value: number; text: string }
  duration?: { value: number; text: string }
}

export interface DirectionsRoute {
  legs: DirectionsLeg[]
}

export interface DirectionsResult {
  routes: DirectionsRoute[]
}
