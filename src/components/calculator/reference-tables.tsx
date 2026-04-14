'use client'
 
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check } from 'lucide-react' 
import { AnimatePresence } from 'framer-motion'

type TableTab = 'trig' | 'log' | 'constants' | 'powers' | 'convert'

const DEG_TO_RAD = Math.PI / 180

function fmt(n: number, d = 6): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(d).replace(/0+$/, '').replace(/\.$/, '')
}

/* ───── exact trig lookup ───── */
const exactTrig: Record<number, { sin: string; cos: string; tan: string }> = {
  0:   { sin: '0',     cos: '1',     tan: '0' },
  15:  { sin: '(√6−√2)/4', cos: '(√6+√2)/4', tan: '2−√3' },
  30:  { sin: '1/2',   cos: '√3/2',  tan: '√3/3' },
  45:  { sin: '√2/2', cos: '√2/2',  tan: '1' },
  60:  { sin: '√3/2', cos: '1/2',   tan: '√3' },
  75:  { sin: '(√6+√2)/4', cos: '(√6−√2)/4', tan: '2+√3' },
  90:  { sin: '1',     cos: '0',     tan: '∞' },
  120: { sin: '√3/2', cos: '-1/2',  tan: '-√3' },
  135: { sin: '√2/2', cos: '-√2/2', tan: '-1' },
  150: { sin: '1/2',  cos: '-√3/2', tan: '-√3/3' },
  180: { sin: '0',    cos: '-1',    tan: '0' },
  210: { sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
  225: { sin: '-√2/2', cos: '-√2/2', tan: '1' },
  240: { sin: '-√3/2', cos: '-1/2',  tan: '√3' },
  270: { sin: '-1',   cos: '0',     tan: '∞' },
  300: { sin: '-√3/2', cos: '1/2',   tan: '-√3' },
  315: { sin: '-√2/2', cos: '√2/2',  tan: '-1' },
  330: { sin: '-1/2', cos: '√3/2',  tan: '-√3/3' },
  360: { sin: '0',    cos: '1',     tan: '0' },
}

/* ═════════════ TRIG TABLE (card-based for mobile) ═════════════ */
function TrigTable() {
  const angles = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 270, 330, 360]

  return (
    <div className="space-y-1.5">
      {angles.map(deg => {
        const rad = deg * DEG_TO_RAD
        const e = exactTrig[deg]
        return (
          <motion.div
            key={deg}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-zinc-800/30 border border-white/[0.04] p-3 hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all"
          >
            {/* angle header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-emerald-400 tabular-nums">{deg}°</span>
              <span className="text-[11px] font-mono text-zinc-500 tabular-nums">{fmt(rad, 4)} rad</span>
            </div>

            {/* sin / cos / tan rows */}
            <div className="space-y-1.5">
              {(['sin', 'cos', 'tan'] as const).map(fn => {
                const exact = e?.[fn]
                const decimal = fn === 'tan' && Math.abs(Math.cos(rad)) < 1e-10
                  ? '∞'
                  : fmt(fn === 'sin' ? Math.sin(rad) : fn === 'cos' ? Math.cos(rad) : Math.tan(rad))
                return (
                  <div key={fn} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-zinc-500 w-6">{fn}</span>
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <span className="text-xs font-mono text-zinc-300 tabular-nums truncate">{decimal}</span>
                      {exact && exact !== decimal && (
                        <>
                          <span className="text-zinc-600 text-[10px]">→</span>
                          <span className="text-xs font-mono text-amber-400 font-semibold tabular-nums truncate bg-amber-500/5 px-1 rounded">
                            {exact}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═════════════ LOG TABLE (card-based) ═════════════ */
function LogTable() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 50, 100, 200, 500, 1000]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
      {values.map(n => (
        <div key={n} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] p-2.5 hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all">
          <span className="text-sm font-bold text-emerald-400 tabular-nums">{n}</span>
          <div className="mt-1.5 space-y-0.5">
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">log₁₀</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{fmt(Math.log10(n))}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">ln</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{fmt(Math.log(n))}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">log₂</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{fmt(Math.log2(n))}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">n²</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{(n * n).toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">√n</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{n === 1 ? '1' : fmt(Math.sqrt(n))}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═════════════ CONSTANTS TABLE (card list) ═════════════ */
function ConstantsTable() {
  const data = [
    { name: 'π (Pi)', value: fmt(Math.PI, 10), desc: 'Circle circumference / diameter' },
    { name: 'e (Euler)', value: fmt(Math.E, 10), desc: 'Base of natural logarithm' },
    { name: '√2', value: fmt(Math.SQRT2, 10), desc: 'Diagonal of unit square' },
    { name: '√3', value: fmt(Math.sqrt(3), 10), desc: 'Diagonal of unit cube face' },
    { name: 'φ (Golden)', value: fmt((1 + Math.sqrt(5)) / 2, 10), desc: 'Golden ratio (1+√5)/2' },
    { name: '√π', value: fmt(Math.sqrt(Math.PI), 10), desc: 'Gauss integral √π' },
    { name: 'ln(2)', value: fmt(Math.LN2, 10), desc: 'Natural log of 2' },
    { name: 'ln(10)', value: fmt(Math.LN10, 10), desc: 'Natural log of 10' },
    { name: 'log₁₀(2)', value: fmt(Math.LOG10E, 10), desc: 'Common log of e' },
    { name: '1/π', value: fmt(1 / Math.PI, 10), desc: 'Reciprocal of pi' },
    { name: 'π²', value: fmt(Math.PI * Math.PI, 10), desc: 'Pi squared' },
    { name: 'e²', value: fmt(Math.E * Math.E, 10), desc: 'Euler squared' },
  ]

  return (
    <div className="space-y-1.5">
      {data.map(r => (
        <div key={r.name} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] px-3 py-2.5 hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white whitespace-nowrap">{r.name}</span>
            <CopyableValue value={r.value} />
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">{r.desc}</p>
        </div>
      ))}
    </div>
  )
}

/* Copyable value component for constants */
function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer truncate flex items-center gap-1"
    >
      <span className="truncate">{value}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="ck" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="flex-shrink-0">
            <Check className="w-3 h-3" />
          </motion.span>
        ) : (
          <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="flex-shrink-0 opacity-50 group-hover:opacity-100">
            <Copy className="w-3 h-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ═════════════ POWERS TABLE (compact grid) ═════════════ */
function PowersTable() {
  const rows: { n: number; square: number; cube: number; sqrt: string; cbrt: string; fact: string }[] = []
  for (let n = 1; n <= 20; n++) {
    let f = 1
    for (let i = 2; i <= n; i++) f *= i
    rows.push({
      n, square: n * n, cube: n * n * n,
      sqrt: n === 1 ? '1' : fmt(Math.sqrt(n)),
      cbrt: fmt(Math.cbrt(n)),
      fact: f.toLocaleString(),
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
      {rows.map(r => (
        <div key={r.n} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] p-2.5 hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all">
          <span className="text-sm font-bold text-emerald-400 tabular-nums">n = {r.n}</span>
          <div className="mt-1.5 space-y-0.5">
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">n²</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{r.square.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">n³</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{r.cube.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">√n</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{r.sqrt}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">∛n</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{r.cbrt}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-[10px] text-zinc-500">n!</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{r.fact}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═════════════ CONVERSIONS TABLE (card sections) ═════════════ */
function ConvertTable() {
  const degRows = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360]
  const tempRows = [
    { c: -40, desc: 'Extreme cold' },
    { c: -10, desc: 'Freezing point (brine)' },
    { c: 0, desc: 'Water freezes' },
    { c: 20, desc: 'Room temp' },
    { c: 37, desc: 'Body temp' },
    { c: 100, desc: 'Water boils' },
    { c: 200, desc: 'Oven baking' },
    { c: 1000, desc: 'Red hot iron' },
  ]
  const cToF = (c: number) => c * 9 / 5 + 32
  const cToK = (c: number) => c + 273.15

  return (
    <div className="space-y-4">
      {/* Degrees ↔ Radians */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Degrees ↔ Radians</p>
        <div className="grid grid-cols-2 gap-1.5">
          {degRows.map(d => (
            <div key={d} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] px-3 py-2 flex items-center justify-between hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all">
              <span className="text-xs font-bold text-emerald-400 tabular-nums">{d}°</span>
              <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{fmt(d * DEG_TO_RAD, 6)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Temperature</p>
        <div className="space-y-1.5">
          {tempRows.map(r => (
            <div key={r.c} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] px-3 py-2.5 hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-white tabular-nums">{r.c}°C</span>
                <span className="text-[10px] text-zinc-500">{r.desc}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">{fmt(cToF(r.c), 1)}°F</span>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">{fmt(cToK(r.c), 1)} K</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common fractions */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Common Fractions</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ['1/2', 0.5], ['1/3', 1 / 3], ['2/3', 2 / 3], ['1/4', 0.25], ['3/4', 0.75],
            ['1/5', 0.2], ['1/6', 1 / 6], ['1/8', 0.125], ['1/10', 0.1], ['1/12', 1 / 12],
          ].map(([frac, dec]) => (
            <div key={frac as string} className="rounded-xl bg-zinc-800/30 border border-white/[0.04] px-2.5 py-2 text-center hover:bg-zinc-800/40 hover:border-white/[0.06] transition-all">
              <span className="text-xs font-mono font-semibold text-amber-400 tabular-nums">{frac as string}</span>
              <div className="mt-1">
                <span className="text-[11px] font-mono text-zinc-300 tabular-nums">{fmt(dec as number)}</span>
              </div>
              <span className="text-[10px] text-zinc-500 tabular-nums">{fmt((dec as number) * 100, 1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════ */
const tabs: { value: TableTab; label: string; icon: string }[] = [
  { value: 'trig', label: 'Trig', icon: '📐' },
  { value: 'log', label: 'Log', icon: '📊' },
  { value: 'constants', label: 'Const', icon: 'π' },
  { value: 'powers', label: 'Powers', icon: '⬆' },
  { value: 'convert', label: 'Conv', icon: '🔄' },
]

export function ReferenceTablesPanel() {
  const [tab, setTab] = useState<TableTab>('trig')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-0 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10">
            <span className="text-xs">📚</span>
          </div>
          <h3 className="text-sm font-bold text-white">Reference Tables</h3>
        </div>

        {/* scrollable tabs for mobile */}
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TableTab)} className="w-full">
            <TabsList className="w-full h-9 bg-zinc-800/40 rounded-lg p-0.5 border border-white/[0.04] min-w-max">
              {tabs.map(t => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="px-3.5 text-[11px] rounded-md h-8 data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap gap-1"
                >
                  <span className="text-[10px]">{t.icon}</span>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex-1 mt-3">
        <div className="px-4 pb-6">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'trig' && <TrigTable />}
            {tab === 'log' && <LogTable />}
            {tab === 'constants' && <ConstantsTable />}
            {tab === 'powers' && <PowersTable />}
            {tab === 'convert' && <ConvertTable />}
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
