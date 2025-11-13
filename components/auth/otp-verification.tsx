'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { OTPInput } from '@/components/ui/otp-input'
import { Mail, Clock, RefreshCw } from 'lucide-react'
import { resendOTP } from '@/lib/otp-service'

interface OTPVerificationProps {
  email: string
  purpose: 'signup' | 'login' | 'password-reset'
  onVerify: (otp: string) => void
  onResend?: () => void
  loading?: boolean
  error?: string
}

export function OTPVerification({ 
  email, 
  purpose, 
  onVerify, 
  onResend,
  loading = false,
  error 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendOTP(email, purpose)
      setTimeLeft(300)
      setCanResend(false)
      setOtp('')
      if (onResend) onResend()
    } catch (error) {
      console.error('Failed to resend OTP:', error)
    } finally {
      setResending(false)
    }
  }

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp)
    }
  }

  const purposeText = {
    signup: 'complete your registration',
    login: 'sign in to your account',
    'password-reset': 'reset your password'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to{' '}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          Enter the code below to {purposeText[purpose]}
        </p>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <OTPInput
          value={otp}
          onChange={setOtp}
          disabled={loading}
          className="justify-center"
        />
        
        {error && (
          <div className="text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Timer and Resend */}
      <div className="text-center space-y-3">
        {!canResend ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Code expires in {formatTime(timeLeft)}</span>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 hover:text-blue-700"
          >
            {resending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend code
              </>
            )}
          </Button>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={otp.length !== 6 || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </Button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResend}
            disabled={!canResend || resending}
            className="text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
          >
            try again
          </button>
        </p>
      </div>
    </div>
  )
}
