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
  if (value.lt(1e6)) {
    // For small numbers, show exact value
    return value.toFixed(precision)
  } else if (value.lt(1e9)) {
    // For millions, show with M suffix
    return `${value.div(1e6).toFixed(precision)}M`
  } else if (value.lt(1e12)) {
    // For billions, show with B suffix
    return `${value.div(1e9).toFixed(precision)}B`
  } else if (value.lt(1e15)) {
    // For trillions, show with T suffix
    return `${value.div(1e12).toFixed(precision)}T`
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
 * Converts a Decimal to a plain number (for cases where a number is required)
 * Warning: This may lose precision for very large numbers
 */
export function toNumber(value: Decimal): number {
  return value.toNumber()
}
