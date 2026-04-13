'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type TableTab = 'trig' | 'log' | 'constants' | 'squares'

const DEG_TO_RAD = Math.PI / 180

function fmt(n: number, d = 6): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(d).replace(/0+$/, '').replace(/\.$/, '')
}

/* ───── data generators ───── */

const trigAngles = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 165, 180, 270, 360]

function getTrigTable() {
  return trigAngles.map(deg => ({
    deg,
    rad: fmt(deg * DEG_TO_RAD, 4),
    sin: fmt(Math.sin(deg * DEG_TO_RAD)),
    cos: fmt(Math.cos(deg * DEG_TO_RAD)),
    tan: Math.abs(Math.cos(deg * DEG_TO_RAD)) < 1e-10 ? '∞' : fmt(Math.tan(deg * DEG_TO_RAD)),
    cosec: Math.abs(Math.sin(deg * DEG_TO_RAD)) < 1e-10 ? '∞' : fmt(1 / Math.sin(deg * DEG_TO_RAD)),
    sec: Math.abs(Math.cos(deg * DEG_TO_RAD)) < 1e-10 ? '∞' : fmt(1 / Math.cos(deg * DEG_TO_RAD)),
    cot: Math.abs(Math.sin(deg * DEG_TO_RAD)) < 1e-10 ? '∞' : fmt(Math.cos(deg * DEG_TO_RAD) / Math.sin(deg * DEG_TO_RAD)),
  }))
}

function getLogTable() {
  const rows: { n: number; log10: string; ln: string; log2: string }[] = []
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50, 100, 200, 500, 1000]
  for (const n of values) {
    rows.push({
      n,
      log10: fmt(Math.log10(n)),
      ln: fmt(Math.log(n)),
      log2: fmt(Math.log2(n)),
    })
  }
  return rows
}

function getConstantsTable() {
  return [
    { name: 'π (Pi)', value: fmt(Math.PI, 10), approx: '3.14159265…' },
    { name: 'e (Euler)', value: fmt(Math.E, 10), approx: '2.71828182…' },
    { name: '√2', value: fmt(Math.SQRT2, 10), approx: '1.41421356…' },
    { name: '√3', value: fmt(Math.sqrt(3), 10), approx: '1.73205080…' },
    { name: 'φ (Golden)', value: fmt((1 + Math.sqrt(5)) / 2, 10), approx: '1.61803398…' },
    { name: '√π', value: fmt(Math.sqrt(Math.PI), 10), approx: '1.77245385…' },
    { name: 'ln(2)', value: fmt(Math.LN2, 10), approx: '0.69314718…' },
    { name: 'ln(10)', value: fmt(Math.LN10, 10), approx: '2.30258509…' },
    { name: 'log₁₀(2)', value: fmt(Math.LOG10E, 10), approx: '0.43429448…' },
    { name: '1/π', value: fmt(1 / Math.PI, 10), approx: '0.31830988…' },
  ]
}

function getSquaresTable() {
  const rows: { n: number; square: number; cube: number; sqrt: string; cbrt: string; factorial: string }[] = []
  for (let n = 1; n <= 15; n++) {
    rows.push({
      n,
      square: n * n,
      cube: n * n * n,
      sqrt: n === 1 ? '1' : fmt(Math.sqrt(n)),
      cbrt: fmt(Math.cbrt(n)),
      factorial: fmt(factorial(n)),
    })
  }
  return rows
}

function factorial(n: number): number {
  if (n <= 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/* ───── table styling ───── */
const thCls = 'text-[10px] font-semibold text-emerald-400 uppercase tracking-wider px-2 py-1.5 text-left whitespace-nowrap'
const tdCls = 'text-xs font-mono text-zinc-300 px-2 py-1.5 whitespace-nowrap tabular-nums'
const tdHighlight = 'text-xs font-mono text-amber-400 px-2 py-1.5 whitespace-nowrap tabular-nums font-semibold'
const rowCls = 'border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors'

/* ───── sub components ───── */

function TrigTable() {
  const data = getTrigTable()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>Angle</th>
            <th className={thCls}>Rad</th>
            <th className={thCls}>sin</th>
            <th className={thCls}>cos</th>
            <th className={thCls}>tan</th>
            <th className={thCls}>cosec</th>
            <th className={thCls}>sec</th>
            <th className={thCls}>cot</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.deg} className={rowCls}>
              <td className={tdHighlight}>{r.deg}°</td>
              <td className={tdCls}>{r.rad}</td>
              <td className={tdCls}>{r.sin}</td>
              <td className={tdCls}>{r.cos}</td>
              <td className={tdCls}>{r.tan}</td>
              <td className={tdCls}>{r.cosec}</td>
              <td className={tdCls}>{r.sec}</td>
              <td className={tdCls}>{r.cot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LogTable() {
  const data = getLogTable()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[340px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>n</th>
            <th className={thCls}>log₁₀(n)</th>
            <th className={thCls}>ln(n)</th>
            <th className={thCls}>log₂(n)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.n} className={rowCls}>
              <td className={tdHighlight}>{r.n}</td>
              <td className={tdCls}>{r.log10}</td>
              <td className={tdCls}>{r.ln}</td>
              <td className={tdCls}>{r.log2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ConstantsTable() {
  const data = getConstantsTable()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[340px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>Constant</th>
            <th className={thCls}>Value</th>
            <th className={thCls}>Approx</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.name} className={rowCls}>
              <td className="text-xs font-semibold text-zinc-200 px-2 py-1.5 whitespace-nowrap">{r.name}</td>
              <td className={tdCls}>{r.value}</td>
              <td className="text-xs text-zinc-500 px-2 py-1.5 whitespace-nowrap font-mono">{r.approx}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SquaresTable() {
  const data = getSquaresTable()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>n</th>
            <th className={thCls}>n²</th>
            <th className={thCls}>n³</th>
            <th className={thCls}>√n</th>
            <th className={thCls}>∛n</th>
            <th className={thCls}>n!</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.n} className={rowCls}>
              <td className={tdHighlight}>{r.n}</td>
              <td className={tdCls}>{r.square.toLocaleString()}</td>
              <td className={tdCls}>{r.cube.toLocaleString()}</td>
              <td className={tdCls}>{r.sqrt}</td>
              <td className={tdCls}>{r.cbrt}</td>
              <td className={tdCls}>{r.factorial.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════ */
export function ReferenceTablesPanel() {
  const [tab, setTab] = useState<TableTab>('trig')

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-4 pt-3 pb-0 flex-shrink-0">
        <h3 className="text-sm font-bold text-white mb-2.5">Reference Tables</h3>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TableTab)} className="w-full">
          <TabsList className="w-full h-8 bg-zinc-800/60 rounded-lg p-0.5 border border-white/[0.04]">
            <TabsTrigger value="trig" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
              Trig
            </TabsTrigger>
            <TabsTrigger value="log" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
              Log
            </TabsTrigger>
            <TabsTrigger value="constants" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
              Constants
            </TabsTrigger>
            <TabsTrigger value="squares" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
              Powers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* table content */}
      <ScrollArea className="flex-1 mt-2">
        <div className="px-4 pb-4">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'trig' && <TrigTable />}
            {tab === 'log' && <LogTable />}
            {tab === 'constants' && <ConstantsTable />}
            {tab === 'squares' && <SquaresTable />}
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
