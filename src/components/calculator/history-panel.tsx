'use client'

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, ArrowRight, Copy, Check, X, Calculator, Atom } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

export function HistoryPanel() {
  const { history, applyHistoryItem, clearHistory } = useCalculatorStore()

  const handleClear = () => { clearHistory() }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-white">History</h3>
          {history.length > 0 && (
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-bold">
              {history.length}
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button onClick={handleClear}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-500/10">
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          <AnimatePresence mode="popLayout">
            {history.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-14 text-zinc-600">
                <Clock className="w-9 h-9 mb-2.5 opacity-20" />
                <p className="text-sm font-medium">No calculations yet</p>
                <p className="text-[11px] mt-1 opacity-50">Results will appear here</p>
              </motion.div>
            ) : (
              history.map((item, index) => (
                <HistoryEntry key={`${item.id || ''}-${item.expression}-${index}`}
                  item={item} onClick={() => applyHistoryItem(item)} />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

function HistoryEntry({ item, onClick }: { item: HistoryItem; onClick: () => void }) {
  const [copied, setCopied] = useState(false)
  const timeStr = item.createdAt ? formatTime(item.createdAt) : null

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = item.exactForm ? `${item.exactForm} = ${item.result}` : `${item.result}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="group relative"
    >
      <button
        onClick={onClick}
        className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors cursor-pointer"
        aria-label={`Use result: ${item.result}`}
      >
        {/* top row: expression + mode badge */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-[11px] text-zinc-500 font-mono truncate group-hover:text-zinc-400 transition-colors flex-1 text-left">
            {item.expression}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
              item.mode === 'scientific'
                ? 'bg-violet-500/10 text-violet-400'
                : 'bg-zinc-800 text-zinc-500'
            }`}>
              {item.mode === 'scientific' ? 'SCI' : 'BAS'}
            </span>
          </div>
        </div>

        {/* bottom row: result */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* exact form badge */}
            {item.exactForm && item.exactForm !== item.result && (
              <span className="text-[11px] font-semibold text-amber-400 font-mono truncate bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                {item.exactForm}
              </span>
            )}
            <p className="text-[0.95rem] font-bold text-white font-mono truncate" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {item.result}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {/* copy button */}
            <button onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Copy">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
            </button>
            {/* arrow */}
            <ArrowRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* timestamp */}
        {timeStr && (
          <p className="text-[9px] text-zinc-600 mt-1 font-mono">{timeStr}</p>
        )}
      </button>
    </motion.div>
  )
}

function formatTime(isoStr: string): string {
  try {
    const d = new Date(isoStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 172800000) return 'yesterday'

    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}
