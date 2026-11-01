import React from 'react'

/**
 * Formats a number as Indian Rupee (INR) currency.
 * As per PROJECT.md: Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
 */
export function formatINR(
  amount: number,
  options: {
    showSign?: boolean
    maximumFractionDigits?: number
  } = {}
): string {
  const { showSign = false, maximumFractionDigits = 0 } = options

  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0'
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  })

  const formatted = formatter.format(Math.abs(amount))

  if (amount < 0) {
    return `-${formatted}`
  }

  if (showSign && amount > 0) {
    return `+${formatted}`
  }

  return formatted
}

/**
 * Formats INR in compact notation (e.g., ₹1.5L, ₹2.4Cr, ₹25K).
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0'
  }

  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = abs / 10000000
    return `${sign}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`
  }

  if (abs >= 100000) {
    // 1 Lakh = 100,000
    const l = abs / 100000
    return `${sign}₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`
  }

  if (abs >= 1000) {
    // 1 Thousand = 1,000
    const k = abs / 1000
    return `${sign}₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`
  }

  return formatINR(amount)
}

/**
 * Formats percentage values with optional +/- sign.
 */
export function formatPercent(
  value: number,
  options: { showSign?: boolean; decimals?: number } = {}
): string {
  const { showSign = false, decimals = 1 } = options
  const formatted = `${Math.abs(value).toFixed(decimals)}%`

  if (value < 0) {
    return `-${formatted}`
  }
  if (showSign && value > 0) {
    return `+${formatted}`
  }
  return formatted
}

/**
 * Persistent "Demo data / Simulated" banner component
 * Re-exported here for convenience and backwards-compatibility.
 */
export { DemoBanner } from '@/components/ui/DemoBanner'
