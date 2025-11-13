"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { OTPVerification } from "@/components/auth/otp-verification"
import { ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { sendOTP, loginWithOTP } from "@/lib/otp-service"
import { setAuthToken } from "@/lib/auth-utils"

export default function LoginWithOTP() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await sendOTP(email, 'login')
      
      if (!result.success) {
        setError(result.message)
        return
      }

      setStep('otp')
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async (otp: string) => {
    setLoading(true)
    setError("")

    try {
      const result = await loginWithOTP(email, otp)
      
      if (!result.success) {
        setError(result.message)
        return
      }

      if (result.token) {
        setAuthToken(result.token)
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setError("")
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep('email')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* OTP Verification */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <Card className="glow-card w-full max-w-md p-8 page-enter">
            <OTPVerification
              email={email}
              purpose="login"
              onVerify={handleOTPVerify}
              onResend={handleResend}
              loading={loading}
              error={error}
            />
          </Card>
        </main>
      </div>
    )
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
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Login with OTP</h1>
            <p className="text-muted-foreground">Secure login with email verification</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                Email Address
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
              {loading ? "Sending Code..." : "Send Login Code"}
            </Button>
          </form>

          {/* Features */}
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔐 Secure OTP Login
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• No password required</li>
                <li>• 6-digit verification code</li>
                <li>• Expires in 5 minutes</li>
                <li>• Enhanced security</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              We'll send a 6-digit code to your email for secure login
            </p>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup/otp" className="text-accent hover:underline">
                Sign up with OTP
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Prefer password login?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Traditional Login
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
