'use client'

import { useCalculatorStore, type CalculatorMode } from '@/stores/calculator-store'
import { CalculatorDisplay } from './calculator-display'
import { BasicCalculator, ScientificCalculator } from './calculator-keyboard'
import { HistoryPanel } from './history-panel'
import { ReferenceTablesPanel } from './reference-tables'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, History, Atom, Zap, Keyboard, TableProperties, Github } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { type HistoryItem } from '@/stores/calculator-store'

/* ────── BrutalTools Logo ────── */
function BrutalToolsLogo({ size = 36 }: { size?: number }) {
  const s = size
  const id = 'blogo'

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: s, height: s }}
    >
      {/* outer glow ring */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          inset: -s * 0.08,
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
        }}
      />

      {/* main icon container */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="relative z-10 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* background gradient */}
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* border gradient */}
          <linearGradient id={`${id}-border`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* bolt gradient */}
          <linearGradient id={`${id}-bolt`} x1="26" y1="12" x2="40" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* inner glow for bolt */}
          <linearGradient id={`${id}-bolt-inner`} x1="30" y1="16" x2="36" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* B letter gradient */}
          <linearGradient id={`${id}-letter`} x1="8" y1="16" x2="30" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* subtle shine overlay */}
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* drop shadow */}
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.4" />
          </filter>

          {/* bolt glow */}
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* background rounded square */}
        <rect
          x="3" y="3" width="58" height="58" rx="16"
          fill={`url(#${id}-bg)`}
          stroke={`url(#${id}-border)`}
          strokeWidth="1.5"
          filter={`url(#${id}-shadow)`}
        />

        {/* inner border accent line */}
        <rect
          x="5" y="5" width="54" height="54" rx="14"
          fill="none"
          stroke="white"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />

        {/* stylized "B" letter */}
        <path
          d="M18 46V18h12c3.3 0 6 2.7 6 6s-2.7 6-6 6h-12m0 0h13c3.3 0 6 2.7 6 6s-2.7 6-6 6H18"
          fill="none"
          stroke={`url(#${id}-letter)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* lightning bolt cutting through the B */}
        <path
          d="M37 12L28 30h6.5L26 52L44 26h-7.5L41 12H37Z"
          fill={`url(#${id}-bolt)`}
          filter={`url(#${id}-glow)`}
        />

        {/* bolt inner highlight */}
        <path
          d="M37.5 16L31 29h5l-6.5 18L41 27h-5.5L39 16h-1.5Z"
          fill={`url(#${id}-bolt-inner)`}
          opacity="0.45"
        />

        {/* top shine */}
        <ellipse
          cx="32" cy="20" rx="22" ry="14"
          fill={`url(#${id}-shine)`}
        />

        {/* corner sparkle */}
        <circle cx="8" cy="8" r="1.2" fill="#fbbf24" opacity="0.7" />
      </svg>
    </div>
  )
}

export function CalculatorApp() {
  const {
    mode, setMode, setHistory,
    percentage, appendOperator, appendDigit, appendDecimal,
    calculate, clear, clearEntry, backspace, appendParenthesis,
  } = useCalculatorStore()
  useEffect(() => {
    fetch('/api/calculations')
      .then(res => res.json())
      .then((data: HistoryItem[]) => { if (Array.isArray(data)) setHistory(data) })
      .catch(() => {})
  }, [setHistory])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const k = e.key
    if (/^[0-9.+\-*/=%()=]$/i.test(k) || k === 'Enter' || k === 'Backspace' || k === 'Escape') e.preventDefault()
    switch (k) {
      case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9': appendDigit(k); break
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

  useEffect(() => { window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown) }, [handleKeyDown])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-52 -right-52 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-52 h-[28rem] w-[28rem] rounded-full bg-amber-500/[0.04] blur-3xl" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-3">
              <BrutalToolsLogo size={42} />
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">Calculator</h1>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                  by{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    BrutalTools
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer" aria-label="Open reference tables">
                    <TableProperties className="w-4 h-4" />
                    <span className="hidden sm:inline">Tables</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] bg-zinc-900 border-white/[0.06] p-0">
                  <SheetTitle className="sr-only">Reference Tables</SheetTitle>
                  <ReferenceTablesPanel />
                </SheetContent>
              </Sheet>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer"
                aria-label="Open GitHub"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-200 text-sm transition-all border border-white/[0.06] cursor-pointer" aria-label="Open history">
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

          {/* calculator body */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
            <div className="p-4 pb-0"><CalculatorDisplay /></div>
            <div className="px-4 pt-3.5">
              <Tabs value={mode} onValueChange={(v) => setMode(v as CalculatorMode)} className="w-full">
                <TabsList className="w-full bg-zinc-800/60 h-9 rounded-xl p-1 border border-white/[0.04]">
                  <TabsTrigger value="basic" className="flex-1 rounded-lg text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                    <span className="flex items-center gap-1.5"><Calculator className="w-3.5 h-3.5" />Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="scientific" className="flex-1 rounded-lg text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                    <span className="flex items-center gap-1.5"><Atom className="w-3.5 h-3.5" />Scientific</span>
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
                <span>0-9 &middot; + &minus; * / &middot; Enter &middot; Esc &middot; Backspace &middot; ( )</span>
              </div>
            </div>
          </motion.div>

          {/* desktop bottom panel — history only */}
          <div className="hidden lg:block mt-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden max-h-72">
              <HistoryPanel />
            </motion.div>
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-center gap-2.5">
          <BrutalToolsLogo size={16} />
          <p className="text-[11px] text-zinc-500 text-center">
            Developed under{' '}
            <span className="font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">BrutalTools</span>
          </p>
          <Zap className="w-3 h-3 text-amber-500/60" />
        </div>
      </footer>
    </div>
  )
}
