"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem storageKey="theme-preference" {...props}>
      {children}
    </NextThemesProvider>
  )
}
