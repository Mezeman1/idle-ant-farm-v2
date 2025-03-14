import Decimal from 'break_infinity.js'

/**
 * Utility functions for working with Decimal from break_infinity.js
 */

/**
 * Creates a new Decimal from a number, string, or existing Decimal
 */
export function createDecimal(value: number | string | Decimal): Decimal {
  return new Decimal(value)
}

/**
 * Formats a Decimal value for display with optional precision
 */
export function formatDecimal(value: Decimal, precision: number = 2): string {
  // Handle null or undefined values
  if (!value) {
    return '0'
  }

  // Try to safely check if the value is valid
  try {
    // This will throw an error if value is NaN
    if (value.eq(value).toString() === 'false') {
      return '0'
    }
  } catch (e) {
    return '0'
  }

  // Handle zero or very small values
  if (value.eq(0) || value.lt(0.01)) {
    if (value.eq(0)) return '0'
    return value.toExponential(precision)
  }

  if (value.lt(1e3)) {
    // For small numbers, show exact value without suffix
    // Remove trailing zeros for cleaner display
    const fixed = value.toFixed(precision)
    if (fixed.includes('.')) {
      return fixed.replace(/\.?0+$/, '')
    }
    return fixed
  } else if (value.lt(1e6)) {
    // For thousands, show with K suffix
    return `${value.div(1e3).toFixed(precision)}K`
  } else if (value.lt(1e9)) {
    // For millions, show with M suffix
    return `${value.div(1e6).toFixed(precision)}M`
  } else if (value.lt(1e12)) {
    // For billions, show with B suffix
    return `${value.div(1e9).toFixed(precision)}B`
  } else if (value.lt(1e15)) {
    // For trillions, show with T suffix
    return `${value.div(1e12).toFixed(precision)}T`
  } else if (value.lt(1e18)) {
    // For quadrillions, show with Qa suffix
    return `${value.div(1e15).toFixed(precision)}Qa`
  } else if (value.lt(1e21)) {
    // For quintillions, show with Qi suffix
    return `${value.div(1e18).toFixed(precision)}Qi`
  } else if (value.lt(1e24)) {
    // For sextillions, show with Sx suffix
    return `${value.div(1e21).toFixed(precision)}Sx`
  } else if (value.lt(1e27)) {
    // For septillions, show with Sp suffix
    return `${value.div(1e24).toFixed(precision)}Sp`
  } else {
    // For very large numbers, use scientific notation
    return value.toExponential(precision)
  }
}

/**
 * Checks if a Decimal value is greater than or equal to a cost
 */
export function canAfford(currency: Decimal, cost: Decimal): boolean {
  return currency.gte(cost)
}

/**
 * Calculates a production rate based on a base value and multipliers
 */
export function calculateProduction(baseValue: Decimal, multipliers: Decimal[] = []): Decimal {
  let result = baseValue

  // Apply all multipliers
  for (const multiplier of multipliers) {
    result = result.mul(multiplier)
  }

  return result
}

/**
 * Calculates the cost of the next level using a base cost and growth rate
 */
export function calculateCost(baseCost: Decimal, growthRate: Decimal, currentLevel: Decimal): Decimal {
  return baseCost.mul(growthRate.pow(currentLevel))
}

/**
 * Calculates the cost of a Mk1 generator based on the formula:
 * 3*(1.065+0.004x)^(x*(1+max(x-999,0)/1000))
 */
export function calculateMk1Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal(3)
  const growthBase = createDecimal(1.065).add(createDecimal(0.004).mul(x))

  const exponentBase = x
  const exponentBonus = x.sub(999).max(0).div(1000)
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk2 generator based on the formula:
 * 2e3*(2.9+0.3x)^(x*(1+max(x-199,0)/500))
 */
export function calculateMk2Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal(2e3)
  const growthBase = createDecimal(2.9).add(createDecimal(0.3).mul(x))

  const exponentBase = x
  const exponentBonus = x.sub(199).max(0).div(500)
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk3 generator based on the formula:
 * 1e8*(20+10x)^(x*(1+max(x-99,0)/(1000/3)))
 */
export function calculateMk3Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal(1e8)
  const growthBase = createDecimal(20).add(createDecimal(10).mul(x))

  const exponentBase = x
  const exponentBonus = x.sub(99).max(0).div(createDecimal(1000).div(3))
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk4 generator based on the formula:
 * 4e18*(50+30x)^(x*(1+max(x-74,0)/200))
 */
export function calculateMk4Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal(4e18)
  const growthBase = createDecimal(50).add(createDecimal(30).mul(x))

  const exponentBase = x
  const exponentBonus = x.sub(74).max(0).div(200)
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk5 generator based on the formula:
 * 5e46*(220+80x)^(x(1+max(x-49,0)/200))
 */
export function calculateMk5Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal('5e46')
  const growthBase = createDecimal(220).add(createDecimal(80).mul(x))

  const exponentBase = x
  const exponentBonus = x.sub(49).max(0).div(200)
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk6 generator based on the formula:
 * 6e200*(6e5+6e5*x)^(x*(1+x/(500/3)))
 */
export function calculateMk6Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal('6e200')
  const growthBase = createDecimal('6e5').add(createDecimal('6e5').mul(x))

  const exponentBase = x
  const exponentBonus = x.div(createDecimal(500).div(3))
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates the cost of a Mk7 generator based on the formula:
 * 7e500*(7e7+7e7*x)^(x*(1+x/50))
 */
export function calculateMk7Cost(count: Decimal): Decimal {
  const x = count
  const base = createDecimal('7e500')
  const growthBase = createDecimal('7e7').add(createDecimal('7e7').mul(x))

  const exponentBase = x
  const exponentBonus = x.div(50)
  const exponent = exponentBase.mul(createDecimal(1).add(exponentBonus))

  return base.mul(growthBase.pow(exponent))
}

/**
 * Calculates generator cost based on tier and count
 */
export function calculateGeneratorCost(tier: number, count: Decimal): Decimal {
  switch (tier) {
    case 1:
      return calculateMk1Cost(count)
    case 2:
      return calculateMk2Cost(count)
    case 3:
      return calculateMk3Cost(count)
    case 4:
      return calculateMk4Cost(count)
    case 5:
      return calculateMk5Cost(count)
    case 6:
      return calculateMk6Cost(count)
    case 7:
      return calculateMk7Cost(count)
    default:
      // Fallback to original formula if tier is not recognized
      return createDecimal(10).mul(createDecimal(1.1).pow(count))
  }
}

/**
 * Converts a Decimal to a plain number (for cases where a number is required)
 * Warning: This may lose precision for very large numbers
 */
export function toNumber(value: Decimal): number {
  return value.toNumber()
}

/**
 * Formats a percentage value with appropriate suffixes for large numbers
 */
export function formatPercentage(value: Decimal | number): string {
  // Convert to Decimal if it's a number
  const decimalValue = typeof value === 'number' ? new Decimal(value) : value

  if (decimalValue.lt(1000)) {
    // For small percentages, show with fixed precision
    return `${decimalValue.toFixed(2)}%`
  } else if (decimalValue.lt(1e6)) {
    // For thousands, show with K suffix
    return `${decimalValue.div(1e3).toFixed(2)}K%`
  } else if (decimalValue.lt(1e9)) {
    // For millions, show with M suffix
    return `${decimalValue.div(1e6).toFixed(2)}M%`
  } else if (decimalValue.lt(1e12)) {
    // For billions, show with B suffix
    return `${decimalValue.div(1e9).toFixed(2)}B%`
  } else if (decimalValue.lt(1e15)) {
    // For trillions, show with T suffix
    return `${decimalValue.div(1e12).toFixed(2)}T%`
  } else {
    // For very large numbers, use scientific notation
    return `${decimalValue.toExponential(2)}%`
  }
}
