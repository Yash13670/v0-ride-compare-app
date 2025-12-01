"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Car,
  LogOut,
  History,
  Route,
  MapPin,
  Clock,
  TrendingDown,
  Search,
  Star,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
}

interface RideSearch {
  id: string
  pickup_location: string
  destination_location: string
  distance_km: number | null
  duration_mins: number | null
  cheapest_service: string | null
  cheapest_price: number | null
  ride_type: string
  created_at: string
}

interface SavedRoute {
  id: string
  name: string
  pickup_location: string
  destination_location: string
  created_at: string
}

interface DashboardContentProps {
  user: SupabaseUser
  profile: Profile | null
  rideHistory: RideSearch[]
  savedRoutes: SavedRoute[]
}

export function DashboardContent({ user, profile, rideHistory, savedRoutes }: DashboardContentProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleDeleteRoute = async (routeId: string) => {
    setDeletingRouteId(routeId)
    const supabase = createClient()
    await supabase.from("saved_routes").delete().eq("id", routeId)
    router.refresh()
    setDeletingRouteId(null)
  }

  const totalSavings = rideHistory.reduce((acc, ride) => {
    if (ride.cheapest_price && ride.distance_km) {
      // Estimate average price and calculate savings
      const avgPrice = ride.distance_km * 15 // Average ₹15/km
      const saved = Math.max(0, avgPrice - ride.cheapest_price)
      return acc + saved
    }
    return acc
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Ridewise</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:block">{profile?.full_name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name?.split(" ")[0] || "Rider"}!</h1>
          <p className="text-muted-foreground">Track your ride comparisons and manage saved routes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Comparisons</p>
                  <p className="text-3xl font-bold mt-1">{rideHistory.length}</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-full">
                  <Search className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Savings</p>
                  <p className="text-3xl font-bold mt-1">₹{Math.round(totalSavings)}</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Routes</p>
                  <p className="text-3xl font-bold mt-1">{savedRoutes.length}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link href="/#compare">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Compare New Ride
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Ride History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Comparisons
              </CardTitle>
              <CardDescription>Your last {rideHistory.length} ride comparisons</CardDescription>
            </CardHeader>
            <CardContent>
              {rideHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No ride comparisons yet</p>
                  <p className="text-sm">Start comparing to see your history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rideHistory.map((ride) => (
                    <div key={ride.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-green-500 shrink-0" />
                            <span className="text-sm truncate">{ride.pickup_location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                            <span className="text-sm truncate">{ride.destination_location}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {ride.cheapest_service && (
                            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-1">
                              {ride.cheapest_service}
                            </span>
                          )}
                          {ride.cheapest_price && <p className="text-lg font-bold">₹{ride.cheapest_price}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {ride.distance_km && (
                          <span className="flex items-center gap-1">
                            <Route className="h-3 w-3" />
                            {ride.distance_km.toFixed(1)} km
                          </span>
                        )}
                        {ride.duration_mins && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ride.duration_mins} mins
                          </span>
                        )}
                        <span>{new Date(ride.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Saved Routes
              </CardTitle>
              <CardDescription>Quick access to your frequent destinations</CardDescription>
            </CardHeader>
            <CardContent>
              {savedRoutes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No saved routes yet</p>
                  <p className="text-sm">Save your frequent routes for quick access</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedRoutes.map((route) => (
                    <div key={route.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium mb-2">{route.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate">{route.pickup_location}</span>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                            <span className="truncate">{route.destination_location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/?pickup=${encodeURIComponent(route.pickup_location)}&dest=${encodeURIComponent(route.destination_location)}#compare`}
                          >
                            <Button size="sm" variant="outline">
                              <Search className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRoute(route.id)}
                            disabled={deletingRouteId === route.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
