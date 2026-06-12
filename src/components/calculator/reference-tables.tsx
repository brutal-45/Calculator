'use client' 

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check, BookOpen } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

type TableTab = 'trig' | 'log' | 'constants' | 'powers' | 'convert'

const DEG_TO_RAD = Math.PI / 180

function fmt(n: number, d = 6): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(d).replace(/0+$/, '').replace(/\.$/, '')
}

/* ───── exact trig ───── */
const exactTrig: Record<number, { sin: string; cos: string; tan: string }> = {
  0:   { sin: '0',     cos: '1',     tan: '0' },
  30:  { sin: '1/2',   cos: '√3/2',  tan: '√3/3' },
  45:  { sin: '√2/2', cos: '√2/2',  tan: '1' },
  60:  { sin: '√3/2', cos: '1/2',   tan: '√3' },
  90:  { sin: '1',     cos: '0',     tan: '∞' },
  180: { sin: '0',    cos: '-1',    tan: '0' },
  270: { sin: '-1',   cos: '0',     tan: '∞' },
  360: { sin: '0',    cos: '1',     tan: '0' },
}

/* ═════════════ TRIG ═════════════ */
function TrigTable() {
  const angles = [0, 30, 45, 60, 90, 180, 270, 360]
  return (
    <div className="space-y-1.5">
      {angles.map(deg => {
        const rad = deg * DEG_TO_RAD
        const e = exactTrig[deg]
        return (
          <motion.div
            key={deg}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-400 tabular-nums">{deg}°</span>
              <span className="text-[10px] font-mono text-zinc-500 tabular-nums">{fmt(rad, 4)} rad</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['sin', 'cos', 'tan'] as const).map(fn => (
                <div key={fn}>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-600">{fn}</p>
                  <p className="text-[11px] font-mono text-white tabular-nums">{e?.[fn]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═════════════ LOG ═════════════ */
function LogTable() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000]
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {values.map(n => (
        <motion.div
          key={n}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2"
        >
          <p className="text-xs font-bold text-emerald-400 tabular-nums mb-1">{n}</p>
          <div className="space-y-0.5">
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">log₁₀</span><span className="text-[10px] font-mono text-white tabular-nums">{fmt(Math.log10(n))}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">ln</span><span className="text-[10px] font-mono text-white tabular-nums">{fmt(Math.log(n))}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">log₂</span><span className="text-[10px] font-mono text-white tabular-nums">{fmt(Math.log2(n))}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">n²</span><span className="text-[10px] font-mono text-white tabular-nums">{n * n}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">√n</span><span className="text-[10px] font-mono text-white tabular-nums">{n === 1 ? '1' : fmt(Math.sqrt(n))}</span></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ═════════════ CONSTANTS ═════════════ */
function ConstantsTable() {
  const data = [
    { name: 'π (Pi)', value: fmt(Math.PI, 10) },
    { name: 'e (Euler)', value: fmt(Math.E, 10) },
    { name: '√2', value: fmt(Math.SQRT2, 10) },
    { name: '√3', value: fmt(Math.sqrt(3), 10) },
    { name: 'φ (Golden)', value: fmt((1 + Math.sqrt(5)) / 2, 10) },
    { name: '√π', value: fmt(Math.sqrt(Math.PI), 10) },
    { name: 'ln(2)', value: fmt(Math.LN2, 10) },
    { name: 'ln(10)', value: fmt(Math.LN10, 10) },
    { name: '1/π', value: fmt(1 / Math.PI, 10) },
    { name: 'π²', value: fmt(Math.PI * Math.PI, 10) },
    { name: 'e²', value: fmt(Math.E * Math.E, 10) },
  ]
  return (
    <div className="space-y-1.5">
      {data.map(r => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2 group"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-white">{r.name}</span>
            <CopyableValue value={r.value} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }
  return (
    <button onClick={handleCopy} className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1">
      <span className="truncate">{value}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="ck" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}><Check className="w-2.5 h-2.5" /></motion.span>
        ) : (
          <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="opacity-0 group-hover:opacity-100"><Copy className="w-2.5 h-2.5" /></motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ═════════════ POWERS ═════════════ */
function PowersTable() {
  const rows = []
  for (let n = 1; n <= 10; n++) {
    let f = 1; for (let i = 2; i <= n; i++) f *= i
    rows.push({ n, sq: n * n, cb: n * n * n, sqrt: n === 1 ? '1' : fmt(Math.sqrt(n)), cbrt: fmt(Math.cbrt(n)), fact: f.toLocaleString() })
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
      {rows.map(r => (
        <motion.div
          key={r.n}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2"
        >
          <p className="text-xs font-bold text-emerald-400 tabular-nums mb-1">n = {r.n}</p>
          <div className="space-y-0.5">
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">n²</span><span className="text-[10px] font-mono text-white tabular-nums">{r.sq}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">n³</span><span className="text-[10px] font-mono text-white tabular-nums">{r.cb}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">√n</span><span className="text-[10px] font-mono text-white tabular-nums">{r.sqrt}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">∛n</span><span className="text-[10px] font-mono text-white tabular-nums">{r.cbrt}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-zinc-600">n!</span><span className="text-[10px] font-mono text-white tabular-nums">{r.fact}</span></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ═════════════ CONVERT ═════════════ */
function ConvertTable() {
  const cToF = (c: number) => c * 9 / 5 + 32
  const cToK = (c: number) => c + 273.15
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Degrees → Radians</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 30, 45, 60, 90, 180, 270, 360].map(d => (
            <div key={d} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 tabular-nums">{d}°</span>
              <span className="text-[10px] font-mono text-white tabular-nums">{fmt(d * DEG_TO_RAD, 6)}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Temperature</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { c: -40 }, { c: 0 }, { c: 20 }, { c: 37 }, { c: 100 },
          ].map(r => (
            <div key={r.c} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-1.5">
              <p className="text-[11px] font-bold text-white tabular-nums">{r.c}°C</p>
              <p className="text-[10px] font-mono text-zinc-400 tabular-nums">{fmt(cToF(r.c), 1)}°F · {fmt(cToK(r.c), 1)} K</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Common Fractions</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ['1/2', 0.5], ['1/3', 1/3], ['2/3', 2/3], ['1/4', 0.25], ['3/4', 0.75],
            ['1/5', 0.2], ['1/6', 1/6], ['1/8', 0.125], ['1/10', 0.1],
          ].map(([frac, dec]) => (
            <div key={frac as string} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-2 py-1.5 text-center">
              <p className="text-[11px] font-mono font-semibold text-amber-400 tabular-nums">{frac as string}</p>
              <p className="text-[10px] font-mono text-white tabular-nums">{fmt(dec as number)}</p>
              <p className="text-[9px] text-zinc-500 tabular-nums">{fmt((dec as number) * 100, 1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════ */
const tabs: { value: TableTab; label: string }[] = [
  { value: 'trig', label: 'Trig' },
  { value: 'log', label: 'Log' },
  { value: 'constants', label: 'Constants' },
  { value: 'powers', label: 'Powers' },
  { value: 'convert', label: 'Convert' },
]

export function ReferenceTablesPanel() {
  const [tab, setTab] = useState<TableTab>('trig')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Reference Tables</h3>
        </div>
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TableTab)} className="w-full">
            <TabsList className="w-full h-8 bg-zinc-800/40 rounded-lg p-0.5 border border-white/[0.04] min-w-max">
              {tabs.map(t => (
                <TabsTrigger key={t.value} value={t.value}
                  className="px-3 text-[11px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white transition-all whitespace-nowrap font-medium">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex-1 mt-3">
        <div className="px-4 pb-6">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
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
