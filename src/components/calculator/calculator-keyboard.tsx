'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion } from 'framer-motion'
import { Delete, RotateCcw, Percent, Plus, Minus, X, Equal, ArrowLeft } from 'lucide-react'
import { useCallback, useEffect } from 'react'

interface CalcButtonProps {
  label: string
  onClick: () => void
  variant?: 'default' | 'operator' | 'function' | 'equals' | 'wide'
  icon?: React.ReactNode
}

function CalcButton({ label, onClick, variant = 'default', icon }: CalcButtonProps) {
  const baseClasses = 'relative flex items-center justify-center rounded-2xl font-medium text-lg select-none active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  const variantClasses = {
    default: 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-white/5',
    operator: 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-md shadow-amber-900/20',
    function: 'bg-zinc-700/60 hover:bg-zinc-600 text-zinc-200 border border-white/5',
    equals: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20',
    wide: 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-white/5',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${variant === 'wide' ? 'col-span-2' : ''} h-16`}
      aria-label={label}
    >
      {icon ? (
        <span className="flex items-center gap-1">
          {icon}
          <span className="text-sm">{label}</span>
        </span>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  )
}

export function BasicCalculator() {
  const store = useCalculatorStore()

  return (
    <div className="grid grid-cols-4 gap-2.5 p-3">
      {/* Row 1: Function keys */}
      <CalcButton label="AC" onClick={store.clear} variant="function" />
      <CalcButton label="" onClick={store.toggleSign} variant="function" icon={<span className="text-lg">±</span>} />
      <CalcButton label="" onClick={store.percentage} variant="function" icon={<Percent className="w-5 h-5" />} />
      <CalcButton label="÷" onClick={() => store.appendOperator('÷')} variant="operator" icon={<span className="text-2xl">÷</span>} />

      {/* Row 2: 7 8 9 × */}
      <CalcButton label="7" onClick={() => store.appendDigit('7')} />
      <CalcButton label="8" onClick={() => store.appendDigit('8')} />
      <CalcButton label="9" onClick={() => store.appendDigit('9')} />
      <CalcButton label="×" onClick={() => store.appendOperator('×')} variant="operator" icon={<X className="w-5 h-5" />} />

      {/* Row 3: 4 5 6 - */}
      <CalcButton label="4" onClick={() => store.appendDigit('4')} />
      <CalcButton label="5" onClick={() => store.appendDigit('5')} />
      <CalcButton label="6" onClick={() => store.appendDigit('6')} />
      <CalcButton label="-" onClick={() => store.appendOperator('-')} variant="operator" icon={<Minus className="w-6 h-6" />} />

      {/* Row 4: 1 2 3 + */}
      <CalcButton label="1" onClick={() => store.appendDigit('1')} />
      <CalcButton label="2" onClick={() => store.appendDigit('2')} />
      <CalcButton label="3" onClick={() => store.appendDigit('3')} />
      <CalcButton label="+" onClick={() => store.appendOperator('+')} variant="operator" icon={<Plus className="w-5 h-5" />} />

      {/* Row 5: 0 (wide) . = */}
      <CalcButton label="0" onClick={() => store.appendDigit('0')} variant="wide" />
      <CalcButton label="." onClick={store.appendDecimal} />
      <CalcButton label="=" onClick={store.calculate} variant="equals" icon={<Equal className="w-5 h-5" />} />
    </div>
  )
}

export function ScientificCalculator() {
  const store = useCalculatorStore()
  const { angleUnit } = useCalculatorStore()

  return (
    <div className="space-y-2.5 p-3">
      {/* Scientific function buttons - 5 columns */}
      <div className="grid grid-cols-5 gap-2">
        <SciButton label={angleUnit === 'deg' ? 'DEG' : 'RAD'} onClick={store.toggleAngleUnit} variant="accent" />
        <SciButton label="sin" onClick={() => store.scientificFunction('sin')} />
        <SciButton label="cos" onClick={() => store.scientificFunction('cos')} />
        <SciButton label="tan" onClick={() => store.scientificFunction('tan')} />
        <SciButton label="π" onClick={() => store.insertConstant('π')} />

        <SciButton label="sin⁻¹" onClick={() => store.scientificFunction('asin')} />
        <SciButton label="cos⁻¹" onClick={() => store.scientificFunction('acos')} />
        <SciButton label="tan⁻¹" onClick={() => store.scientificFunction('atan')} />
        <SciButton label="log" onClick={() => store.scientificFunction('log')} />
        <SciButton label="e" onClick={() => store.insertConstant('e')} />

        <SciButton label="x²" onClick={() => store.scientificFunction('square')} />
        <SciButton label="x³" onClick={() => store.scientificFunction('cube')} />
        <SciButton label="√" onClick={() => store.scientificFunction('sqrt')} />
        <SciButton label="∛" onClick={() => store.scientificFunction('cbrt')} />
        <SciButton label="x!" onClick={() => store.scientificFunction('factorial')} />

        <SciButton label="ln" onClick={() => store.scientificFunction('ln')} />
        <SciButton label="eˣ" onClick={() => store.scientificFunction('exp')} />
        <SciButton label="10ˣ" onClick={() => store.scientificFunction('pow10')} />
        <SciButton label="1/x" onClick={() => store.scientificFunction('reciprocal')} />
        <SciButton label="|x|" onClick={() => store.scientificFunction('abs')} />
      </div>

      {/* Main calculator grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1: Function keys */}
        <CalcButton label="(" onClick={() => store.appendParenthesis('(')} variant="function" />
        <CalcButton label=")" onClick={() => store.appendParenthesis(')')} variant="function" />
        <CalcButton label="" onClick={store.backspace} variant="function" icon={<ArrowLeft className="w-5 h-5" />} />
        <CalcButton label="÷" onClick={() => store.appendOperator('÷')} variant="operator" icon={<span className="text-2xl">÷</span>} />

        {/* Row 2 */}
        <CalcButton label="7" onClick={() => store.appendDigit('7')} />
        <CalcButton label="8" onClick={() => store.appendDigit('8')} />
        <CalcButton label="9" onClick={() => store.appendDigit('9')} />
        <CalcButton label="×" onClick={() => store.appendOperator('×')} variant="operator" icon={<X className="w-5 h-5" />} />

        {/* Row 3 */}
        <CalcButton label="4" onClick={() => store.appendDigit('4')} />
        <CalcButton label="5" onClick={() => store.appendDigit('5')} />
        <CalcButton label="6" onClick={() => store.appendDigit('6')} />
        <CalcButton label="-" onClick={() => store.appendOperator('-')} variant="operator" icon={<Minus className="w-6 h-6" />} />

        {/* Row 4 */}
        <CalcButton label="1" onClick={() => store.appendDigit('1')} />
        <CalcButton label="2" onClick={() => store.appendDigit('2')} />
        <CalcButton label="3" onClick={() => store.appendDigit('3')} />
        <CalcButton label="+" onClick={() => store.appendOperator('+')} variant="operator" icon={<Plus className="w-5 h-5" />} />

        {/* Row 5 */}
        <CalcButton label="AC" onClick={store.clear} variant="function" />
        <CalcButton label="0" onClick={() => store.appendDigit('0')} />
        <CalcButton label="." onClick={store.appendDecimal} />
        <CalcButton label="=" onClick={store.calculate} variant="equals" icon={<Equal className="w-5 h-5" />} />
      </div>
    </div>
  )
}

// Scientific mini button
function SciButton({ label, onClick, variant = 'default' }: { label: string; onClick: () => void; variant?: 'default' | 'accent' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-xl font-medium text-sm select-none active:scale-95 transition-all duration-150 cursor-pointer h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        variant === 'accent'
          ? 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
          : 'bg-zinc-700/60 hover:bg-zinc-600 text-zinc-200 border border-white/5'
      }`}
      aria-label={label}
    >
      {label}
    </motion.button>
  )
}
