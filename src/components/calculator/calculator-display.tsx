'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion } from 'framer-motion'

export function CalculatorDisplay() {
  const { display, expression, hasResult } = useCalculatorStore()

  const fontSize = display.length > 12 ? 'text-2xl' : display.length > 8 ? 'text-3xl' : 'text-5xl'

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-inner border border-white/5">
      {/* Expression history */}
      <div className="min-h-[2rem] text-right pr-1">
        {expression && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground text-sm font-mono truncate"
          >
            {expression}
          </motion.p>
        )}
      </div>
      {/* Current display */}
      <div className="flex items-end justify-end mt-2">
        <motion.span
          key={display}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`font-mono font-bold tabular-nums tracking-tight ${fontSize} ${
            display === 'Error' ? 'text-red-400' : 'text-white'
          }`}
        >
          {hasResult && display !== 'Error' && (
            <span className="text-muted-foreground text-lg mr-1">=</span>
          )}
          {display}
        </motion.span>
      </div>
    </div>
  )
}
