"use client"

import { useState } from "react"
import { TrendingDown, Clock, Shield, Smartphone, MapPin, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: TrendingDown,
    title: "Save up to 40%",
    description: "Find the cheapest option across all ride platforms instantly",
    color: "bg-success/10 text-success",
    hoverColor: "group-hover:bg-success group-hover:text-success-foreground",
  },
  {
    icon: Clock,
    title: "Real-time prices",
    description: "Get live fare updates including surge pricing information",
    color: "bg-accent text-accent-foreground",
    hoverColor: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    icon: Shield,
    title: "Trusted services",
    description: "Compare only from verified and reliable ride partners",
    color: "bg-chart-2/10 text-chart-2",
    hoverColor: "group-hover:bg-chart-2 group-hover:text-white",
  },
  {
    icon: Smartphone,
    title: "Easy booking",
    description: "Redirect to your preferred app with one tap to book",
    color: "bg-chart-3/10 text-chart-3",
    hoverColor: "group-hover:bg-chart-3 group-hover:text-white",
  },
  {
    icon: MapPin,
    title: "City to city",
    description: "Compare fares for intercity travel across major routes",
    color: "bg-chart-4/10 text-chart-4",
    hoverColor: "group-hover:bg-chart-4 group-hover:text-white",
  },
  {
    icon: Bell,
    title: "Price alerts",
    description: "Get notified when prices drop for your favorite routes",
    color: "bg-primary/10 text-primary",
    hoverColor: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
]

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why choose Ridewise?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We make it simple to find the best ride at the best price, every time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <Card
              key={i}
              className={cn(
                "group border-2 transition-all duration-500 cursor-default overflow-hidden relative",
                "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2",
                "animate-slide-up opacity-0",
              )}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background gradient on hover */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-500",
                  "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
                  hoveredIndex === i && "opacity-100",
                )}
              />

              <CardContent className="p-6 relative z-10">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                    "transition-all duration-500 ease-out",
                    feature.color,
                    feature.hoverColor,
                    "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg",
                  )}
                >
                  <feature.icon
                    className={cn(
                      "h-7 w-7 transition-transform duration-500",
                      hoveredIndex === i && "animate-bounce-subtle",
                    )}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:translate-x-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/80">
                  {feature.description}
                </p>

                {/* Animated underline */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500",
                    hoveredIndex === i ? "w-full" : "w-0",
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
