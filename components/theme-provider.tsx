"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Simple wrapper around next-themes ThemeProvider so we can pass defaults
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
