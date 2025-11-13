'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false,
  className 
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus()
    }
  }, [activeIndex])

  const handleChange = (index: number, inputValue: string) => {
    const newValue = value.split('')
    
    // Only allow single digit
    if (inputValue.length > 1) {
      inputValue = inputValue.slice(-1)
    }
    
    // Only allow numbers
    if (!/^\d*$/.test(inputValue)) {
      return
    }

    newValue[index] = inputValue
    const newOTP = newValue.join('')
    
    onChange(newOTP)

    // Move to next input if digit entered
    if (inputValue && index < length - 1) {
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        setActiveIndex(index - 1)
      } else {
        // Clear current input
        const newValue = value.split('')
        newValue[index] = ''
        onChange(newValue.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)
    
    // Focus on the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1)
    setActiveIndex(nextIndex)
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-all duration-200",
            value[index] ? "border-blue-500 bg-blue-50" : "border-gray-300",
            disabled && "opacity-50 cursor-not-allowed",
            "hover:border-blue-400"
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
