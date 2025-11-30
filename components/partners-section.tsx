"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/animated-counter"
import { cn } from "@/lib/utils"

const partners = [
  { name: "Uber", logo: "🚗", color: "bg-foreground text-background", tagline: "Go anywhere" },
  { name: "Ola", logo: "🟢", color: "bg-success text-success-foreground", tagline: "Chalo!" },
  { name: "Rapido", logo: "🏍️", color: "bg-accent text-accent-foreground", tagline: "Bike taxi" },
  { name: "InDrive", logo: "💚", color: "bg-chart-1 text-background", tagline: "You set the price" },
]

const stats = [
  { value: 5, label: "Rides Compared", suffix: "M+", format: "millions" },
  { value: 2, label: "User Savings", prefix: "₹", suffix: "Cr+", format: "crores" },
  { value: 100, label: "Cities Covered", suffix: "+" },
  { value: 4.8, label: "User Rating", suffix: "★", decimal: true },
]

export function PartnersSection() {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      })
    }

    const section = sectionRef.current
    section?.addEventListener("mousemove", handleMouseMove)
    return () => section?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="py-20 bg-primary text-primary-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary-foreground/10 text-primary-foreground border-0 hover:bg-primary-foreground/20 transition-colors cursor-default"
          >
            Trusted Partners
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Compare prices from top ride services</h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            We partner with India's most popular ride-hailing platforms to bring you the best prices.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {partners.map((partner, i) => (
            <div
              key={i}
              className={cn("group relative perspective-1000", "animate-slide-up opacity-0")}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              onMouseEnter={() => setHoveredPartner(i)}
              onMouseLeave={() => setHoveredPartner(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl",
                  "bg-primary-foreground/10 transition-all duration-500 cursor-pointer",
                  "hover:bg-primary-foreground/20 hover:scale-105 hover:shadow-2xl",
                  "active:scale-95",
                )}
                style={{
                  transform:
                    hoveredPartner === i
                      ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`
                      : undefined,
                }}
              >
                <span
                  className={cn(
                    "text-3xl transition-all duration-300",
                    hoveredPartner === i && "scale-125 animate-bounce-subtle",
                  )}
                >
                  {partner.logo}
                </span>
                <div className="text-left">
                  <span className="text-xl font-bold block">{partner.name}</span>
                  <span
                    className={cn(
                      "text-xs text-primary-foreground/50 transition-all duration-300",
                      hoveredPartner === i ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
                    )}
                  >
                    {partner.tagline}
                  </span>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10 blur-xl",
                  "bg-primary-foreground/20",
                  hoveredPartner === i ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={cn("text-center group cursor-default", "animate-slide-up opacity-0")}
              style={{ animationDelay: `${0.4 + i * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="relative inline-block">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-1 transition-all duration-300 group-hover:scale-110 whitespace-nowrap">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  {stat.decimal ? <span>{stat.value}</span> : <AnimatedCounter end={stat.value} duration={2000} />}
                  <span className="transition-all duration-300 group-hover:text-accent">{stat.suffix}</span>
                </p>
                {/* Animated underline on hover */}
                <div
                  className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary-foreground/50",
                    "transition-all duration-300 w-0 group-hover:w-full",
                  )}
                />
              </div>
              <p className="text-xs sm:text-sm text-primary-foreground/70 transition-colors duration-300 group-hover:text-primary-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
