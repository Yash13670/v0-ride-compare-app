"use client"

import { useState } from "react"
import { Car, Twitter, Instagram, Linkedin, Mail, ArrowRight, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const productLinks = [
  { label: "Compare Rides", href: "#" },
  { label: "City Routes", href: "#" },
  { label: "Price Alerts", href: "#" },
  { label: "Mobile App", href: "#" },
]

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
]

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail("")
    }
  }

  return (
    <footer className="bg-card border-t relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                <Car className="h-6 w-6 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold transition-all duration-300 group-hover:tracking-wide">Ridewise</span>
            </div>
            <p className="text-muted-foreground mb-6">Compare ride fares instantly and save money on every trip.</p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={cn(
                    "relative p-2 rounded-lg transition-all duration-300",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-secondary hover:scale-110",
                    hoveredSocial === social.label && "bg-secondary scale-110",
                  )}
                  onMouseEnter={() => setHoveredSocial(social.label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                  {/* Tooltip */}
                  <span
                    className={cn(
                      "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-foreground text-background",
                      "transition-all duration-200",
                      hoveredSocial === social.label ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                    )}
                  >
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="relative text-muted-foreground hover:text-foreground transition-colors inline-block group"
                    onMouseEnter={() => setHoveredLink(`product-${link.label}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="relative">
                      {link.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300",
                          hoveredLink === `product-${link.label}` ? "w-full" : "w-0",
                        )}
                      />
                    </span>
                    <ArrowRight
                      className={cn(
                        "inline-block h-3 w-3 ml-1 transition-all duration-300",
                        hoveredLink === `product-${link.label}`
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2",
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="relative text-muted-foreground hover:text-foreground transition-colors inline-block"
                    onMouseEnter={() => setHoveredLink(`company-${link.label}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="relative">
                      {link.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300",
                          hoveredLink === `company-${link.label}` ? "w-full" : "w-0",
                        )}
                      />
                    </span>
                    <ArrowRight
                      className={cn(
                        "inline-block h-3 w-3 ml-1 transition-all duration-300",
                        hoveredLink === `company-${link.label}`
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2",
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Stay updated</h4>
            <p className="text-muted-foreground mb-4">Get notified about new features and price drops.</p>
            <div className="relative">
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg animate-scale-in">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              ) : (
                <div className="flex gap-2 group">
                  <Input
                    placeholder="Enter email"
                    className="flex-1 transition-all duration-300 focus:scale-[1.02]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                  <Button
                    className={cn(
                      "bg-primary text-primary-foreground transition-all duration-300",
                      "hover:scale-105 hover:shadow-lg active:scale-95",
                    )}
                    onClick={handleSubscribe}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2025 Ridewise. Made with <Heart className="h-3 w-3 text-destructive animate-pulse inline" /> in India
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((text) => (
              <a
                key={text}
                href="#"
                className="relative hover:text-foreground transition-colors"
                onMouseEnter={() => setHoveredLink(`footer-${text}`)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {text}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300",
                    hoveredLink === `footer-${text}` ? "w-full" : "w-0",
                  )}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
