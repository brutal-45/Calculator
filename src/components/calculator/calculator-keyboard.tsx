'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion } from 'framer-motion'
import { Percent, ArrowLeft } from 'lucide-react'
 
/* ──────── reusable button ──────── */
type Variant = 'default' | 'operator' | 'fn' | 'equals' | 'wide' | 'ghost'

const variantClass: Record<Variant, string> = {
  default:
    'bg-zinc-800/60 hover:bg-zinc-700/70 active:bg-zinc-600/90 text-white border border-white/[0.06] shadow-sm shadow-black/10 btn-press-effect',
  operator:
    'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 text-white shadow-lg shadow-amber-900/25 btn-press-effect',
  fn: 'bg-zinc-700/40 hover:bg-zinc-600/50 active:bg-zinc-500/60 text-zinc-300 border border-white/[0.05] btn-press-effect',
  equals:
    'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:from-emerald-600 active:to-emerald-700 text-white shadow-lg shadow-emerald-900/25 btn-press-effect',
  wide: 'bg-zinc-800/60 hover:bg-zinc-700/70 active:bg-zinc-600/90 text-white border border-white/[0.06] shadow-sm shadow-black/10 btn-press-effect',
  ghost: 'bg-transparent hover:bg-zinc-700/40 active:bg-zinc-600/40 text-zinc-400',
}

function Btn({
  label,
  onClick,
  variant = 'default',
  wide = false,
  icon,
  className = '',
}: {
  label?: string
  onClick: () => void
  variant?: Variant
  wide?: boolean
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.91 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-2xl font-semibold text-lg
        select-none transition-all duration-100 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        h-[3.6rem] ${variantClass[variant]} ${wide ? 'col-span-2' : ''} ${className}
      `}
      aria-label={label || icon?.toString()}
    >
      {icon && !label ? (
        icon
      ) : icon ? (
        <span className="flex items-center gap-1">{icon}</span>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  )
}

/* ──────── scientific mini button ──────── */
function SciBtn({
  label,
  onClick,
  accent = false,
}: {
  label: string
  onClick: () => void
  accent?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-xl font-semibold text-[0.8rem]
        select-none transition-all duration-100 cursor-pointer h-10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring btn-press-effect
        ${accent
          ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow shadow-emerald-900/20'
          : 'bg-zinc-700/40 hover:bg-zinc-600/50 active:bg-zinc-500/60 text-zinc-300 border border-white/[0.05]'
        }
      `}
      aria-label={label}
    >
      {label}
    </motion.button>
  )
}

/* ════════════════════════════════════════
   BASIC CALCULATOR
   ════════════════════════════════════════ */
export function BasicCalculator() {
  const store = useCalculatorStore()
  const { showAC } = useCalculatorStore()

  return (
    <div className="grid grid-cols-4 gap-2.5 px-3 pt-3 pb-2">
      {/* Row 1 — functions */}
      <Btn
        label={showAC ? 'AC' : 'CE'}
        onClick={showAC ? store.clear : store.clearEntry}
        variant={showAC ? 'fn' : 'ghost'}
      />
      <Btn icon={<ArrowLeft className="w-5 h-5" />} onClick={store.backspace} variant="fn" />
      <Btn icon={<span className="text-lg font-bold">&plusmn;</span>} onClick={store.toggleSign} variant="fn" />
      <Btn label="÷" onClick={() => store.appendOperator('÷')} variant="operator" />

      {/* Row 2 */}
      <Btn label="7" onClick={() => store.appendDigit('7')} />
      <Btn label="8" onClick={() => store.appendDigit('8')} />
      <Btn label="9" onClick={() => store.appendDigit('9')} />
      <Btn label="×" onClick={() => store.appendOperator('×')} variant="operator" />

      {/* Row 3 */}
      <Btn label="4" onClick={() => store.appendDigit('4')} />
      <Btn label="5" onClick={() => store.appendDigit('5')} />
      <Btn label="6" onClick={() => store.appendDigit('6')} />
      <Btn label="−" onClick={() => store.appendOperator('-')} variant="operator" />

      {/* Row 4 */}
      <Btn label="1" onClick={() => store.appendDigit('1')} />
      <Btn label="2" onClick={() => store.appendDigit('2')} />
      <Btn label="3" onClick={() => store.appendDigit('3')} />
      <Btn label="+" onClick={() => store.appendOperator('+')} variant="operator" />

      {/* Row 5 */}
      <Btn label="0" onClick={() => store.appendDigit('0')} wide />
      <Btn label="." onClick={store.appendDecimal} />
      <Btn label="=" onClick={store.calculate} variant="equals" />
    </div>
  )
}

/* ════════════════════════════════════════
   SCIENTIFIC CALCULATOR
   ════════════════════════════════════════ */
export function ScientificCalculator() {
  const store = useCalculatorStore()
  const { angleUnit, showAC } = useCalculatorStore()

  return (
    <div className="px-3 pt-3 pb-2 space-y-2.5">
      {/* Scientific row 5×4 */}
      <div className="grid grid-cols-5 gap-1.5">
        <SciBtn label={angleUnit === 'deg' ? 'DEG' : 'RAD'} onClick={store.toggleAngleUnit} accent />
        <SciBtn label="sin" onClick={() => store.scientificFunction('sin')} />
        <SciBtn label="cos" onClick={() => store.scientificFunction('cos')} />
        <SciBtn label="tan" onClick={() => store.scientificFunction('tan')} />
        <SciBtn label="π" onClick={() => store.insertConstant('π')} />

        <SciBtn label="sin⁻¹" onClick={() => store.scientificFunction('asin')} />
        <SciBtn label="cos⁻¹" onClick={() => store.scientificFunction('acos')} />
        <SciBtn label="tan⁻¹" onClick={() => store.scientificFunction('atan')} />
        <SciBtn label="log" onClick={() => store.scientificFunction('log')} />
        <SciBtn label="e" onClick={() => store.insertConstant('e')} />

        <SciBtn label="x²" onClick={() => store.scientificFunction('square')} />
        <SciBtn label="x³" onClick={() => store.scientificFunction('cube')} />
        <SciBtn label="√x" onClick={() => store.scientificFunction('sqrt')} />
        <SciBtn label="∛x" onClick={() => store.scientificFunction('cbrt')} />
        <SciBtn label="x!" onClick={() => store.scientificFunction('factorial')} />

        <SciBtn label="ln" onClick={() => store.scientificFunction('ln')} />
        <SciBtn label="eˣ" onClick={() => store.scientificFunction('exp')} />
        <SciBtn label="10ˣ" onClick={() => store.scientificFunction('pow10')} />
        <SciBtn label="1/x" onClick={() => store.scientificFunction('reciprocal')} />
        <SciBtn label="|x|" onClick={() => store.scientificFunction('abs')} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <Btn
          label={showAC ? 'AC' : 'CE'}
          onClick={showAC ? store.clear : store.clearEntry}
          variant={showAC ? 'fn' : 'ghost'}
        />
        <Btn icon={<ArrowLeft className="w-5 h-5" />} onClick={store.backspace} variant="fn" />
        <Btn label="(" onClick={() => store.appendParenthesis('(')} variant="fn" />
        <Btn label="÷" onClick={() => store.appendOperator('÷')} variant="operator" />

        {/* Row 2 */}
        <Btn label="7" onClick={() => store.appendDigit('7')} />
        <Btn label="8" onClick={() => store.appendDigit('8')} />
        <Btn label="9" onClick={() => store.appendDigit('9')} />
        <Btn label="×" onClick={() => store.appendOperator('×')} variant="operator" />

        {/* Row 3 */}
        <Btn label="4" onClick={() => store.appendDigit('4')} />
        <Btn label="5" onClick={() => store.appendDigit('5')} />
        <Btn label="6" onClick={() => store.appendDigit('6')} />
        <Btn label="−" onClick={() => store.appendOperator('-')} variant="operator" />

        {/* Row 4 */}
        <Btn label="1" onClick={() => store.appendDigit('1')} />
        <Btn label="2" onClick={() => store.appendDigit('2')} />
        <Btn label="3" onClick={() => store.appendDigit('3')} />
        <Btn label="+" onClick={() => store.appendOperator('+')} variant="operator" />

        {/* Row 5 */}
        <Btn label="±" onClick={store.toggleSign} variant="fn" />
        <Btn label="0" onClick={() => store.appendDigit('0')} />
        <Btn label="." onClick={store.appendDecimal} />
        <Btn label="=" onClick={store.calculate} variant="equals" />
      </div>
    </div>
  )
}
