/**
 * Gold Product Price Calculations
 * Based on cg-financials calculators
 */

export const CONSTANTS = {
  GRAMS_PER_OZ: 31.1034768,
  TRANSACTION_BROKERAGE: 0.001, // 0.1%
}

/**
 * Calculate GOLD SWIM unit price from live gold prices
 * Formula: ((spotAsk / eurExchangeRate / 31.1034768) + 15) / (1 - 0.001)
 *
 * @param spotAsk - Live LBMA spot ask price in USD per oz
 * @param eurExchangeRate - EUR/USD exchange rate
 * @returns Price per unit in EUR
 */
export function calculateGoldSwimUnitPrice(spotAsk: number, eurExchangeRate: number): number {
  const spotPriceEUR = spotAsk / eurExchangeRate
  const spotPricePerGramEUR = spotPriceEUR / CONSTANTS.GRAMS_PER_OZ
  const pricePerUnit = (spotPricePerGramEUR + 15) / (1 - CONSTANTS.TRANSACTION_BROKERAGE)
  return Math.round(pricePerUnit * 100) / 100 // Round to 2 decimals
}

/**
 * Calculate SIRI Z31 unit price from live gold prices
 * Formula from cg-financials header: ((cashMarginPer100OzUSD / 100) / (1 / 12)) / (31.1034768 * 100)
 *
 * @param spotAsk - Live LBMA spot ask price in USD per oz
 * @param eurExchangeRate - EUR/USD exchange rate
 * @returns Subscription price per unit in USD (then convert to EUR)
 */
export function calculateSiriZ31UnitPrice(spotAsk: number, eurExchangeRate: number): number {
  // Cash Margin Investment: ((Spot Ask/31.1034768)+18.1)*31.1034768*100/3 for 100 Oz
  const cashMarginPer100OzUSD = ((spotAsk / CONSTANTS.GRAMS_PER_OZ) + 18.1) * CONSTANTS.GRAMS_PER_OZ * 100 / 3

  // Subscription price formula from dashboard-header.tsx lines 110-113
  // ((cashMarginPer100OzUSD / 100) / (1 / 12)) / (31.1034768 * 100)
  // Which simplifies to: (cashMarginPer100OzUSD * 12) / (100 * 31.1034768 * 100)
  const subscriptionPriceUSD = ((cashMarginPer100OzUSD / 100) / (1 / 12)) / (CONSTANTS.GRAMS_PER_OZ * 100)

  // Convert to EUR
  const subscriptionPriceEUR = subscriptionPriceUSD / eurExchangeRate

  return Math.round(subscriptionPriceEUR * 100) / 100 // Round to 2 decimals
}

/**
 * Calculate number of GOLD SWIM units for a given investment amount
 *
 * @param investmentAmount - Amount in EUR to invest
 * @param unitPrice - Price per unit in EUR
 * @returns Number of units
 */
export function calculateGoldSwimUnits(investmentAmount: number, unitPrice: number): number {
  return investmentAmount / unitPrice
}

/**
 * Calculate number of grams from GOLD SWIM units
 *
 * @param units - Number of units
 * @returns Number of grams
 */
export function calculateGoldSwimGrams(units: number): number {
  return units / 100
}

/**
 * Calculate total cost for SIRI Z31 units
 *
 * @param units - Number of units (1/100th gram each)
 * @param unitPrice - Price per unit in EUR
 * @returns Total cost in EUR
 */
export function calculateSiriZ31Cost(units: number, unitPrice: number): number {
  return units * unitPrice
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, currency: 'EUR' | 'USD' = 'EUR', decimals: number = 2): string {
  const symbol = currency === 'EUR' ? '€' : '$'
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

/**
 * Format gram value
 */
export function formatGrams(value: number, decimals: number = 2): string {
  return `${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}g`
}
