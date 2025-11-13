"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { login, setAuthToken } from "@/lib/auth-utils"
import { useAuth } from "@/hooks/use-auth"

export default function Login() {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.")
        return
      }

      // Store token and redirect
      if (result.token) {
        setAuthToken(result.token)
        checkAuth()
        // Small delay to ensure state updates before navigation
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <Card className="glow-card w-full max-w-md p-8 space-y-6 page-enter">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your NovaPush account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                Email
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input/50 border-input/50 focus-visible:ring-accent"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/50 border-input/50 focus-visible:ring-accent"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="glow-button w-full bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* OTP Login Option */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Secure Login</span>
            </div>
          </div>

          <Button
            onClick={() => router.push("/login/otp")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              🔐 <span>Login with Email OTP</span>
            </div>
          </Button>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium">Passwordless • Secure • Fast</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>
            <p>
              Prefer OTP signup?{" "}
              <Link href="/signup/otp" className="text-accent hover:underline">
                Sign up with OTP
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
