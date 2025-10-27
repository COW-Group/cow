/**
 * Gold SWIM Dynamic Calculation Library
 * Based on "Gold Retailing - Accumulated Value Projection.xlsx"
 */

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

// Constants from Excel (non-editable)
export const PARAMETERS = {
  markup: 0.13013013013013014, // 13.013% (deprecated - now calculated as 1000g * €13 / (1 - transaction brokerage))
  transactionBrokerage: 0.001, // 0.1% - Default (can be overridden by model)
  sourcingCostIncrease: 0.01977, // 1.977% per quarter
  marginPerGram: 1.00, // €1.00/gram - Default (can be overridden by model)
  operatingExpPercent: 0.25, // 25% of margin - Default (can be overridden by model)
  storageCostPercent: 0.0005, // 0.05% of gold value - Default (can be overridden by model)
  insuranceCostPercent: 0.00025, // 0.025% of gold value - Default (can be overridden by model)
  effectiveTaxRate: 0.21, // 21% - Default (can be overridden by model)
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
  initialInvestment: number,
  modelParams?: FinancialModelParams
): QuarterlyData {
  // Use model parameters if provided, otherwise use defaults
  const params = modelParams ? { ...PARAMETERS, ...modelParams } : PARAMETERS
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
    const pricePerUnit = ((spotPricePerOz / 31.1034768) + 15) / (1 - params.transactionBrokerage)
    const numberOfUnits = (initialInvestment / pricePerUnit) * 100

    // Number of Grams = (Number of Units) / 100
    const numberOfGrams = numberOfUnits / 100

    // Markup = (Number of Grams) × 13 / (1 - Transaction Brokerage)
    markup = (numberOfGrams * 13) / (1 - params.transactionBrokerage)
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
  const transactionBrokerage = balanceForCalculations * params.transactionBrokerage

  // Investment available for sourcing gold
  const investmentForSourcing = balanceForCalculations - transactionBrokerage

  // Revenue Grams = Investment for Sourcing / Sourcing Cost Beginning
  revenueGrams = investmentForSourcing / sourcingCostBeginning

  // Quarterly margin: Revenue Grams × Days × margin per gram
  const margin = revenueGrams * days * params.marginPerGram

  // Operating expenses: % of margin
  const operatingExp = margin * params.operatingExpPercent

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

  // Storage costs: % of gross value
  const storageCost = grossValueEnd * params.storageCostPercent

  // Insurance costs: % of gross value
  const insuranceCost = grossValueEnd * params.insuranceCostPercent

  // Total costs
  const totalCosts = storageCost + insuranceCost

  // Realizable gain: Quarterly Gains - Total Costs
  const realizableGainEnd = quarterlyGains - totalCosts

  // Tax amount: % of realizable gain
  const taxAmount = realizableGainEnd * params.effectiveTaxRate

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
