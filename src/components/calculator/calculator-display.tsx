'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion } from 'framer-motion'

export function CalculatorDisplay() {
  const { display, expression, hasResult, parenthesesCount } = useCalculatorStore()

  // Build the live expression preview for the user
  let previewExpr = expression
  if (!hasResult && display !== '0') {
    previewExpr = expression + display
  } else if (!hasResult && display === '0' && expression) {
    previewExpr = expression + '0'
  }
  // Show trailing parentheses count
  if (!hasResult && parenthesesCount > 0) {
    for (let i = 0; i < parenthesesCount; i++) previewExpr += ')'
  }

  const showPreview = previewExpr && previewExpr.trim() !== ''

  // Auto-size the main display
  const len = display.length
  const fontSize = len > 14 ? 'text-xl' : len > 10 ? 'text-2xl' : len > 7 ? 'text-3xl' : 'text-5xl'

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 p-5 sm:p-6 shadow-inner border border-white/5">
      {/* Expression / preview line */}
      <div className="min-h-[1.75rem] text-right pr-1 flex items-center justify-end">
        {showPreview && (
          <motion.p
            key={previewExpr}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="text-zinc-500 text-sm font-mono truncate max-w-full"
          >
            {previewExpr}
          </motion.p>
        )}
      </div>
      {/* Current value / result */}
      <div className="flex items-end justify-end mt-1 min-h-[3.5rem]">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: display === 'Error' ? 0 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className={`font-mono font-bold tabular-nums tracking-tight leading-tight ${fontSize} ${
            display === 'Error'
              ? 'text-red-400'
              : hasResult
                ? 'text-emerald-400'
                : 'text-white'
          }`}
        >
          {hasResult && display !== 'Error' && (
            <span className="text-zinc-500 text-base mr-1.5 font-normal">=</span>
          )}
          {display}
        </motion.span>
      </div>
    </div>
  )
}
