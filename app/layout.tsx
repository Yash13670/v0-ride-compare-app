import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import AnimatedBackground from "@/components/animated-background"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ridewise - Compare Ride Fares Instantly",
  description: "Compare prices from Uber, Ola, Rapido & InDrive in one place. Find the cheapest ride in seconds.",
  generator: "v0.app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased relative`}> 
        <AnimatedBackground />
        {children}
      </body>
    </html>
  )
}
