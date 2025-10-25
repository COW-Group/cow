/**
 * Gold SWIM Dynamic Calculation Library
 * Based on "Gold Retailing - Accumulated Value Projection.xlsx"
 */

// Constants from Excel
export const PARAMETERS = {
  markup: 0.13013013013013014, // 13.013% (deprecated - now calculated as 1000g * €13 / (1 - transaction brokerage))
  transactionBrokerage: 0.001, // 0.1%
  sourcingCostIncrease: 0.01977, // 1.977% per quarter
  marginPerGram: 1.00, // €1.00/gram
  operatingExpPercent: 0.25, // 25% of margin
  storageCostPercent: 0.0005, // 0.05% of gold value
  insuranceCostPercent: 0.00025, // 0.025% of gold value
  effectiveTaxRate: 0.21, // 21% (Federal 16% + State 4.8% + 0.20% Incidentals)
  marketPremium: 15, // Spot + 15 EUR
  daysPerQuarter: 65, // Standard 65 days (last quarter: 53)
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
 * Calculate sourcing cost per gram based on spot price
 * Formula: (1 oz spot price / 31.1034768) + 2
 */
export function calculateInitialSourcingCost(spotPricePerOz: number): number {
  // Initial sourcing cost = (Spot Ask Price / 31.1034768) + 2
  // Example: when spot = 3434.67, sourcing cost = (3434.67 / 31.1034768) + 2 = 112.427
  const gramsPerOz = 31.1034768
  return (spotPricePerOz / gramsPerOz) + 2
}

/**
 * Calculate market price (Expected Market Price) based on sourcing cost
 * Formula: (Spot per gram) + Market Premium
 * Since Sourcing Cost = (Spot/31.1034768) + 2,
 * Spot per gram = Sourcing Cost - 2
 * Market Price = (Sourcing Cost - 2) + 15
 */
export function calculateMarketPrice(sourcingCost: number): number {
  return (sourcingCost - 2) + PARAMETERS.marketPremium
}

/**
 * Calculate quarterly data for a single quarter
 */
export function calculateQuarter(
  quarter: number,
  prevQuarterData: QuarterlyData | null,
  spotPricePerOz: number,
  initialInvestment: number
): QuarterlyData {
  // Q25 has 53 days, all other quarters have 65 days
  const days = quarter === 25 ? 53 : PARAMETERS.daysPerQuarter

  // Q1: Start with initial investment
  // Q2+: Start with previous quarter's ending balance + investible gain
  let investmentBalanceBeginning: number
  let markup: number
  let revenueGrams: number
  let sourcingCostBeginning: number

  if (quarter === 1) {
    investmentBalanceBeginning = initialInvestment
    sourcingCostBeginning = calculateInitialSourcingCost(spotPricePerOz)

    // Number of Units = (Initial Investment Amount) / (((Live Gold Spot Ask Price) / 31.1034768 + 15) / (1 - Transaction Brokerage)) × 100
    const pricePerUnit = ((spotPricePerOz / 31.1034768) + 15) / (1 - PARAMETERS.transactionBrokerage)
    const numberOfUnits = (initialInvestment / pricePerUnit) * 100

    // Number of Grams = (Number of Units) / 100
    const numberOfGrams = numberOfUnits / 100

    // Markup = (Number of Grams) × 13 / (1 - Transaction Brokerage)
    markup = (numberOfGrams * 13) / (1 - PARAMETERS.transactionBrokerage)
  } else if (prevQuarterData) {
    // Q2+: Investment equals previous quarter's Qtr End Total Value
    investmentBalanceBeginning = prevQuarterData.qtrEndTotalValue
    markup = 0 // Markup only applies to Q1
    sourcingCostBeginning = prevQuarterData.sourcingCostEnd
  } else {
    throw new Error('Previous quarter data required for quarters > 1')
  }

  // Investment Balance Net of Initial Markup (only for Q1, otherwise 0)
  const investmentBalanceNetInitialMarkup = quarter === 1 ? investmentBalanceBeginning - markup : 0

  // For Q1: Use Investment Balance Net of Initial Markup for calculations
  // For Q2+: Use Investment Balance Beginning for calculations
  const balanceForCalculations = quarter === 1 ? investmentBalanceNetInitialMarkup : investmentBalanceBeginning

  // Investment balance net of markup (this is the old field, keeping for compatibility)
  const investmentBalanceNetMarkup = investmentBalanceBeginning - markup

  // Transaction brokerage (0.1% of balance for calculations)
  const transactionBrokerage = balanceForCalculations * PARAMETERS.transactionBrokerage

  // Investment available for sourcing gold
  const investmentForSourcing = balanceForCalculations - transactionBrokerage

  // Revenue Grams = Investment for Sourcing / Sourcing Cost Beginning
  revenueGrams = investmentForSourcing / sourcingCostBeginning

  // Quarterly margin: Revenue Grams × Days × €1.00/gram
  const margin = revenueGrams * days * PARAMETERS.marginPerGram

  // Operating expenses: 25% of margin
  const operatingExp = margin * PARAMETERS.operatingExpPercent

  // Quarterly gains: Margin - Operating Expenses
  const quarterlyGains = margin - operatingExp

  // Quarter-end sourcing cost: Beginning cost × 1.01977
  const sourcingCostEnd = sourcingCostBeginning * (1 + PARAMETERS.sourcingCostIncrease)

  // New grams purchasable at end of quarter: Quarterly Gains / Quarter End Cost per gram
  const newGramsPurchasable = quarterlyGains / sourcingCostEnd

  // Total grams at end of quarter = Revenue Grams + New Grams
  const totalGramsEnd = revenueGrams + newGramsPurchasable

  // Quarter-end market price
  // Q1: Use formula ((Spot Price / oz) / 31.1034768) + 15
  // Q2+: Previous quarter's market price × 1.01977
  const marketPriceEnd = quarter === 1
    ? calculateMarketPrice(sourcingCostBeginning)
    : (prevQuarterData!.marketPriceEnd * (1 + PARAMETERS.sourcingCostIncrease))

  // Gross value at quarter end
  const grossValueEnd = totalGramsEnd * marketPriceEnd

  // Storage costs: 0.05% of gross value
  const storageCost = grossValueEnd * PARAMETERS.storageCostPercent

  // Insurance costs: 0.025% of gross value
  const insuranceCost = grossValueEnd * PARAMETERS.insuranceCostPercent

  // Total costs
  const totalCosts = storageCost + insuranceCost

  // Realizable gain: Quarterly Gains - Total Costs
  const realizableGainEnd = quarterlyGains - totalCosts

  // Tax amount: 21% of realizable gain
  const taxAmount = realizableGainEnd * PARAMETERS.effectiveTaxRate

  // Investible gain net of taxes
  const investibleGainNetTax = realizableGainEnd - taxAmount

  // Qtr End Total Grams (after tax) = Revenue Grams + Net Grams
  // Net Grams = Net Gain / Qtr End Cost/g
  const qtrEndTotalGrams = revenueGrams + (investibleGainNetTax / sourcingCostEnd)

  // Qtr End Total Value = Qtr End Value (Lower) × Qtr End Total Grams
  const qtrEndTotalValue = Math.min(marketPriceEnd, sourcingCostEnd) * qtrEndTotalGrams

  // Cumulative ROI = Qtr End Total Value - Initial Investment Amount (from Q1)
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
  numberOfQuarters: number = 25
): QuarterlyData[] {
  const quarters: QuarterlyData[] = []

  for (let q = 1; q <= numberOfQuarters; q++) {
    const prevQuarter = q > 1 ? quarters[q - 2] : null
    const quarterData = calculateQuarter(q, prevQuarter, spotPricePerOz, initialInvestment)
    quarters.push(quarterData)
  }

  return quarters
}
