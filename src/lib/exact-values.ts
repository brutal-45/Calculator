// Exact value lookup system for common mathematical results
// Maps computed decimal values to their exact mathematical forms

interface ExactMatch {
  exact: string       // e.g. "1/2", "√2/2", "√3", "2√2"
  decimal: number     // e.g. 0.5
}

// Helper: check if two numbers are "close enough" 
function approx(a: number, b: number, eps = 1e-9): boolean {
  if (!isFinite(a) || !isFinite(b)) return a === b
  return Math.abs(a - b) < eps
}

// Simple fraction finder for common small fractions
function findFraction(val: number): string | null {
  for (let denom = 2; denom <= 12; denom++) {
    for (let numer = 1; numer < denom; numer++) {
      if (approx(val, numer / denom)) {
        // Reduce fraction
        const g = gcd(numer, denom)
        const rN = numer / g
        const rD = denom / g
        return rD === 1 ? `${rN}` : `${rN}/${rD}`
      }
    }
  }
  return null
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// Known exact trig values (angle in degrees → { sin, cos, tan })
const exactTrigValues: Record<number, { sin: string | null; cos: string | null; tan: string | null }> = {
  0:   { sin: '0',     cos: '1',     tan: '0' },
  15:  { sin: '(√6−√2)/4', cos: '(√6+√2)/4', tan: '2−√3' },
  30:  { sin: '1/2',    cos: '√3/2',  tan: '√3/3' },
  45:  { sin: '√2/2',  cos: '√2/2',  tan: '1' },
  60:  { sin: '√3/2',  cos: '1/2',   tan: '√3' },
  75:  { sin: '(√6+√2)/4', cos: '(√6−√2)/4', tan: '2+√3' },
  90:  { sin: '1',      cos: '0',     tan: '∞' },
  120: { sin: '√3/2',  cos: '-1/2',  tan: '-√3' },
  135: { sin: '√2/2',  cos: '-√2/2', tan: '-1' },
  150: { sin: '1/2',   cos: '-√3/2', tan: '-√3/3' },
  180: { sin: '0',     cos: '-1',    tan: '0' },
  210: { sin: '-1/2',  cos: '-√3/2', tan: '√3/3' },
  225: { sin: '-√2/2', cos: '-√2/2', tan: '1' },
  240: { sin: '-√3/2', cos: '-1/2',  tan: '√3' },
  270: { sin: '-1',    cos: '0',     tan: '∞' },
  300: { sin: '-√3/2', cos: '1/2',   tan: '-√3' },
  315: { sin: '-√2/2', cos: '√2/2',  tan: '-1' },
  330: { sin: '-1/2',  cos: '√3/2',  tan: '-√3/3' },
  360: { sin: '0',     cos: '1',     tan: '0' },
}

// Known perfect squares
const perfectSquares: Record<number, number> = {}
for (let i = 0; i <= 20; i++) perfectSquares[i * i] = i

// Known exact sqrt values
const exactSqrts: Record<number, string> = {
  2: '√2', 3: '√3', 5: '√5', 6: '√6', 7: '√7', 8: '2√2',
  10: '√10', 11: '√11', 12: '2√3', 13: '√13', 14: '√14', 15: '√15',
  17: '√17', 18: '3√2', 19: '√19', 20: '2√5',
}

// Known constants
const constantValues: Record<number, string> = {
  [Math.PI]: 'π',
  [Math.E]: 'e',
  [Math.SQRT2]: '√2',
  [Math.sqrt(3)]: '√3',
  [Math.sqrt(5)]: '√5',
  [(1 + Math.sqrt(5)) / 2]: 'φ',
}

/**
 * Try to find an exact form for a computed decimal result.
 * Returns the exact string form, or null if no match found.
 * @param angleUnit - 'deg' or 'rad'. Used to verify trig lookups match actual decimal.
 */
export function findExactForm(decimalResult: number, expression?: string, angleUnit: string = 'deg'): string | null {
  if (!isFinite(decimalResult) || isNaN(decimalResult)) return null

  // 1. Check if it's an integer
  if (Number.isInteger(decimalResult) && Math.abs(decimalResult) < 1e12) {
    return null // integers are already exact
  }

  // 2. Check if expression matches a known trig function
  if (expression) {
    const trigMatch = expression.match(/^(sin|cos|tan)\((\d+(?:\.\d+)?)\)\s*=/)
    if (trigMatch) {
      const fn = trigMatch[1]
      const angle = parseFloat(trigMatch[2])
      const angleKey = Math.round(angle)
      if (Math.abs(angle - angleKey) < 1e-9) {
        const entry = exactTrigValues[angleKey]
        if (entry) {
          const exact = entry[fn as 'sin' | 'cos' | 'tan']
          if (exact) {
            // Verify the decimal result actually matches the trig function at this angle
            if (angleUnit === 'deg') {
              const rad = angleKey * Math.PI / 180
              const expected = fn === 'sin' ? Math.sin(rad) : fn === 'cos' ? Math.cos(rad) : Math.tan(rad)
              if (approx(decimalResult, expected) || (fn === 'tan' && !isFinite(expected) && !isFinite(decimalResult))) {
                return exact
              }
            }
            // In RAD mode, only match if the angle happens to produce the same decimal
            // (e.g. sin(π/6) ≈ 0.5, but the expression would show sin(0.524), not sin(30))
          }
        }
      }
    }

    // Check for inverse trig results
    const invMatch = expression.match(/^(sin⁻¹|cos⁻¹|tan⁻¹)\(([^)]+)\)\s*=/)
    if (invMatch) {
      const fn = invMatch[1]
      // Inverse trig of known values often give clean angles
      const roundDeg = Math.round(decimalResult)
      if (Math.abs(decimalResult - roundDeg) < 1e-9 && roundDeg >= 0 && roundDeg <= 360) {
        const entry = exactTrigValues[roundDeg]
        if (entry) {
          // Only return exact angle in DEG mode (results are in degrees)
          if (angleUnit === 'deg') {
            if (fn === 'sin⁻¹' && entry.sin && entry.sin !== '0' && entry.sin !== '1') return `${roundDeg}°`
            if (fn === 'cos⁻¹' && entry.cos && entry.cos !== '0' && entry.cos !== '1') return `${roundDeg}°`
            if (fn === 'tan⁻¹' && entry.tan && entry.tan !== '0' && entry.tan !== '1') return `${roundDeg}°`
          }
        }
      }
    }

    // Check for sqrt of perfect square
    const sqrtMatch = expression.match(/^√\((\d+(?:\.\d+)?)\)\s*=/)
    if (sqrtMatch) {
      const n = parseFloat(sqrtMatch[1])
      if (Number.isInteger(n) && perfectSquares[n] !== undefined) {
        return `${perfectSquares[n]}`
      }
    }

    // Check for 1/x where result is a simple fraction
    const recipMatch = expression.match(/^1\/\(([^)]+)\)\s*=/)
    if (recipMatch) {
      const frac = findFraction(decimalResult)
      if (frac) return frac
    }

    // Check for square
    const sqMatch = expression.match(/^(\d+(?:\.\d+)?)²\s*=/)
    if (sqMatch) {
      return null // squares are usually already exact integers
    }

    // Check for factorial
    const factMatch = expression.match(/^(\d+(?:\.\d+)?)!\s*=/)
    if (factMatch) {
      return null // factorials are usually already exact integers
    }
  }

  // 3. Check simple fractions
  const absVal = Math.abs(decimalResult)
  const frac = findFraction(absVal)
  if (frac) {
    return decimalResult < 0 ? `-${frac}` : frac
  }

  // 4. Check known constants
  for (const [val, name] of Object.entries(constantValues)) {
    if (approx(decimalResult, parseFloat(val))) return name
    if (approx(decimalResult, -parseFloat(val))) return `-${name}`
  }

  // 5. Check if result is a simple multiple of √2 or √3 etc.
  for (const [squared, symbol] of Object.entries(exactSqrts)) {
    const sqrtVal = Math.sqrt(parseFloat(squared))
    // Check if result = n * sqrt(k)
    for (let n = 2; n <= 10; n++) {
      if (approx(absVal, n * sqrtVal)) {
        const prefix = n === 1 ? '' : `${n}`
        return decimalResult < 0 ? `-${prefix}${symbol}` : `${prefix}${symbol}`
      }
    }
    // Check if result = sqrt(k) / n
    for (let n = 2; n <= 6; n++) {
      if (approx(absVal, sqrtVal / n)) {
        const simplified = simplifyRadical(parseFloat(squared), n)
        return decimalResult < 0 ? `-${simplified}` : simplified
      }
    }
  }

  return null
}

/**
 * Simplify sqrt(k)/n notation
 */
function simplifyRadical(k: number, denom: number): string {
  // sqrt(k)/n — check if k has a square factor
  let remaining = k
  let outside = 1
  for (let i = 2; i * i <= remaining; i++) {
    while (remaining % (i * i) === 0) {
      remaining /= (i * i)
      outside *= i
    }
  }
  const g = gcd(outside, denom)
  const o = outside / g
  const d = denom / g
  if (remaining === 1) return d === 1 ? `${o}` : `${o}/${d}`
  const inside = remaining
  const sym = inside === k ? `√${k}` : `${o}√${inside}`
  return d === 1 ? sym : `${sym}/${d}`
}

/**
 * Format a result showing both exact and decimal forms
 */
export function formatResultWithExact(decimalResult: number, expression?: string): { display: string; exact: string | null } {
  const decimalStr = formatDecimal(decimalResult)
  const exact = findExactForm(decimalResult, expression)
  return { display: decimalStr, exact }
}

function formatDecimal(num: number): string {
  if (isNaN(num)) return 'Error'
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity'
  if (Number.isInteger(num) && Math.abs(num) < 1e15) return num.toString()
  const str = num.toPrecision(12)
  return parseFloat(str).toString()
}
