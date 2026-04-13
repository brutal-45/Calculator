'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

/* ───── table styles ───── */
const thCls = 'text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2.5 py-2 text-left whitespace-nowrap'
const tdCls = 'text-xs font-mono text-zinc-300 px-2.5 py-2 whitespace-nowrap tabular-nums'
const tdExact = 'text-xs font-mono text-amber-400 px-2.5 py-2 whitespace-nowrap font-semibold tabular-nums'
const tdAngle = 'text-xs font-mono text-emerald-400 px-2.5 py-2 whitespace-nowrap font-bold tabular-nums'
const rowCls = 'border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors'

/* ═════════════ TRIG TABLE ═════════════ */
function TrigTable() {
  const angles = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 270, 330, 360]
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>Angle</th>
            <th className={thCls}>Rad</th>
            <th className={thCls}>sin</th>
            <th className={thCls}>cos</th>
            <th className={thCls}>tan</th>
            <th className={thCls}>Exact sin</th>
            <th className={thCls}>Exact cos</th>
            <th className={thCls}>Exact tan</th>
          </tr>
        </thead>
        <tbody>
          {angles.map(deg => {
            const rad = deg * DEG_TO_RAD
            const e = exactTrig[deg]
            return (
              <tr key={deg} className={rowCls}>
                <td className={tdAngle}>{deg}°</td>
                <td className={tdCls}>{fmt(rad, 4)}</td>
                <td className={tdCls}>{fmt(Math.sin(rad))}</td>
                <td className={tdCls}>{fmt(Math.cos(rad))}</td>
                <td className={tdCls}>{Math.abs(Math.cos(rad)) < 1e-10 ? '∞' : fmt(Math.tan(rad))}</td>
                <td className={tdExact}>{e?.sin ?? '—'}</td>
                <td className={tdExact}>{e?.cos ?? '—'}</td>
                <td className={tdExact}>{e?.tan ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ═════════════ LOG TABLE ═════════════ */
function LogTable() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 50, 100, 200, 500, 1000]
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>n</th>
            <th className={thCls}>log₁₀(n)</th>
            <th className={thCls}>ln(n)</th>
            <th className={thCls}>log₂(n)</th>
            <th className={thCls}>n²</th>
            <th className={thCls}>√n</th>
          </tr>
        </thead>
        <tbody>
          {values.map(n => (
            <tr key={n} className={rowCls}>
              <td className={tdAngle}>{n}</td>
              <td className={tdCls}>{fmt(Math.log10(n))}</td>
              <td className={tdCls}>{fmt(Math.log(n))}</td>
              <td className={tdCls}>{fmt(Math.log2(n))}</td>
              <td className={tdCls}>{(n * n).toLocaleString()}</td>
              <td className={tdCls}>{n === 1 ? '1' : fmt(Math.sqrt(n))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═════════════ CONSTANTS TABLE ═════════════ */
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px]">
        <thead>
          <tr className="border-b border-emerald-500/20">
            <th className={thCls}>Constant</th>
            <th className={thCls}>Value</th>
            <th className={thCls}>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.name} className={rowCls}>
              <td className="text-xs font-bold text-white px-2.5 py-2 whitespace-nowrap">{r.name}</td>
              <td className={tdCls}>{r.value}</td>
              <td className="text-[11px] text-zinc-500 px-2.5 py-2 whitespace-nowrap">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═════════════ POWERS TABLE ═════════════ */
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px]">
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
          {rows.map(r => (
            <tr key={r.n} className={rowCls}>
              <td className={tdAngle}>{r.n}</td>
              <td className={tdCls}>{r.square.toLocaleString()}</td>
              <td className={tdCls}>{r.cube.toLocaleString()}</td>
              <td className={tdCls}>{r.sqrt}</td>
              <td className={tdCls}>{r.cbrt}</td>
              <td className={tdCls}>{r.fact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═════════════ CONVERSIONS TABLE ═════════════ */
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
      {/* Degree → Radian */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Degrees ↔ Radians</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px]">
            <thead>
              <tr className="border-b border-emerald-500/20">
                <th className={thCls}>Degrees</th>
                <th className={thCls}>Radians</th>
              </tr>
            </thead>
            <tbody>
              {degRows.map(d => (
                <tr key={d} className={rowCls}>
                  <td className={tdAngle}>{d}°</td>
                  <td className={tdCls}>{fmt(d * DEG_TO_RAD, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temperature */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Temperature Conversions</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[380px]">
            <thead>
              <tr className="border-b border-emerald-500/20">
                <th className={thCls}>°C</th>
                <th className={thCls}>°F</th>
                <th className={thCls}>K</th>
                <th className={thCls}>Note</th>
              </tr>
            </thead>
            <tbody>
              {tempRows.map(r => (
                <tr key={r.c} className={rowCls}>
                  <td className={tdAngle}>{r.c}°</td>
                  <td className={tdCls}>{fmt(cToF(r.c), 1)}°</td>
                  <td className={tdCls}>{fmt(cToK(r.c), 1)}</td>
                  <td className="text-[11px] text-zinc-500 px-2.5 py-2">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common fractions */}
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">Common Fractions</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[240px]">
            <thead>
              <tr className="border-b border-emerald-500/20">
                <th className={thCls}>Fraction</th>
                <th className={thCls}>Decimal</th>
                <th className={thCls}>%</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1/2', 0.5], ['1/3', 1/3], ['2/3', 2/3], ['1/4', 0.25], ['3/4', 0.75],
                ['1/5', 0.2], ['1/6', 1/6], ['1/8', 0.125], ['1/10', 0.1], ['1/12', 1/12],
              ].map(([frac, dec]) => (
                <tr key={frac as string} className={rowCls}>
                  <td className={tdExact}>{frac as string}</td>
                  <td className={tdCls}>{fmt(dec as number)}</td>
                  <td className={tdCls}>{fmt((dec as number) * 100, 1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      <div className="px-4 pt-3 pb-0 flex-shrink-0">
        <h3 className="text-sm font-bold text-white mb-2.5">Reference Tables</h3>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TableTab)} className="w-full">
          <TabsList className="w-full h-8 bg-zinc-800/60 rounded-lg p-0.5 border border-white/[0.04]">
            <TabsTrigger value="trig" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Trig</TabsTrigger>
            <TabsTrigger value="log" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Log</TabsTrigger>
            <TabsTrigger value="constants" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Const</TabsTrigger>
            <TabsTrigger value="powers" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Powers</TabsTrigger>
            <TabsTrigger value="convert" className="flex-1 text-[10px] rounded-md h-7 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Conv</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 mt-2">
        <div className="px-4 pb-4">
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
