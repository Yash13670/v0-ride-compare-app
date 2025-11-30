"use client"

import { useState } from "react"
import { Car, Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"
import { cn } from "@/lib/utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const navLinks = [
    { href: "#compare", label: "Compare" },
    { href: "#features", label: "Features" },
    { href: "#partners", label: "Partners" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
              <Car className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
              Ridewise
            </span>
            <Sparkles className="h-4 w-4 opacity-0 -ml-1 transition-all duration-300 group-hover:opacity-100 group-hover:ml-1 text-primary-foreground" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium py-2 transition-colors hover:text-primary-foreground/80"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary-foreground transition-all duration-300 ease-out",
                    hoveredLink === link.href ? "w-full" : "w-0",
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <MagneticButton variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
              Login
            </MagneticButton>
            <MagneticButton className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-shadow">
              Get Started
            </MagneticButton>
          </div>

          <button
            className="md:hidden p-2 transition-transform duration-200 active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden overflow-hidden transition-all duration-300", isOpen ? "max-h-64" : "max-h-0")}>
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 animate-slide-in-right opacity-0"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 text-primary-foreground border border-primary-foreground/20">
              Login
            </Button>
            <Button className="flex-1 bg-primary-foreground text-primary">Get Started</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
