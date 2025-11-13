"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Rocket } from "lucide-react"

export default function Landing() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-background" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary/80 bg-clip-text text-transparent">
              NovaPush
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl text-center space-y-8 page-enter">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/40 flex items-center justify-center pulse-glow">
              <Rocket className="w-10 h-10 text-accent" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold text-balance">
              Star-like Energy for Your{" "}
              <span className="bg-gradient-to-r from-accent to-primary/80 bg-clip-text text-transparent">
                Notifications
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground text-balance">
              Unified multi-channel notification management. Send Email, SMS, and WebPush from one beautiful dashboard.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="glow-button bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              Login
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              variant="outline"
              className="glow-button border-accent/50 hover:border-accent hover:bg-accent/10"
            >
              Sign Up
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-border/50">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">3</p>
              <p className="text-sm text-muted-foreground">Channels</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">Real-time</p>
              <p className="text-sm text-muted-foreground">Tracking</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">100%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
