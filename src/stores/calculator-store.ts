import { create } from 'zustand'
import { findExactForm, formatDecimal } from '@/lib/exact-values'

export type CalculatorMode = 'basic' | 'scientific'
export type AngleUnit = 'deg' | 'rad'

export interface HistoryItem {
  id?: string
  expression: string
  result: string
  exactForm: string | null
  mode: CalculatorMode
  createdAt?: string
}

interface CalculatorState {
  display: string
  exactDisplay: string | null   // e.g. "1/2" shown alongside decimal
  expression: string
  previousResult: string | null
  mode: CalculatorMode
  angleUnit: AngleUnit
  hasResult: boolean
  parenthesesCount: number
  history: HistoryItem[]
  showAC: boolean

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
}

function factorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  if (!Number.isInteger(n)) return gamma(n + 1)
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function gamma(z: number): number {
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  z -= 1
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  let x = c[0]
  for (let i = 1; i < 8; i++) x += c[i] / (z + i)
  const t = z + 7.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

function toAngle(v: number, u: AngleUnit) { return u === 'deg' ? (v * Math.PI) / 180 : v }
function fromAngle(v: number, u: AngleUnit) { return u === 'deg' ? (v * 180) / Math.PI : v }

function formatResult(num: number): string {
  if (isNaN(num)) return 'Error'
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity'
  if (Number.isInteger(num) && Math.abs(num) < 1e15) return num.toString()
  return parseFloat(num.toPrecision(12)).toString()
}

function evaluateExpression(expr: string, angleUnit: AngleUnit): string {
  try {
    let s = expr
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e(?![xp])/g, `(${Math.E})`)
      .replace(/√\(/g, 'Math.sqrt(').replace(/∛\(/g, 'Math.cbrt(')
      .replace(/sin⁻¹\(/g, 'Math.asin(').replace(/cos⁻¹\(/g, 'Math.acos(').replace(/tan⁻¹\(/g, 'Math.atan(')
      .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/abs\(/g, 'Math.abs(')

    s = s.replace(/(\d)(\()/g, '$1*$2').replace(/(\))(\()/g, '$1*$2').replace(/(\))([\d.])/g, '$1*$2')
    s = s.replace(/([\d.]+)!/g, (_, n) => `(${factorial(parseFloat(n))})`)
    s = s.replace(/([\d.]+)²/g, 'Math.pow($1,2)').replace(/([\d.]+)³/g, 'Math.pow($1,3)').replace(/\^/g, '**')
    s = s.replace(/⁻¹(?!\()/g, ')')

    if (angleUnit === 'deg') {
      s = s
        .replace(/Math\.sin\(([^)]+)\)/g, (_, a) => `Math.sin(((${a})*Math.PI/180))`)
        .replace(/Math\.cos\(([^)]+)\)/g, (_, a) => `Math.cos(((${a})*Math.PI/180))`)
        .replace(/Math\.tan\(([^)]+)\)/g, (_, a) => `Math.tan(((${a})*Math.PI/180))`)
      s = s
        .replace(/Math\.asin\(([^)]+)\)/g, (_, a) => `(Math.asin(${a})*180/Math.PI)`)
        .replace(/Math\.acos\(([^)]+)\)/g, (_, a) => `(Math.acos(${a})*180/Math.PI)`)
        .replace(/Math\.atan\(([^)]+)\)/g, (_, a) => `(Math.atan(${a})*180/Math.PI)`)
    }

    const result = new Function(`"use strict"; return (${s})`)()
    if (typeof result !== 'number') return 'Error'
    return formatResult(result)
  } catch {
    return 'Error'
  }
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  display: '0',
  exactDisplay: null,
  expression: '',
  previousResult: null,
  mode: 'basic',
  angleUnit: 'deg',
  hasResult: false,
  parenthesesCount: 0,
  history: [],
  showAC: true,

  appendDigit: (digit: string) => {
    const { display, hasResult } = get()
    if (hasResult) {
      set({ display: digit, exactDisplay: null, expression: '', hasResult: false, parenthesesCount: 0, showAC: false })
      return
    }
    if (display === '0' && digit !== '0') { set({ display: digit, showAC: false }) }
    else if (display === '0' && digit === '0') { return }
    else if (display.length < 16) { set({ display: display + digit, showAC: false }) }
  },

  appendOperator: (op: string) => {
    const { display, expression, hasResult, previousResult, parenthesesCount } = get()
    if (hasResult && previousResult !== null) {
      set({ expression: previousResult + ' ' + op + ' ', display: '0', exactDisplay: null, hasResult: false, showAC: true })
      return
    }
    let expr = expression + display
    for (let i = 0; i < parenthesesCount; i++) expr += ')'
    set({ expression: expr + ' ' + op + ' ', display: '0', exactDisplay: null, hasResult: false, parenthesesCount: 0, showAC: true })
  },

  appendDecimal: () => {
    const { display, hasResult } = get()
    if (hasResult) { set({ display: '0.', exactDisplay: null, expression: '', hasResult: false, showAC: false }); return }
    if (!display.includes('.')) { set({ display: display + '.', showAC: false }) }
  },

  appendParenthesis: (paren: string) => {
    const { display, expression, parenthesesCount, hasResult } = get()
    if (hasResult && paren === '(') { set({ expression: '', display: '0', hasResult: false, parenthesesCount: 1, showAC: false }); return }
    if (hasResult && paren === ')') return
    if (paren === '(') {
      if (display !== '0' || expression.length > 0) {
        set({ expression: expression + display + ' × (', display: '0', parenthesesCount: parenthesesCount + 1, showAC: true })
      } else { set({ parenthesesCount: parenthesesCount + 1, showAC: false }) }
    } else if (paren === ')' && parenthesesCount > 0) {
      set({ expression: expression + display + ')', display: '0', parenthesesCount: parenthesesCount - 1 })
    }
  },

  clear: () => set({ display: '0', exactDisplay: null, expression: '', hasResult: false, parenthesesCount: 0, previousResult: null, showAC: true }),
  clearEntry: () => {
    const { hasResult } = get()
    if (hasResult) { set({ display: '0', exactDisplay: null, expression: '', hasResult: false, parenthesesCount: 0, previousResult: null, showAC: true }); return }
    set({ display: '0', showAC: true })
  },
  backspace: () => {
    const { display, hasResult } = get()
    if (hasResult) { set({ display: '0', exactDisplay: null, expression: '', hasResult: false, parenthesesCount: 0, previousResult: null, showAC: true }); return }
    if (display.length > 1) { const d = display.slice(0, -1); set({ display: d === '-' ? '0' : d, showAC: d === '-' || d === '' }) }
    else set({ display: '0', showAC: true })
  },

  calculate: () => {
    const { display, expression, angleUnit, mode, parenthesesCount } = get()
    let fullExpr = expression + display
    for (let i = 0; i < parenthesesCount; i++) fullExpr += ')'
    if (!fullExpr || fullExpr.trim() === '' || fullExpr.trim() === '0') return

    const result = evaluateExpression(fullExpr, angleUnit)
    if (result !== 'Error') {
      const numResult = parseFloat(result)
      const exact = findExactForm(numResult, fullExpr, angleUnit)
      const historyItem: HistoryItem = { expression: fullExpr, result, exactForm: exact, mode }
      const newHistory = [historyItem, ...get().history].slice(0, 50)
      set({
        previousResult: result, display: result, exactDisplay: exact,
        expression: fullExpr + ' =', hasResult: true, history: newHistory,
        parenthesesCount: 0, showAC: true,
      })
      fetch('/api/calculations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(historyItem) }).catch(() => {})
    } else {
      set({ display: 'Error', exactDisplay: null, hasResult: true, showAC: true })
    }
  },

  toggleSign: () => {
    const { display } = get()
    if (display === '0' || display === 'Error') return
    set({ display: display.startsWith('-') ? display.slice(1) : '-' + display })
  },
  percentage: () => {
    const { display, hasResult } = get()
    if (hasResult) return
    const v = parseFloat(display)
    if (isNaN(v)) return
    set({ display: formatResult(v / 100), showAC: false })
  },

  scientificFunction: (fn: string) => {
    const { display, angleUnit } = get()
    let value = parseFloat(display)
    if (isNaN(value) && display !== 'Error') return

    let result: number
    let newExpr: string

    switch (fn) {
      case 'sin': result = Math.sin(toAngle(value, angleUnit)); newExpr = `sin(${display})`; break
      case 'cos': result = Math.cos(toAngle(value, angleUnit)); newExpr = `cos(${display})`; break
      case 'tan': result = Math.tan(toAngle(value, angleUnit)); newExpr = `tan(${display})`; break
      case 'asin': result = fromAngle(Math.asin(value), angleUnit); newExpr = `sin⁻¹(${display})`; break
      case 'acos': result = fromAngle(Math.acos(value), angleUnit); newExpr = `cos⁻¹(${display})`; break
      case 'atan': result = fromAngle(Math.atan(value), angleUnit); newExpr = `tan⁻¹(${display})`; break
      case 'log': result = Math.log10(value); newExpr = `log(${display})`; break
      case 'ln': result = Math.log(value); newExpr = `ln(${display})`; break
      case 'sqrt': result = Math.sqrt(value); newExpr = `√(${display})`; break
      case 'cbrt': result = Math.cbrt(value); newExpr = `∛(${display})`; break
      case 'square': result = value * value; newExpr = `${display}²`; break
      case 'cube': result = value * value * value; newExpr = `${display}³`; break
      case 'reciprocal': result = 1 / value; newExpr = `1/(${display})`; break
      case 'factorial': result = factorial(value); newExpr = `${display}!`; break
      case 'abs': result = Math.abs(value); newExpr = `|${display}|`; break
      case 'exp': result = Math.exp(value); newExpr = `e^(${display})`; break
      case 'pow10': result = Math.pow(10, value); newExpr = `10^(${display})`; break
      case 'pow2': result = Math.pow(2, value); newExpr = `2^(${display})`; break
      default: return
    }

    const formatted = formatResult(result)
    const exact = findExactForm(result, newExpr, angleUnit)
    set({ expression: newExpr + ' =', previousResult: formatted, display: formatted, exactDisplay: exact, hasResult: true, showAC: true })
  },

  insertConstant: (constant: string) => {
    const { display, hasResult } = get()
    const value = constant === 'π' ? Math.PI.toString() : Math.E.toString()
    if (hasResult) { set({ display: value, exactDisplay: constant === 'π' ? 'π' : 'e', expression: '', hasResult: false, parenthesesCount: 0, showAC: false }); return }
    if (display === '0') { set({ display: value, exactDisplay: constant === 'π' ? 'π' : 'e', showAC: false }) }
    else { set({ expression: display + ' × ', display: constant === 'π' ? 'π' : 'e', hasResult: false }) }
  },

  setMode: (mode: CalculatorMode) => set({ mode }),
  toggleAngleUnit: () => set((s) => ({ angleUnit: s.angleUnit === 'deg' ? 'rad' : 'deg' })),

  applyHistoryItem: (item: HistoryItem) => set({
    display: item.result, exactDisplay: item.exactForm ?? null,
    expression: '', previousResult: item.result, hasResult: true, parenthesesCount: 0, showAC: true,
  }),

  clearHistory: () => { set({ history: [] }); fetch('/api/calculations', { method: 'DELETE' }).catch(() => {}) },
  setHistory: (items: HistoryItem[]) => set({ history: items }),
}))
