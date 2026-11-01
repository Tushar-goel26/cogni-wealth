import { describe, it, expect } from 'vitest'
import { formatINR, formatCompactINR, formatPercent } from './format'

describe('formatINR', () => {
  it('formats whole numbers according to Indian numbering standard without decimals', () => {
    const formatted = formatINR(100000)
    // Replace non-breaking spaces if any
    const clean = formatted.replace(/\u00A0/g, ' ')
    expect(clean).toContain('1,00,000')
    expect(clean).toContain('₹')
  })

  it('formats negative amounts properly', () => {
    const formatted = formatINR(-2500)
    const clean = formatted.replace(/\u00A0/g, ' ')
    expect(clean).toContain('-₹2,500')
  })

  it('supports showSign option for positive values', () => {
    const formatted = formatINR(5000, { showSign: true })
    const clean = formatted.replace(/\u00A0/g, ' ')
    expect(clean).toContain('+₹5,000')
  })

  it('handles 0 and NaN safely', () => {
    expect(formatINR(0)).toContain('0')
    expect(formatINR(NaN)).toBe('₹0')
  })
})

describe('formatCompactINR', () => {
  it('formats lakhs correctly', () => {
    expect(formatCompactINR(150000)).toBe('₹1.5L')
    expect(formatCompactINR(200000)).toBe('₹2L')
  })

  it('formats crores correctly', () => {
    expect(formatCompactINR(15000000)).toBe('₹1.5Cr')
    expect(formatCompactINR(10000000)).toBe('₹1Cr')
  })

  it('formats thousands correctly', () => {
    expect(formatCompactINR(25000)).toBe('₹25k')
  })
})

describe('formatPercent', () => {
  it('formats percent values with sign option', () => {
    expect(formatPercent(12.5, { showSign: true })).toBe('+12.5%')
    expect(formatPercent(-4.2)).toBe('-4.2%')
  })
})
