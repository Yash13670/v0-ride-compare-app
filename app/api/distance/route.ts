import { NextResponse } from 'next/server'

type RequestBody = {
  origin: string
  destination: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { origin, destination } = body

    if (!origin || !destination) {
      return NextResponse.json({ error: 'origin and destination are required' }, { status: 400 })
    }

    const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) {
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 })
    }

    const params = new URLSearchParams({
      origins: origin,
      destinations: destination,
      key,
      units: 'metric',
    })

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`

    const resp = await fetch(url)
    if (!resp.ok) {
      const t = await resp.text()
      return NextResponse.json({ error: 'Google API error', details: t }, { status: 502 })
    }

    const data = await resp.json()

    if (data.status !== 'OK' || !data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
      return NextResponse.json({ error: 'No route data', details: data }, { status: 502 })
    }

    const element = data.rows[0].elements[0]
    if (element.status !== 'OK') {
      return NextResponse.json({ error: 'Route element error', details: element.status }, { status: 502 })
    }

    const distanceMeters = element.distance?.value ?? null
    const durationSeconds = element.duration?.value ?? null

    if (distanceMeters === null || durationSeconds === null) {
      return NextResponse.json({ error: 'No distance/duration in response', details: element }, { status: 502 })
    }

    const distanceKm = Number((distanceMeters / 1000).toFixed(2))
    const durationMin = Math.round(durationSeconds / 60)

    return NextResponse.json({ distance_km: distanceKm, duration_min: durationMin })
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 })
  }
}
