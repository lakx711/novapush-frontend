import { api } from './api'

// Ensure this file is treated as a module
export {}

export interface OTPResponse {
  success: boolean
  message: string
  verified?: boolean
  errors?: any[]
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  message: string
  errors?: any[]
}

// Send OTP to email
export async function sendOTP(email: string, purpose: 'signup' | 'login' | 'password-reset' = 'login'): Promise<OTPResponse> {
  try {
    const response = await api.post('/otp/send', { email, purpose })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send verification code'
    }
  }
}

// Verify OTP code
export async function verifyOTP(email: string, otp: string, purpose: 'signup' | 'login' | 'password-reset' = 'login'): Promise<OTPResponse> {
  try {
    const response = await api.post('/otp/verify', { email, otp, purpose })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid verification code'
    }
  }
}

// Resend OTP
export async function resendOTP(email: string, purpose: 'signup' | 'login' | 'password-reset' = 'login'): Promise<OTPResponse> {
  try {
    const response = await api.post('/otp/resend', { email, purpose })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to resend verification code'
    }
  }
}

// Signup with OTP verification
export async function signupWithOTP(email: string, password: string, name: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/signup-with-otp', { email, password, name, otp })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed'
    }
  }
}

// Login with OTP verification
export async function loginWithOTP(email: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/login-with-otp', { email, otp })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    }
  }
}
