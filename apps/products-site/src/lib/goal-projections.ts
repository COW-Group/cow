/**
 * Goal-Based Investment Projection Utilities
 * Based on Gold STO CAGR of 8.16% from gold-calculations.ts
 */

export const GOLD_CAGR = 0.0816 // 8.16% annual return from gold STO model

export interface ProjectionPoint {
  month: number
  year: number
  value: number
  contributions: number
  gains: number
}

export interface GoalProjection {
  requiredLumpSum: number
  monthlyContribution: number
  totalContributions: number
  targetAmount: number
  totalGains: number
  lumpSumGains: number
  yearsToGoal: number
  recommendedLumpSum: number // 10% of required as starter
  recommendedMonthly: number // 50% of calculated monthly
}

/**
 * Calculate required lump sum investment to reach target
 * Formula: initialInvestment = targetAmount / (1 + CAGR)^years
 */
export function calculateRequiredLumpSum(
  targetAmount: number,
  years: number,
  cagr: number = GOLD_CAGR
): number {
  return targetAmount / Math.pow(1 + cagr, years)
}

/**
 * Calculate required monthly contribution to reach target (starting from $0)
 * Uses future value of annuity formula:
 * FV = PMT × (((1 + r)^n - 1) / r)
 * Therefore: PMT = FV / (((1 + r)^n - 1) / r)
 */
export function calculateMonthlyContribution(
  targetAmount: number,
  years: number,
  cagr: number = GOLD_CAGR
): number {
  const monthlyRate = Math.pow(1 + cagr, 1 / 12) - 1
  const months = years * 12

  // Handle edge case where months is 0
  if (months === 0) return targetAmount

  const denominator = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  return targetAmount / denominator
}

/**
 * Calculate total contributions for monthly plan
 */
export function calculateTotalMonthlyContributions(
  monthlyAmount: number,
  years: number
): number {
  return monthlyAmount * years * 12
}

/**
 * Generate projection data points for charting
 * Returns array of {month, year, value, contributions, gains}
 */
export function generateLumpSumProjection(
  initialAmount: number,
  years: number,
  cagr: number = GOLD_CAGR
): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  const months = Math.ceil(years * 12)
  const monthlyRate = Math.pow(1 + cagr, 1 / 12) - 1

  for (let month = 0; month <= months; month++) {
    const value = initialAmount * Math.pow(1 + monthlyRate, month)
    const gains = value - initialAmount

    points.push({
      month,
      year: month / 12,
      value,
      contributions: initialAmount,
      gains,
    })
  }

  return points
}

/**
 * Generate projection data for monthly contributions
 */
export function generateMonthlyProjection(
  monthlyContribution: number,
  years: number,
  cagr: number = GOLD_CAGR
): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  const months = Math.ceil(years * 12)
  const monthlyRate = Math.pow(1 + cagr, 1 / 12) - 1

  let totalContributions = 0
  let value = 0

  for (let month = 0; month <= months; month++) {
    if (month > 0) {
      // Add new contribution and apply growth to existing value
      value = (value + monthlyContribution) * (1 + monthlyRate)
      totalContributions += monthlyContribution
    }

    const gains = value - totalContributions

    points.push({
      month,
      year: month / 12,
      value,
      contributions: totalContributions,
      gains,
    })
  }

  return points
}

/**
 * Calculate complete goal projection with both options
 */
export function calculateGoalProjection(
  targetAmount: number,
  years: number,
  cagr: number = GOLD_CAGR
): GoalProjection {
  const requiredLumpSum = calculateRequiredLumpSum(targetAmount, years, cagr)
  const monthlyContribution = calculateMonthlyContribution(targetAmount, years, cagr)
  const totalContributions = calculateTotalMonthlyContributions(monthlyContribution, years)
  const totalGains = targetAmount - totalContributions
  const lumpSumGains = targetAmount - requiredLumpSum

  // Recommend 10% of required lump sum as starter (minimum $100)
  const recommendedLumpSum = Math.max(100, Math.round(requiredLumpSum * 0.1))

  // Recommend 50% of calculated monthly (minimum $50)
  const recommendedMonthly = Math.max(50, Math.round(monthlyContribution * 0.5))

  return {
    requiredLumpSum,
    monthlyContribution,
    totalContributions,
    targetAmount,
    totalGains,
    lumpSumGains,
    yearsToGoal: years,
    recommendedLumpSum,
    recommendedMonthly,
  }
}

/**
 * Calculate years between two dates
 */
export function calculateYearsToGoal(targetDate: Date): number {
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const years = diffDays / 365.25 // Account for leap years
  return Math.max(0.5, years) // Minimum 6 months
}

/**
 * Format currency with proper symbol and locale
 */
export function formatCurrency(amount: number, currency: string = 'USD', decimals: number = 2): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AED: 'د.إ',
    SGD: 'S$',
    CAD: 'C$',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || currency
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${symbol}${formatted}`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AED: 'د.إ',
    SGD: 'S$',
    CAD: 'C$',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || currency

  if (amount >= 1_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000).toFixed(1)}B`
  } else if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
  } else if (amount >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}K`
  }
  return `${symbol}${amount.toFixed(0)}`
}

/**
 * Validate goal inputs
 */
export function validateGoalInputs(
  goalName: string,
  targetAmount: number,
  targetDate: Date | null
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!goalName || goalName.trim().length < 3) {
    errors.push('Goal name must be at least 3 characters')
  }

  if (!targetAmount || targetAmount <= 0) {
    errors.push('Target amount must be greater than 0')
  }

  if (!targetDate) {
    errors.push('Target date is required')
  } else {
    const today = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

    if (targetDate < sixMonthsFromNow) {
      errors.push('Target date must be at least 6 months in the future')
    }

    const thirtyYearsFromNow = new Date()
    thirtyYearsFromNow.setFullYear(thirtyYearsFromNow.getFullYear() + 30)

    if (targetDate > thirtyYearsFromNow) {
      errors.push('Target date cannot be more than 30 years in the future')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
