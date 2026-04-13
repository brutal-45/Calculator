'use client'

import { useCalculatorStore, type CalculatorMode } from '@/stores/calculator-store'
import { CalculatorDisplay } from './calculator-display'
import { BasicCalculator, ScientificCalculator } from './calculator-keyboard'
import { HistoryPanel } from './history-panel'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, History, Atom } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { type HistoryItem } from '@/stores/calculator-store'

export function CalculatorApp() {
  const { mode, setMode, setHistory, percentage, appendOperator, appendDigit, appendDecimal, calculate, clear, clearEntry, backspace, appendParenthesis } = useCalculatorStore()

  // Load history from database on mount
  useEffect(() => {
    fetch('/api/calculations')
      .then(res => res.json())
      .then((data: HistoryItem[]) => {
        if (Array.isArray(data)) setHistory(data)
      })
      .catch(() => {})
  }, [setHistory])

  // Keyboard support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default for calculator keys
    if (/^[0-9.+\-*/=()%^cCEe\s]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      e.preventDefault()
    }

    switch (e.key) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        appendDigit(e.key)
        break
      case '+':
        appendOperator('+')
        break
      case '-':
        appendOperator('-')
        break
      case '*':
        appendOperator('×')
        break
      case '/':
        appendOperator('÷')
        break
      case '.':
        appendDecimal()
        break
      case 'Enter':
      case '=':
        calculate()
        break
      case 'Backspace':
        backspace()
        break
      case 'Escape':
      case 'c':
      case 'C':
        if (e.ctrlKey || e.key === 'Escape') clear()
        else clearEntry()
        break
      case '%':
        percentage()
        break
      case '(':
        appendParenthesis('(')
        break
      case ')':
        appendParenthesis(')')
        break
    }
  }, [appendDigit, appendOperator, appendDecimal, calculate, backspace, clear, clearEntry, percentage, appendParenthesis])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Calculator</h1>
              <p className="text-xs text-zinc-500">Powerful & precise</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile history trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors border border-white/5 cursor-pointer"
                  aria-label="Open history"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-zinc-900 border-white/5 p-0">
                <SheetTitle className="sr-only">Calculation History</SheetTitle>
                <HistoryPanel />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Calculator body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Display */}
          <div className="p-4 pb-0">
            <CalculatorDisplay />
          </div>

          {/* Mode tabs */}
          <div className="px-4 pt-4">
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as CalculatorMode)}
              className="w-full"
            >
              <TabsList className="w-full bg-zinc-800/80 h-10 rounded-xl p-1">
                <TabsTrigger
                  value="basic"
                  className="flex-1 rounded-lg text-sm data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    Basic
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="scientific"
                  className="flex-1 rounded-lg text-sm data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Atom className="w-3.5 h-3.5" />
                    Scientific
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Keyboard */}
          <div className="mt-3">
            <AnimatePresence mode="wait">
              {mode === 'basic' ? (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <BasicCalculator />
                </motion.div>
              ) : (
                <motion.div
                  key="scientific"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScientificCalculator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keyboard hint */}
          <div className="px-4 pb-3">
            <p className="text-[10px] text-zinc-600 text-center mt-1">
              Keyboard supported: 0-9, +−×÷, Enter, Esc, Backspace
            </p>
          </div>
        </motion.div>

        {/* Desktop history - side panel on large screens */}
        {/* We show it below on mobile via Sheet, on desktop we can add a floating panel */}
        <div className="hidden lg:block mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden max-h-72"
          >
            <HistoryPanel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
