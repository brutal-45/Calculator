'use client'

import { useCalculatorStore } from '@/stores/calculator-store'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Font sizing — adaptive based on display length
  const len = display.length
  const fontSize = len > 16 ? 'text-lg' : len > 13 ? 'text-xl' : len > 10 ? 'text-2xl' : len > 7 ? 'text-3xl' : 'text-[2.75rem]'

  const handleCopy = () => {
    const text = exactDisplay ? `${exactDisplay} (${display})` : display
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }

  const isError = display === 'Error'

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-zinc-950/90 to-zinc-900/90 p-5 sm:p-6 shadow-inner border border-white/[0.05] relative group overflow-hidden">
      {/* Subtle top highlight line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* result glow — stronger, more vibrant */}
      <AnimatePresence>
        {hasResult && !isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="result-glow absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-amber-500/[0.02] pointer-events-none rounded-2xl"
          />
        )}
      </AnimatePresence>

      {/* top bar: expression + parentheses indicator */}
      <div className="flex items-center justify-between gap-2 min-h-[1.75rem] pr-1">
        {/* expression preview */}
        <motion.p
          key={previewExpr}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="text-zinc-500 text-sm font-mono truncate flex-1 text-right"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {showPreview ? previewExpr : '\u00A0'}
        </motion.p>

        {/* parentheses counter */}
        <AnimatePresence>
          {parenthesesCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-bold text-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-500/10"
            >
              {parenthesesCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main result */}
      <div className="flex items-end justify-end mt-1 min-h-[3.5rem] gap-2 relative">
        <div className="flex flex-col items-end">
          {/* Exact form (e.g. "1/2") */}
          <AnimatePresence>
            {hasResult && exactDisplay && display !== exactDisplay && !isError && (
              <motion.span
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="text-emerald-300 text-base font-mono font-semibold mb-0.5"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {exactDisplay}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Decimal value */}
          <motion.span
            key={display}
            initial={isError ? { x: 0 } : { opacity: 0, y: 4 }}
            animate={isError
              ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
              : { opacity: 1, y: 0 }
            }
            transition={!isError ? { duration: 0.12, ease: 'easeOut' } : undefined}
            className={`font-mono font-bold tracking-tight leading-tight ${fontSize}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <span className={isError ? 'text-red-400' : hasResult ? 'text-emerald-400' : 'text-white'}>
              {hasResult && !isError && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-zinc-500 text-base mr-1.5 font-normal"
                >
                  =
                </motion.span>
              )}
              {display}
            </span>
          </motion.span>
        </div>

        {/* Copy button */}
        {hasResult && !isError && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCopy}
            className="lg:opacity-0 lg:group-hover:opacity-100 mb-2 p-1.5 rounded-lg hover:bg-white/5 active:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/[0.06]"
            aria-label="Copy result"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                  <Check className="w-4 h-4 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                  <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      {/* Subtle bottom divider */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}
