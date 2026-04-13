'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function CalculatorDisplay() {
  const { display, exactDisplay, expression, hasResult, parenthesesCount } = useCalculatorStore()
  const [copied, setCopied] = useState(false)

  // Live expression preview
  let previewExpr = expression
  if (!hasResult && display !== '0') previewExpr = expression + display
  else if (!hasResult && display === '0' && expression) previewExpr = expression + '0'
  if (!hasResult && parenthesesCount > 0) {
    for (let i = 0; i < parenthesesCount; i++) previewExpr += ')'
  }
  const showPreview = previewExpr && previewExpr.trim() !== ''

  // Font sizing
  const len = display.length
  const fontSize = len > 16 ? 'text-lg' : len > 13 ? 'text-xl' : len > 10 ? 'text-2xl' : len > 7 ? 'text-3xl' : 'text-[2.75rem]'

  const handleCopy = () => {
    const text = exactDisplay ? `${exactDisplay} (${display})` : display
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 p-5 sm:p-6 shadow-inner border border-white/5 relative group">
      {/* Expression / preview line */}
      <div className="min-h-[1.75rem] text-right pr-1 flex items-center justify-end">
        {showPreview && (
          <motion.p key={previewExpr} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}
            className="text-zinc-500 text-sm font-mono truncate max-w-full" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {previewExpr}
          </motion.p>
        )}
      </div>

      {/* Main result */}
      <div className="flex items-end justify-end mt-1 min-h-[3.5rem] gap-2">
        <div className="flex flex-col items-end">
          {/* Exact form (e.g. "1/2") */}
          {hasResult && exactDisplay && display !== exactDisplay && display !== 'Error' && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-300 text-base font-mono font-semibold mb-0.5"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {exactDisplay}
            </motion.span>
          )}
          {/* Decimal value */}
          <motion.span
            key={display}
            initial={{ opacity: 0, y: display === 'Error' ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`font-mono font-bold tracking-tight leading-tight ${fontSize}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <span className={display === 'Error' ? 'text-red-400' : hasResult ? 'text-emerald-400' : 'text-white'}>
              {hasResult && display !== 'Error' && <span className="text-zinc-500 text-base mr-1.5 font-normal">=</span>}
              {display}
            </span>
          </motion.span>
        </div>

        {/* Copy button */}
        {hasResult && display !== 'Error' && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 mb-2 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Copy result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />}
          </button>
        )}
      </div>
    </div>
  )
}
