"use client"

import type React from "react"

import { useState } from "react"
import { Clock, TrendingDown, Check, Users, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

interface RideCardProps {
  ride: RideOption
  isFirst: boolean
  isSelected: boolean
  onSelect: () => void
  delay: number
}

export function RideCard({ ride, isFirst, isSelected, onSelect, delay }: RideCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 animate-slide-up relative overflow-hidden group",
        isFirst && "bg-accent border-primary shadow-lg",
        !isFirst && isSelected && "border-primary bg-card",
        !isFirst && !isSelected && "border-border bg-card hover:border-primary/50",
        "hover:shadow-xl hover:-translate-y-1",
      )}
      style={{
        animationDelay: `${delay}s`,
        background:
          isHovered && !isFirst
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(250, 204, 21, 0.1) 0%, transparent 50%), var(--card)`
            : undefined,
      }}
    >
      {isFirst && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        </div>
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300",
              isFirst ? "bg-primary text-primary-foreground" : "bg-secondary",
              "group-hover:scale-110 group-hover:rotate-3",
            )}
          >
            {ride.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{ride.serviceLogo}</span>
              <span className="font-bold text-lg group-hover:tracking-wide transition-all">{ride.type}</span>
              {isFirst && (
                <Badge className="bg-success text-success-foreground ml-2 animate-pulse">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Cheapest
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 group-hover:animate-pulse" />
                {ride.eta} min away
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />4 seats
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p
            className={cn(
              "text-2xl font-bold transition-all duration-300",
              isFirst && "text-success",
              isHovered && "scale-110",
            )}
          >
            ₹{ride.price}
          </p>
          {ride.savings > 0 && (
            <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
              <TrendingDown className="h-3 w-3 text-destructive" />+{ride.savings}% more
            </p>
          )}
        </div>

        <div
          className={cn(
            "ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            isSelected
              ? "bg-primary border-primary scale-110"
              : "border-muted-foreground/30 group-hover:border-primary/50",
          )}
        >
          {isSelected && <Check className="h-4 w-4 text-primary-foreground animate-scale-in" />}
        </div>
      </div>
    </button>
  )
}
