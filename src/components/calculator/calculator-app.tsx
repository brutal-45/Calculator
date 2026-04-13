'use client'

import { useCalculatorStore, type CalculatorMode } from '@/stores/calculator-store'
import { CalculatorDisplay } from './calculator-display'
import { BasicCalculator, ScientificCalculator } from './calculator-keyboard'
import { HistoryPanel } from './history-panel'
import { ReferenceTablesPanel } from './reference-tables'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator, History, Atom, Zap, Keyboard,
  BookOpen, TableProperties, ArrowRight,
} from 'lucide-react'
import { useEffect, useCallback, useState } from 'react'
import { type HistoryItem } from '@/stores/calculator-store'

/* ────── BrutalTools Logo component ────── */
function BrutalToolsLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-lg"
      style={{ width: size, height: size }}
    >
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700" />
      {/* grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" aria-hidden="true">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* bolt icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
        style={{ width: size * 0.5, height: size * 0.5 }}
        aria-hidden="true"
      >
        <path
          d="M13 2L4.5 13H11L10 22L19.5 11H13L13 2Z"
          fill="url(#boltGrad)"
          stroke="#D97706"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="boltGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>
      {/* shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
      {/* corner dot */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border-2 border-zinc-900 z-20" />
    </div>
  )
}

/* ────── Panel type for desktop bottom section ────── */
type DesktopPanel = 'history' | 'tables'

export function CalculatorApp() {
  const {
    mode, setMode, setHistory,
    percentage, appendOperator, appendDigit, appendDecimal,
    calculate, clear, clearEntry, backspace, appendParenthesis,
  } = useCalculatorStore()

  const [desktopPanel, setDesktopPanel] = useState<DesktopPanel>('tables')

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
    if (/^[0-9.+\-*/=%()^c]$/i.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
      e.preventDefault()
    }
    switch (key) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        appendDigit(key); break
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
              <BrutalToolsLogo size={40} />
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">Calculator</h1>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                  by{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    BrutalTools
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tables button — mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer"
                    aria-label="Open reference tables"
                  >
                    <TableProperties className="w-4 h-4" />
                    <span className="hidden sm:inline">Tables</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[340px] sm:w-[420px] bg-zinc-900 border-white/[0.06] p-0">
                  <SheetTitle className="sr-only">Reference Tables</SheetTitle>
                  <ReferenceTablesPanel />
                </SheetContent>
              </Sheet>

              {/* History button — mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer"
                    aria-label="Open history"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-zinc-900 border-white/[0.06] p-0">
                  <SheetTitle className="sr-only">Calculation History</SheetTitle>
                  <HistoryPanel />
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>

          {/* ─── calculator body ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="p-4 pb-0">
              <CalculatorDisplay />
            </div>

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

            <div className="px-4 pb-3 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
                <Keyboard className="w-3 h-3" />
                <span>Type: 0-9 &middot; + &minus; * / &middot; Enter &middot; Esc &middot; Backspace &middot; ( )</span>
              </div>
            </div>
          </motion.div>

          {/* ─── desktop bottom panel (tables + history) ─── */}
          <div className="hidden lg:block mt-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
            >
              {/* tab bar for bottom panel */}
              <div className="flex items-center border-b border-white/[0.06] px-3 pt-2">
                <button
                  onClick={() => setDesktopPanel('tables')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer ${
                    desktopPanel === 'tables'
                      ? 'text-emerald-400 bg-white/[0.03] border-b-2 border-emerald-400 -mb-px'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  Reference Tables
                </button>
                <button
                  onClick={() => setDesktopPanel('history')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer ${
                    desktopPanel === 'history'
                      ? 'text-emerald-400 bg-white/[0.03] border-b-2 border-emerald-400 -mb-px'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </button>
              </div>

              {/* content */}
              <AnimatePresence mode="wait">
                {desktopPanel === 'tables' ? (
                  <motion.div
                    key="tables"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="max-h-80"
                  >
                    <ReferenceTablesPanel />
                  </motion.div>
                ) : (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="max-h-72"
                  >
                    <HistoryPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ─── sticky footer ─── */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-center gap-2.5">
          <BrutalToolsLogo size={18} />
          <p className="text-[11px] text-zinc-500 text-center">
            Developed under{' '}
            <span className="font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              BrutalTools
            </span>
          </p>
          <Zap className="w-3 h-3 text-amber-500/60" />
        </div>
      </footer>
    </div>
  )
}
