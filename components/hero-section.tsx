"use client"

import { useEffect, useState } from "react"
import { ArrowDown, Sparkles, Zap, TrendingDown, Clock } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import { AnimatedCounter } from "@/components/animated-counter"

const rotatingWords = ["cheapest", "fastest", "smartest", "best"]

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length)
        setIsAnimating(false)
      }, 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-accent overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
          <div className="absolute inset-0 border border-primary/10 rounded-full animate-rotate-slow" />
          <div
            className="absolute inset-8 border border-primary/10 rounded-full animate-rotate-slow"
            style={{ animationDirection: "reverse", animationDuration: "25s" }}
          />
          <div
            className="absolute inset-16 border border-primary/10 rounded-full animate-rotate-slow"
            style={{ animationDuration: "30s" }}
          />
        </div>

        {/* Floating icons */}
        <div className="absolute top-32 right-[20%] animate-float opacity-20" style={{ animationDelay: "0.5s" }}>
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute bottom-32 left-[15%] animate-float opacity-20" style={{ animationDelay: "1.5s" }}>
          <TrendingDown className="h-10 w-10 text-success" />
        </div>
        <div className="absolute top-1/2 right-[10%] animate-float opacity-20" style={{ animationDelay: "2s" }}>
          <Clock className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6 animate-slide-up hover-glow cursor-default">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Compare rides instantly</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-accent-foreground mb-6 tracking-tight text-balance animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Find the{" "}
            <span className="relative inline-block">
              <span
                className={`inline-block transition-all duration-200 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                {rotatingWords[wordIndex]}
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray="200"
                  strokeDashoffset="0"
                >
                  <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1s" fill="freeze" />
                </path>
              </svg>
            </span>{" "}
            ride in seconds
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Compare fares from Uber, Ola, Rapido & InDrive in one place. Save money on every ride with real-time price
            comparisons.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <MagneticButton
              size="lg"
              className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Compare Rides Now
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 bg-transparent hover:border-primary/40 transition-all"
            >
              Learn More
            </MagneticButton>
          </div>

          <div
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-center group cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">
                <AnimatedCounter end={50} suffix="K+" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">
                <AnimatedCounter end={40} suffix="%" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">Avg Savings</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">
                <AnimatedCounter end={100} suffix="+" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">Cities</p>
            </div>
          </div>

          <div className="mt-12 flex justify-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <a
              href="#compare"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group"
            >
              <span className="text-sm group-hover:tracking-wide transition-all">Scroll to compare</span>
              <ArrowDown className="h-5 w-5 animate-bounce group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
