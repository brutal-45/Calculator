'use client'

import { useCalculatorStore, type CalculatorMode } from '@/stores/calculator-store'
import { CalculatorDisplay } from './calculator-display'
import { BasicCalculator, ScientificCalculator } from './calculator-keyboard'
import { HistoryPanel } from './history-panel'
import { ReferenceTablesPanel } from './reference-tables'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, History, Atom, Zap, Keyboard, TableProperties } from 'lucide-react'
import { useEffect, useCallback, useState } from 'react'
import { type HistoryItem } from '@/stores/calculator-store'

/* ────── BrutalTools Logo ────── */
function BrutalToolsLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-900/30"
      style={{ width: size, height: size, borderRadius: size * 0.26 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700" />
      {/* grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
        <defs><pattern id="g" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M6 0L0 0 0 6" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>
      {/* bolt */}
      <svg viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-sm"
        style={{ width: size * 0.48, height: size * 0.48 }} aria-hidden="true">
        <path d="M13 2L4.5 13H11L10 22L19.5 11H13L13 2Z" fill="#FBBF24" stroke="#B45309" strokeWidth="0.3" strokeLinejoin="round"/>
        <path d="M13 5L7 12.5H11.5L10.5 19L17 11H12.5L13 5Z" fill="#FDE68A" opacity="0.5"/>
      </svg>
      {/* shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      {/* dot */}
      <div className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] rounded-full bg-amber-400 border-[1.5px] border-zinc-900 z-20" />
    </div>
  )
}

type DesktopPanel = 'tables' | 'history'

export function CalculatorApp() {
  const {
    mode, setMode, setHistory,
    percentage, appendOperator, appendDigit, appendDecimal,
    calculate, clear, clearEntry, backspace, appendParenthesis,
  } = useCalculatorStore()
  const [desktopPanel, setDesktopPanel] = useState<DesktopPanel>('tables')

  useEffect(() => {
    fetch('/api/calculations')
      .then(res => res.json())
      .then((data: HistoryItem[]) => { if (Array.isArray(data)) setHistory(data) })
      .catch(() => {})
  }, [setHistory])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const k = e.key
    if (/^[0-9.+\-*/=%()^c]$/i.test(k) || k === 'Enter' || k === 'Backspace' || k === 'Escape') e.preventDefault()
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
                <SheetContent side="right" className="w-[340px] sm:w-[440px] bg-zinc-900 border-white/[0.06] p-0">
                  <SheetTitle className="sr-only">Reference Tables</SheetTitle>
                  <ReferenceTablesPanel />
                </SheetContent>
              </Sheet>
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

          {/* desktop bottom panel */}
          <div className="hidden lg:block mt-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center border-b border-white/[0.06] px-3 pt-2">
                {(['tables', 'history'] as const).map(p => (
                  <button key={p} onClick={() => setDesktopPanel(p)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer ${
                      desktopPanel === p ? 'text-emerald-400 bg-white/[0.03] border-b-2 border-emerald-400 -mb-px' : 'text-zinc-500 hover:text-zinc-300'
                    }`}>
                    {p === 'tables' ? <TableProperties className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
                    {p === 'tables' ? 'Reference Tables' : 'History'}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={desktopPanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                  className={desktopPanel === 'tables' ? 'max-h-96' : 'max-h-72'}>
                  {desktopPanel === 'tables' ? <ReferenceTablesPanel /> : <HistoryPanel />}
                </motion.div>
              </AnimatePresence>
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
