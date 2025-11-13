"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { OTPVerification } from "@/components/auth/otp-verification"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react"
import Link from "next/link"
import { sendOTP, signupWithOTP } from "@/lib/otp-service"
import { setAuthToken } from "@/lib/auth-utils"

export default function SignupWithOTP() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    setPasswordStrength(strength)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 2) {
      setError("Password is too weak")
      return
    }

    setLoading(true)

    try {
      const result = await sendOTP(email, 'signup')
      
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
      const result = await signupWithOTP(email, password, name, otp)
      
      if (!result.success) {
        setError(result.message)
        return
      }

      if (result.token) {
        setAuthToken(result.token)
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
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
              purpose="signup"
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
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Join NovaPush with email verification</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input/50 border-input/50 focus-visible:ring-accent"
              />
            </div>

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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    checkPasswordStrength(e.target.value)
                  }}
                  required
                  className="bg-input/50 border-input/50 focus-visible:ring-accent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded bg-input"
                    style={{
                      backgroundColor:
                        i < passwordStrength ? (i < 2 ? "#ef4444" : i < 3 ? "#eab308" : "#22c55e") : undefined,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {passwordStrength === 0 && "Very weak"}
                {passwordStrength === 1 && "Weak"}
                {passwordStrength === 2 && "Fair"}
                {passwordStrength === 3 && "Good"}
                {passwordStrength === 4 && "Strong"}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              We'll send a 6-digit verification code to your email
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login/otp" className="text-accent hover:underline">
                Login with OTP
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Prefer password login?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                Traditional Signup
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
