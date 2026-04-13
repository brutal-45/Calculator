import { create } from 'zustand'

export type CalculatorMode = 'basic' | 'scientific'
export type AngleUnit = 'deg' | 'rad'

export interface HistoryItem {
  id?: string
  expression: string
  result: string
  mode: CalculatorMode
  createdAt?: string
}

interface CalculatorState {
  // Display
  display: string
  expression: string
  previousResult: string | null

  // State
  mode: CalculatorMode
  angleUnit: AngleUnit
  hasResult: boolean
  parenthesesCount: number

  // History
  history: HistoryItem[]

  // Actions
  appendDigit: (digit: string) => void
  appendOperator: (op: string) => void
  appendDecimal: () => void
  appendParenthesis: (paren: string) => void
  clear: () => void
  clearEntry: () => void
  backspace: () => void
  calculate: () => void
  toggleSign: () => void
  percentage: () => void
  scientificFunction: (fn: string) => void
  insertConstant: (constant: string) => void
  setMode: (mode: CalculatorMode) => void
  toggleAngleUnit: () => void
  applyHistoryItem: (item: HistoryItem) => void
  clearHistory: () => void
  setHistory: (items: HistoryItem[]) => void
  addHistoryItem: (item: HistoryItem) => void
}

function factorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  if (!Number.isInteger(n)) {
    return gamma(n + 1)
  }
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }
  z -= 1
  const g = 7
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  let x = c[0]
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i)
  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

function toAngle(value: number, unit: AngleUnit): number {
  return unit === 'deg' ? degToRad(value) : value
}

function fromAngle(value: number, unit: AngleUnit): number {
  return unit === 'deg' ? radToDeg(value) : value
}

function formatResult(num: number): string {
  if (isNaN(num)) return 'Error'
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity'
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toString()
  }
  const str = num.toPrecision(12)
  return parseFloat(str).toString()
}

function evaluateExpression(expr: string, angleUnit: AngleUnit): string {
  try {
    // Replace display symbols with math operators
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e(?![xp])/g, `(${Math.E})`)
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/sin⁻¹\(/g, `Math.asin(`)
      .replace(/cos⁻¹\(/g, `Math.acos(`)
      .replace(/tan⁻¹\(/g, `Math.atan(`)
      .replace(/sin\(/g, `Math.sin(`)
      .replace(/cos\(/g, `Math.cos(`)
      .replace(/tan\(/g, `Math.tan(`)
      .replace(/log\(/g, `Math.log10(`)
      .replace(/ln\(/g, `Math.log(`)
      .replace(/abs\(/g, `Math.abs(`)

    // Handle angle-based trig functions
    if (angleUnit === 'deg') {
      sanitized = sanitized
        .replace(/Math\.sin\(/g, 'Math.sin((')
        .replace(/Math\.cos\(/g, 'Math.cos((')
        .replace(/Math\.tan\(/g, 'Math.tan((')
        .replace(/Math\.asin\(/g, '(Math.asin(')
        .replace(/Math\.acos\(/g, '(Math.acos(')
        .replace(/Math\.atan\(/g, '(Math.atan(')
      // This is complex - use a simpler approach
    }

    // Handle implicit multiplication: 2π, 3(, )(
    sanitized = sanitized.replace(/(\d)(\()/g, '$1*$2')
    sanitized = sanitized.replace(/(\))(\()/g, '$1*$2')
    sanitized = sanitized.replace(/(\))([\d.])/g, '$1*$2')

    // Handle factorial
    sanitized = sanitized.replace(/([\d.]+)!/g, (_, n) => `(${factorial(parseFloat(n))})`)

    // Handle power x² x³ xⁿ
    sanitized = sanitized.replace(/([\d.]+)²/g, 'Math.pow($1,2)')
    sanitized = sanitized.replace(/([\d.]+)³/g, 'Math.pow($1,3)')
    sanitized = sanitized.replace(/\^/g, '**')

    // Handle 1/x notation
    sanitized = sanitized.replace(/⁻¹(?!\()/g, ')') // This should have been handled

    // For degree mode, wrap trig args with degToRad
    if (angleUnit === 'deg') {
      sanitized = sanitized
        .replace(/Math\.sin\(([^)]+)\)/g, (_, arg) => `Math.sin(((${arg})*Math.PI/180))`)
        .replace(/Math\.cos\(([^)]+)\)/g, (_, arg) => `Math.cos(((${arg})*Math.PI/180))`)
        .replace(/Math\.tan\(([^)]+)\)/g, (_, arg) => `Math.tan(((${arg})*Math.PI/180))`)
      sanitized = sanitized
        .replace(/Math\.asin\(([^)]+)\)/g, (_, arg) => `(Math.asin(${arg})*180/Math.PI)`)
        .replace(/Math\.acos\(([^)]+)\)/g, (_, arg) => `(Math.acos(${arg})*180/Math.PI)`)
        .replace(/Math\.atan\(([^)]+)\)/g, (_, arg) => `(Math.atan(${arg})*180/Math.PI)`)
    }

    // Validate expression
    if (/[^0-9+\-*/.()Math sincotaglqrpbwPE, ]/.test(sanitized)) {
      return 'Error'
    }

    // Use Function constructor for safe evaluation
    const fn = new Function(`"use strict"; return (${sanitized})`)
    const result = fn()

    if (typeof result !== 'number') return 'Error'
    return formatResult(result)
  } catch {
    return 'Error'
  }
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  display: '0',
  expression: '',
  previousResult: null,
  mode: 'basic',
  angleUnit: 'deg',
  hasResult: false,
  parenthesesCount: 0,
  history: [],

  appendDigit: (digit: string) => {
    const { display, hasResult } = get()
    if (hasResult) {
      set({ display: digit, expression: '', hasResult: false, parenthesesCount: 0 })
      return
    }
    if (display === '0' && digit !== '0') {
      set({ display: digit })
    } else if (display === '0' && digit === '0') {
      return
    } else if (display.length < 16) {
      set({ display: display + digit })
    }
  },

  appendOperator: (op: string) => {
    const { display, expression, hasResult, previousResult, parenthesesCount } = get()
    if (hasResult && previousResult !== null) {
      set({
        expression: previousResult + ' ' + op + ' ',
        display: '0',
        hasResult: false,
      })
      return
    }
    // Close open parentheses before operator
    let expr = expression + display
    for (let i = 0; i < parenthesesCount; i++) expr += ')'
    set({
      expression: expr + ' ' + op + ' ',
      display: '0',
      hasResult: false,
      parenthesesCount: 0,
    })
  },

  appendDecimal: () => {
    const { display, hasResult } = get()
    if (hasResult) {
      set({ display: '0.', expression: '', hasResult: false })
      return
    }
    if (!display.includes('.')) {
      set({ display: display + '.' })
    }
  },

  appendParenthesis: (paren: string) => {
    const { display, expression, parenthesesCount, hasResult } = get()
    if (hasResult && paren === '(') {
      set({ expression: '', display: '0', hasResult: false, parenthesesCount: 1 })
      return
    }
    if (hasResult && paren === ')') {
      return
    }
    if (paren === '(') {
      if (display !== '0' || expression.length > 0) {
        // Add current display to expression and open paren
        set({
          expression: expression + display + ' × (',
          display: '0',
          parenthesesCount: parenthesesCount + 1,
        })
      } else {
        set({
          parenthesesCount: parenthesesCount + 1,
        })
      }
    } else if (paren === ')' && parenthesesCount > 0) {
      const currentExpr = expression + display
      set({
        expression: currentExpr + ')',
        display: '0',
        parenthesesCount: parenthesesCount - 1,
      })
    }
  },

  clear: () => {
    set({
      display: '0',
      expression: '',
      hasResult: false,
      parenthesesCount: 0,
    })
  },

  clearEntry: () => {
    set({ display: '0' })
  },

  backspace: () => {
    const { display, hasResult } = get()
    if (hasResult) return
    if (display.length > 1) {
      set({ display: display.slice(0, -1) })
    } else {
      set({ display: '0' })
    }
  },

  calculate: () => {
    const { display, expression, angleUnit, mode, parenthesesCount } = get()
    let fullExpr = expression + display
    // Auto-close parentheses
    for (let i = 0; i < parenthesesCount; i++) fullExpr += ')'

    if (!fullExpr || fullExpr.trim() === '') return

    const result = evaluateExpression(fullExpr, angleUnit)
    if (result !== 'Error') {
      const historyItem: HistoryItem = {
        expression: fullExpr,
        result,
        mode,
      }
      const newHistory = [historyItem, ...get().history].slice(0, 50)
      set({
        previousResult: result,
        display: result,
        expression: '',
        hasResult: true,
        history: newHistory,
        parenthesesCount: 0,
      })
      // Save to database
      fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyItem),
      }).catch(() => {})
    } else {
      set({ display: 'Error', hasResult: true })
    }
  },

  toggleSign: () => {
    const { display, hasResult } = get()
    if (hasResult || display === '0' || display === 'Error') return
    if (display.startsWith('-')) {
      set({ display: display.slice(1) })
    } else {
      set({ display: '-' + display })
    }
  },

  percentage: () => {
    const { display, hasResult } = get()
    if (hasResult) return
    const value = parseFloat(display)
    if (isNaN(value)) return
    set({ display: formatResult(value / 100) })
  },

  scientificFunction: (fn: string) => {
    const { display, hasResult, angleUnit } = get()
    let value = parseFloat(display)
    if (isNaN(value) && !display.includes('Error')) return

    let result: number
    let newExpr: string

    switch (fn) {
      case 'sin':
        result = Math.sin(toAngle(value, angleUnit))
        newExpr = `sin(${display})`
        break
      case 'cos':
        result = Math.cos(toAngle(value, angleUnit))
        newExpr = `cos(${display})`
        break
      case 'tan':
        result = Math.tan(toAngle(value, angleUnit))
        newExpr = `tan(${display})`
        break
      case 'asin':
        result = fromAngle(Math.asin(value), angleUnit)
        newExpr = `sin⁻¹(${display})`
        break
      case 'acos':
        result = fromAngle(Math.acos(value), angleUnit)
        newExpr = `cos⁻¹(${display})`
        break
      case 'atan':
        result = fromAngle(Math.atan(value), angleUnit)
        newExpr = `tan⁻¹(${display})`
        break
      case 'log':
        result = Math.log10(value)
        newExpr = `log(${display})`
        break
      case 'ln':
        result = Math.log(value)
        newExpr = `ln(${display})`
        break
      case 'sqrt':
        result = Math.sqrt(value)
        newExpr = `√(${display})`
        break
      case 'cbrt':
        result = Math.cbrt(value)
        newExpr = `∛(${display})`
        break
      case 'square':
        result = value * value
        newExpr = `${display}²`
        break
      case 'cube':
        result = value * value * value
        newExpr = `${display}³`
        break
      case 'reciprocal':
        result = 1 / value
        newExpr = `1/(${display})`
        break
      case 'factorial':
        result = factorial(value)
        newExpr = `${display}!`
        break
      case 'abs':
        result = Math.abs(value)
        newExpr = `|${display}|`
        break
      case 'exp':
        result = Math.exp(value)
        newExpr = `e^(${display})`
        break
      case 'pow10':
        result = Math.pow(10, value)
        newExpr = `10^(${display})`
        break
      case 'pow2':
        result = Math.pow(2, value)
        newExpr = `2^(${display})`
        break
      default:
        return
    }

    const formattedResult = formatResult(result)
    if (hasResult) {
      set({
        previousResult: formattedResult,
        display: formattedResult,
        expression: '',
        hasResult: true,
      })
    } else {
      set({
        expression: newExpr + ' = ',
        previousResult: formattedResult,
        display: formattedResult,
        hasResult: true,
      })
    }
  },

  insertConstant: (constant: string) => {
    const { display, hasResult } = get()
    if (hasResult) {
      const value = constant === 'π' ? Math.PI.toString() : Math.E.toString()
      set({ display: value, expression: '', hasResult: false, parenthesesCount: 0 })
      return
    }
    if (display === '0') {
      const value = constant === 'π' ? Math.PI.toString() : Math.E.toString()
      set({ display: value })
    } else {
      // Multiply current display by constant
      const value = constant === 'π' ? 'π' : 'e'
      set({ expression: display + ' × ', display: value, hasResult: false })
    }
  },

  setMode: (mode: CalculatorMode) => {
    set({ mode })
  },

  toggleAngleUnit: () => {
    set((state) => ({ angleUnit: state.angleUnit === 'deg' ? 'rad' : 'deg' }))
  },

  applyHistoryItem: (item: HistoryItem) => {
    set({
      display: item.result,
      expression: '',
      previousResult: item.result,
      hasResult: true,
      parenthesesCount: 0,
    })
  },

  clearHistory: () => {
    set({ history: [] })
    fetch('/api/calculations', { method: 'DELETE' }).catch(() => {})
  },

  setHistory: (items: HistoryItem[]) => {
    set({ history: items })
  },

  addHistoryItem: (item: HistoryItem) => {
    set((state) => ({
      history: [item, ...state.history].slice(0, 50),
    }))
  },
}))
