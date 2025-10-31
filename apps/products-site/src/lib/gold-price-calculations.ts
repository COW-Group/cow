/**
 * Gold Product Price Calculations
 * Based on cg-financials calculators - includes quarterly projection model
 */

export const CONSTANTS = {
  GRAMS_PER_OZ: 31.1034768,
  TRANSACTION_BROKERAGE: 0.001, // 0.1%
  SOURCING_COST_INCREASE: 0.01977, // 1.977% per quarter
  MARKET_PREMIUM: 15, // Spot + 15 EUR
  DAYS_PER_QUARTER: 65, // Standard 65 days (last quarter: 53)
}

// Financial Model Parameters Interface
export interface FinancialModelParams {
  marginPerGram: number
  operatingExpPercent: number
  transactionBrokerage: number
  storageCostPercent: number
  insuranceCostPercent: number
  effectiveTaxRate: number
}

// Financial Model Presets
export const FINANCIAL_MODELS = {
  conservative: {
    name: "Conservative",
    description: "Lower margins, higher costs & taxes",
    params: {
      marginPerGram: 0.60,
      operatingExpPercent: 0.50,
      transactionBrokerage: 0.0025,
      storageCostPercent: 0.0015,
      insuranceCostPercent: 0.00075,
      effectiveTaxRate: 0.30,
    }
  },
  moderate: {
    name: "Moderate",
    description: "Balanced assumptions (default)",
    params: {
      marginPerGram: 1.00,
      operatingExpPercent: 0.25,
      transactionBrokerage: 0.001,
      storageCostPercent: 0.0005,
      insuranceCostPercent: 0.00025,
      effectiveTaxRate: 0.21,
    }
  },
  optimistic: {
    name: "Optimistic",
    description: "Higher margins, lower costs & taxes",
    params: {
      marginPerGram: 1.20,
      operatingExpPercent: 0.20,
      transactionBrokerage: 0.001,
      storageCostPercent: 0.00075,
      insuranceCostPercent: 0.00025,
      effectiveTaxRate: 0.1667,
    }
  }
}

export interface QuarterlyData {
  quarter: number
  days: number
  investmentBalanceBeginning: number
  markup: number
  investmentBalanceNetInitialMarkup: number
  investmentBalanceNetMarkup: number
  transactionBrokerage: number
  investmentForSourcing: number
  sourcingCostBeginning: number
  revenueGrams: number
  margin: number
  operatingExp: number
  quarterlyGains: number
  sourcingCostEnd: number
  newGramsPurchasable: number
  totalGramsEnd: number
  marketPriceEnd: number
  grossValueEnd: number
  storageCost: number
  insuranceCost: number
  totalCosts: number
  realizableGainEnd: number
  taxAmount: number
  investibleGainNetTax: number
  qtrEndTotalValue: number
  cumulativeROI: number
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

/**
 * Calculate sourcing cost per gram based on spot price
 * Formula: (1 oz spot price / 31.1034768) + 2
 */
export function calculateInitialSourcingCost(spotPricePerOz: number): number {
  return (spotPricePerOz / CONSTANTS.GRAMS_PER_OZ) + 2
}

/**
 * Calculate market price (Expected Market Price) based on sourcing cost
 * Formula: (Spot per gram) + Market Premium
 */
export function calculateMarketPrice(sourcingCost: number): number {
  return (sourcingCost - 2) + CONSTANTS.MARKET_PREMIUM
}

/**
 * Calculate quarterly data for a single quarter
 */
export function calculateQuarter(
  quarter: number,
  prevQuarterData: QuarterlyData | null,
  spotPricePerOz: number,
  initialInvestment: number,
  modelParams?: FinancialModelParams
): QuarterlyData {
  const params = modelParams || FINANCIAL_MODELS.moderate.params
  const days = quarter === 25 ? 53 : CONSTANTS.DAYS_PER_QUARTER

  let investmentBalanceBeginning: number
  let markup: number
  let sourcingCostBeginning: number

  if (quarter === 1) {
    investmentBalanceBeginning = initialInvestment
    sourcingCostBeginning = calculateInitialSourcingCost(spotPricePerOz)
    const pricePerUnit = ((spotPricePerOz / CONSTANTS.GRAMS_PER_OZ) + 15) / (1 - params.transactionBrokerage)
    const numberOfUnits = (initialInvestment / pricePerUnit) * 100
    const numberOfGrams = numberOfUnits / 100
    markup = (numberOfGrams * 13) / (1 - params.transactionBrokerage)
  } else if (prevQuarterData) {
    investmentBalanceBeginning = prevQuarterData.qtrEndTotalValue
    markup = 0
    sourcingCostBeginning = prevQuarterData.sourcingCostEnd
  } else {
    throw new Error('Previous quarter data required for quarters > 1')
  }

  const investmentBalanceNetInitialMarkup = quarter === 1 ? investmentBalanceBeginning - markup : 0
  const balanceForCalculations = quarter === 1 ? investmentBalanceNetInitialMarkup : investmentBalanceBeginning
  const investmentBalanceNetMarkup = investmentBalanceBeginning - markup
  const transactionBrokerage = balanceForCalculations * params.transactionBrokerage
  const investmentForSourcing = balanceForCalculations - transactionBrokerage
  const revenueGrams = investmentForSourcing / sourcingCostBeginning
  const margin = revenueGrams * days * params.marginPerGram
  const operatingExp = margin * params.operatingExpPercent
  const quarterlyGains = margin - operatingExp
  const sourcingCostEnd = sourcingCostBeginning * (1 + CONSTANTS.SOURCING_COST_INCREASE)
  const newGramsPurchasable = quarterlyGains / sourcingCostEnd
  const totalGramsEnd = revenueGrams + newGramsPurchasable
  const marketPriceEnd = quarter === 1
    ? calculateMarketPrice(sourcingCostBeginning)
    : (prevQuarterData!.marketPriceEnd * (1 + CONSTANTS.SOURCING_COST_INCREASE))
  const grossValueEnd = totalGramsEnd * marketPriceEnd
  const storageCost = grossValueEnd * params.storageCostPercent
  const insuranceCost = grossValueEnd * params.insuranceCostPercent
  const totalCosts = storageCost + insuranceCost
  const realizableGainEnd = quarterlyGains - totalCosts
  const taxAmount = realizableGainEnd * params.effectiveTaxRate
  const investibleGainNetTax = realizableGainEnd - taxAmount
  const qtrEndTotalGrams = revenueGrams + (investibleGainNetTax / sourcingCostEnd)
  const qtrEndTotalValue = Math.min(marketPriceEnd, sourcingCostEnd) * qtrEndTotalGrams
  const cumulativeROI = qtrEndTotalValue - initialInvestment

  return {
    quarter,
    days,
    investmentBalanceBeginning,
    markup,
    investmentBalanceNetInitialMarkup,
    investmentBalanceNetMarkup,
    transactionBrokerage,
    investmentForSourcing,
    sourcingCostBeginning,
    revenueGrams,
    margin,
    operatingExp,
    quarterlyGains,
    sourcingCostEnd,
    newGramsPurchasable,
    totalGramsEnd,
    marketPriceEnd,
    grossValueEnd,
    storageCost,
    insuranceCost,
    totalCosts,
    realizableGainEnd,
    taxAmount,
    investibleGainNetTax,
    qtrEndTotalValue,
    cumulativeROI,
  }
}

/**
 * Calculate all quarters (default: 25 quarters)
 */
export function calculateAllQuarters(
  spotPricePerOz: number,
  initialInvestment: number,
  numberOfQuarters: number = 25,
  modelParams?: FinancialModelParams
): QuarterlyData[] {
  const quarters: QuarterlyData[] = []

  for (let q = 1; q <= numberOfQuarters; q++) {
    const prevQuarter = q > 1 ? quarters[q - 2] : null
    const quarterData = calculateQuarter(q, prevQuarter, spotPricePerOz, initialInvestment, modelParams)
    quarters.push(quarterData)
  }

  return quarters
}

/**
 * =============================================================================
 * SIRI Z31 FUTURES CALCULATIONS
 * =============================================================================
 */

/**
 * SIRI Z31 Contract Specifications
 */
export const SIRI_Z31_CONSTANTS = {
  CONTRACT_SIZE_OZ: 100, // 100 oz per contract
  INITIAL_MARGIN_PERCENT: 0.08, // 8% initial margin
  MAINTENANCE_MARGIN_PERCENT: 0.06, // 6% maintenance margin
  POSITION_LIMIT: 10, // Max 10 contracts
  TARGET_RETURN_MIN: 0.15, // 15% minimum target
  TARGET_RETURN_MAX: 0.25, // 25% maximum target
}

/**
 * SIRI Z31 Position Parameters
 */
export interface SiriZ31Params {
  entryPrice: number // Entry price per oz in USD
  numberOfContracts: number // Number of contracts
  investmentAmount: number // Total investment in USD
  targetExitPrice: number // Target exit price per oz in USD
}

/**
 * SIRI Z31 Position Analysis
 */
export interface SiriZ31Analysis {
  // Position Info
  entryPrice: number
  numberOfContracts: number
  totalOunces: number
  positionValue: number

  // Margin Requirements
  initialMarginRequired: number
  maintenanceMarginRequired: number
  initialMarginPercent: number
  maintenanceMarginPercent: number

  // Exit Analysis
  targetExitPrice: number
  priceChange: number
  priceChangePercent: number
  profitLoss: number
  profitLossPercent: number
  returnOnInvestment: number

  // Position Limits
  maxContracts: number
  isWithinLimits: boolean
  marginUtilization: number
}

/**
 * Calculate SIRI Z31 margin requirements
 */
export function calculateSiriZ31Margins(
  entryPrice: number,
  numberOfContracts: number
): { initialMargin: number; maintenanceMargin: number; positionValue: number } {
  const totalOunces = numberOfContracts * SIRI_Z31_CONSTANTS.CONTRACT_SIZE_OZ
  const positionValue = totalOunces * entryPrice

  const initialMargin = positionValue * SIRI_Z31_CONSTANTS.INITIAL_MARGIN_PERCENT
  const maintenanceMargin = positionValue * SIRI_Z31_CONSTANTS.MAINTENANCE_MARGIN_PERCENT

  return { initialMargin, maintenanceMargin, positionValue }
}

/**
 * Calculate SIRI Z31 exit analysis
 */
export function calculateSiriZ31ExitAnalysis(
  entryPrice: number,
  exitPrice: number,
  numberOfContracts: number,
  investmentAmount: number
): {
  priceChange: number
  priceChangePercent: number
  profitLoss: number
  profitLossPercent: number
  returnOnInvestment: number
} {
  const totalOunces = numberOfContracts * SIRI_Z31_CONSTANTS.CONTRACT_SIZE_OZ
  const priceChange = exitPrice - entryPrice
  const priceChangePercent = (priceChange / entryPrice) * 100

  const profitLoss = priceChange * totalOunces
  const profitLossPercent = (profitLoss / investmentAmount) * 100
  const returnOnInvestment = profitLossPercent

  return {
    priceChange,
    priceChangePercent,
    profitLoss,
    profitLossPercent,
    returnOnInvestment,
  }
}

/**
 * Calculate comprehensive SIRI Z31 position analysis
 */
export function calculateSiriZ31Position(params: SiriZ31Params): SiriZ31Analysis {
  const { entryPrice, numberOfContracts, investmentAmount, targetExitPrice } = params

  // Position Info
  const totalOunces = numberOfContracts * SIRI_Z31_CONSTANTS.CONTRACT_SIZE_OZ

  // Margin Requirements
  const margins = calculateSiriZ31Margins(entryPrice, numberOfContracts)

  // Exit Analysis
  const exitAnalysis = calculateSiriZ31ExitAnalysis(
    entryPrice,
    targetExitPrice,
    numberOfContracts,
    investmentAmount
  )

  // Position Limits
  const marginUtilization = (margins.initialMargin / investmentAmount) * 100
  const isWithinLimits = numberOfContracts <= SIRI_Z31_CONSTANTS.POSITION_LIMIT

  return {
    // Position Info
    entryPrice,
    numberOfContracts,
    totalOunces,
    positionValue: margins.positionValue,

    // Margin Requirements
    initialMarginRequired: margins.initialMargin,
    maintenanceMarginRequired: margins.maintenanceMargin,
    initialMarginPercent: SIRI_Z31_CONSTANTS.INITIAL_MARGIN_PERCENT * 100,
    maintenanceMarginPercent: SIRI_Z31_CONSTANTS.MAINTENANCE_MARGIN_PERCENT * 100,

    // Exit Analysis
    targetExitPrice,
    priceChange: exitAnalysis.priceChange,
    priceChangePercent: exitAnalysis.priceChangePercent,
    profitLoss: exitAnalysis.profitLoss,
    profitLossPercent: exitAnalysis.profitLossPercent,
    returnOnInvestment: exitAnalysis.returnOnInvestment,

    // Position Limits
    maxContracts: SIRI_Z31_CONSTANTS.POSITION_LIMIT,
    isWithinLimits,
    marginUtilization,
  }
}

/**
 * Generate exit price scenarios for SIRI Z31
 */
export interface ExitScenario {
  scenario: string
  exitPrice: number
  priceChange: number
  priceChangePercent: number
  profitLoss: number
  profitLossPercent: number
  returnOnInvestment: number
}

export function generateSiriZ31ExitScenarios(
  entryPrice: number,
  numberOfContracts: number,
  investmentAmount: number
): ExitScenario[] {
  const scenarios = [
    { label: "Bearish (-10%)", multiplier: 0.90 },
    { label: "Moderate Decline (-5%)", multiplier: 0.95 },
    { label: "Break Even (0%)", multiplier: 1.00 },
    { label: "Moderate Gain (+5%)", multiplier: 1.05 },
    { label: "Strong Gain (+10%)", multiplier: 1.10 },
    { label: "Target Return (+15%)", multiplier: 1.15 },
    { label: "Maximum Target (+25%)", multiplier: 1.25 },
  ]

  return scenarios.map(s => {
    const exitPrice = entryPrice * s.multiplier
    const analysis = calculateSiriZ31ExitAnalysis(
      entryPrice,
      exitPrice,
      numberOfContracts,
      investmentAmount
    )

    return {
      scenario: s.label,
      exitPrice,
      priceChange: analysis.priceChange,
      priceChangePercent: analysis.priceChangePercent,
      profitLoss: analysis.profitLoss,
      profitLossPercent: analysis.profitLossPercent,
      returnOnInvestment: analysis.returnOnInvestment,
    }
  })
}
