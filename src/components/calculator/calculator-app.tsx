'use client'

import { useCalculatorStore, type CalculatorMode } from '@/stores/calculator-store'
import { CalculatorDisplay } from './calculator-display'
import { BasicCalculator, ScientificCalculator } from './calculator-keyboard'
import { HistoryPanel } from './history-panel'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, History, Atom, Zap, Keyboard } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { type HistoryItem } from '@/stores/calculator-store'

export function CalculatorApp() {
  const {
    mode, setMode, setHistory,
    percentage, appendOperator, appendDigit, appendDecimal,
    calculate, clear, clearEntry, backspace, appendParenthesis,
  } = useCalculatorStore()

  // Load history from DB on mount
  useEffect(() => {
    fetch('/api/calculations')
      .then(res => res.json())
      .then((data: HistoryItem[]) => {
        if (Array.isArray(data)) setHistory(data)
      })
      .catch(() => {})
  }, [setHistory])

  // ─── keyboard support ─────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key
    // Prevent browser defaults for calculator keys
    if (/^[0-9.+\-*/=%()^c]$/i.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
      e.preventDefault()
    }

    switch (key) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        appendDigit(key)
        break
      case '+': appendOperator('+'); break
      case '-': appendOperator('-'); break
      case '*': appendOperator('×'); break
      case '/': appendOperator('÷'); break
      case '.': appendDecimal(); break
      case 'Enter': case '=': calculate(); break
      case 'Backspace': backspace(); break
      case 'Escape': clear(); break
      case 'Delete': clearEntry(); break
      case '%': percentage(); break
      case '(': appendParenthesis('('); break
      case ')': appendParenthesis(')'); break
    }
  }, [appendDigit, appendOperator, appendDecimal, calculate, backspace, clear, clearEntry, percentage, appendParenthesis])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ─── render ───────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-52 -right-52 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-52 h-[28rem] w-[28rem] rounded-full bg-amber-500/[0.04] blur-3xl" />

      {/* main content — pushes footer down */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* ─── header ─── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-5 px-1"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-zinc-900" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">Calculator</h1>
                <p className="text-[11px] text-zinc-500 mt-0.5">by BrutalTools</p>
              </div>
            </div>

            {/* mobile history trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer"
                  aria-label="Open history"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-zinc-900 border-white/[0.06] p-0">
                <SheetTitle className="sr-only">Calculation History</SheetTitle>
                <HistoryPanel />
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* ─── calculator body ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* display */}
            <div className="p-4 pb-0">
              <CalculatorDisplay />
            </div>

            {/* mode tabs */}
            <div className="px-4 pt-3.5">
              <Tabs value={mode} onValueChange={(v) => setMode(v as CalculatorMode)} className="w-full">
                <TabsList className="w-full bg-zinc-800/60 h-9 rounded-xl p-1 border border-white/[0.04]">
                  <TabsTrigger
                    value="basic"
                    className="flex-1 rounded-lg text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5" />
                      Basic
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="scientific"
                    className="flex-1 rounded-lg text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" />
                      Scientific
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* keyboard area */}
            <div className="mt-2">
              <AnimatePresence mode="wait">
                {mode === 'basic' ? (
                  <motion.div key="basic" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                    <BasicCalculator />
                  </motion.div>
                ) : (
                  <motion.div key="sci" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                    <ScientificCalculator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* keyboard hint */}
            <div className="px-4 pb-3 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
                <Keyboard className="w-3 h-3" />
                <span>Type: 0-9 &middot; + &minus; * / &middot; Enter &middot; Esc &middot; Backspace &middot; ( )</span>
              </div>
            </div>
          </motion.div>

          {/* desktop history panel */}
          <div className="hidden lg:block mt-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden max-h-72"
            >
              <HistoryPanel />
            </motion.div>
          </div>
        </div>
      </main>

      {/* ─── sticky footer ─── */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-[11px] text-zinc-500 text-center">
            Developed under{' '}
            <span className="font-semibold text-zinc-300">BrutalTools</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
