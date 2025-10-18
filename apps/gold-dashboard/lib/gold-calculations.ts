/**
 * Gold Futures Calculation Utilities
 * Based on COMEX Gold Futures 316 Contracts Financial Workings
 */

/**
 * Calculate the contract period in years from today to December 26, 2031
 * Uses Eastern Time and includes today in the calculation
 */
export function calculateContractPeriod(): number {
  // Get today's date in Eastern Time
  const today = new Date()
  const todayET = new Date(today.toLocaleString('en-US', { timeZone: 'America/New_York' }))

  // Contract expiry date: December 26, 2031
  const expiryDate = new Date('2031-12-26T00:00:00')
  const expiryET = new Date(expiryDate.toLocaleString('en-US', { timeZone: 'America/New_York' }))

  // Normalize Datetime
  //todayET.setHours(0, 0, 0, 0)
  //expiryET.setHours(0, 0, 0, 0)

  // Calculate difference in days (including today, so add 1)
  const diffTime = expiryET.getTime() - todayET.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  // Convert to years
  const years = diffDays / 365.25 // Use 365.25 to account for leap years

  return years
}

export interface GoldParameters {
  spotPriceUSD: number // USD per Oz
  eurUsdRate: number // EUR/USD exchange rate
  contractPriceEUR: number // EUR per Oz (fixed contract price)
  totalContracts: number // Number of contracts
  contractSize: number // Oz per contract (default 100)
  compoundingRate: number // Annual compounding rate (default 0.08 = 8%)
  period: number // Years - dynamically calculated from today to Dec 26, 2031
  marginRequirement: number // Percentage (default 0.08 = 8%)
}

export const DEFAULT_PARAMETERS: GoldParameters = {
  spotPriceUSD: 3924,
  eurUsdRate: 1.2,
  contractPriceEUR: 3945,
  totalContracts: 316,
  contractSize: 100,
  compoundingRate: 0.0816,
  period: calculateContractPeriod(),
  marginRequirement: 0.08,
}

/**
 * Calculate spot price in EUR from USD
 */
export function calculateSpotPriceEUR(spotPriceUSD: number, eurUsdRate: number): number {
  return spotPriceUSD / eurUsdRate
}

/**
 * Calculate spot price in USD from EUR
 */
export function calculateSpotPriceUSD(spotPriceEUR: number, eurUsdRate: number): number {
  return spotPriceEUR * eurUsdRate
}

/**
 * Calculate contract price in USD
 */
export function calculateContractPriceUSD(contractPriceEUR: number, eurUsdRate: number): number {
  return contractPriceEUR * eurUsdRate
}

/**
 * Calculate total ounces
 */
export function calculateTotalOunces(totalContracts: number, contractSize: number = 100): number {
  return totalContracts * contractSize
}

/**
 * Calculate exit price using compound interest formula
 * P_exit = P₀ × (1 + r)^t
 */
export function calculateExitPrice(
  spotPriceEUR: number,
  compoundingRate: number,
  period: number
): number {
  return spotPriceEUR * Math.pow(1 + compoundingRate, period)
}

/**
 * Calculate initial margin per contract
 * Margin = marginRequirement × (contractSize × contractPriceEUR)
 */
export function calculateInitialMarginPerContract(
  contractPriceEUR: number,
  contractSize: number = 100,
  marginRequirement: number = 0.08
): number {
  return marginRequirement * (contractSize * contractPriceEUR)
}

/**
 * Calculate total initial margin for all contracts
 */
export function calculateTotalInitialMargin(
  contractPriceEUR: number,
  totalContracts: number,
  contractSize: number = 100,
  marginRequirement: number = 0.08
): number {
  const marginPerContract = calculateInitialMarginPerContract(
    contractPriceEUR,
    contractSize,
    marginRequirement
  )
  return marginPerContract * totalContracts
}

/**
 * Calculate contract value (initial)
 * Value = contractPriceEUR × totalOunces
 */
export function calculateContractValue(contractPriceEUR: number, totalOunces: number): number {
  return contractPriceEUR * totalOunces
}

/**
 * Calculate exit value
 * Value = exitPrice × totalOunces
 */
export function calculateExitValue(exitPrice: number, totalOunces: number): number {
  return exitPrice * totalOunces
}

/**
 * Calculate total gain
 * Gain = exitValue - contractValue
 */
export function calculateTotalGain(exitValue: number, contractValue: number): number {
  return exitValue - contractValue
}

/**
 * Calculate ROI on margin
 * ROI = totalGain / marginInvested
 */
export function calculateROI(totalGain: number, marginInvested: number): number {
  return totalGain / marginInvested
}

/**
 * Calculate annualized return (CAGR)
 * CAGR = (1 + ROI)^(1/period) - 1
 */
export function calculateCAGR(roi: number, period: number): number {
  return Math.pow(1 + roi, 1 / period) - 1
}

/**
 * Format currency to EUR
 */
export function formatEUR(amount: number, decimals: number = 0): string {
  return `€ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format currency to USD
 */
export function formatUSD(amount: number, decimals: number = 0): string {
  return `$ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate all derived values from a gold price
 */
export function calculateAllMetrics(spotPriceUSD: number, params: Partial<GoldParameters> = {}) {
  const p = { ...DEFAULT_PARAMETERS, ...params }

  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, p.eurUsdRate)
  const contractPriceUSD = calculateContractPriceUSD(p.contractPriceEUR, p.eurUsdRate)
  const totalOunces = calculateTotalOunces(p.totalContracts, p.contractSize)
  const exitPriceEUR = calculateExitPrice(spotPriceEUR, p.compoundingRate, p.period)
  const exitPriceUSD = calculateSpotPriceUSD(exitPriceEUR, p.eurUsdRate)

  const initialMarginPerContract = calculateInitialMarginPerContract(
    p.contractPriceEUR,
    p.contractSize,
    p.marginRequirement
  )
  const totalInitialMargin = calculateTotalInitialMargin(
    p.contractPriceEUR,
    p.totalContracts,
    p.contractSize,
    p.marginRequirement
  )

  const contractValue = calculateContractValue(p.contractPriceEUR, totalOunces)
  const exitValue = calculateExitValue(exitPriceEUR, totalOunces)
  const totalGain = calculateTotalGain(exitValue, contractValue)
  const roi = calculateROI(totalGain, totalInitialMargin)
  const cagr = calculateCAGR(roi, p.period)

  return {
    spotPriceUSD,
    spotPriceEUR,
    eurUsdRate: p.eurUsdRate,
    contractPriceEUR: p.contractPriceEUR,
    contractPriceUSD,
    totalContracts: p.totalContracts,
    contractSize: p.contractSize,
    totalOunces,
    compoundingRate: p.compoundingRate,
    period: p.period,
    marginRequirement: p.marginRequirement,
    exitPriceEUR,
    exitPriceUSD,
    initialMarginPerContract,
    totalInitialMargin,
    contractValue,
    exitValue,
    totalGain,
    roi,
    cagr,
  }
}
