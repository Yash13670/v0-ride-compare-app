import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's ride search history
  const { data: rideHistory } = await supabase
    .from("ride_searches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch user's saved routes
  const { data: savedRoutes } = await supabase
    .from("saved_routes")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <DashboardContent user={user} profile={profile} rideHistory={rideHistory || []} savedRoutes={savedRoutes || []} />
  )
}
