'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    Cal?: {
      ns?: {
        'gratis-ai-konsultasjon'?: (...args: unknown[]) => void
      }
      (...args: unknown[]): void
    }
  }
}

/**
 * Hook to open the Cal.com booking popup for "Gratis AI-konsultasjon".
 * Falls back to direct link if embed script hasn't loaded.
 */
export function useCalBooking() {
  const openBooking = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.Cal?.ns?.['gratis-ai-konsultasjon']
    ) {
      window.Cal.ns['gratis-ai-konsultasjon']('modal', {
        calLink: 'arxon/gratis-ai-konsultasjon',
        config: { layout: 'month_view' },
      })
    } else {
      // Fallback: open Cal.com in new tab
      window.open('https://cal.eu/arxon/gratis-ai-konsultasjon', '_blank')
    }
  }, [])

  return openBooking
}
