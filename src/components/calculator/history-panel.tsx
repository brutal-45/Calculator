'use client'

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, ArrowRight, Copy, Check, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function HistoryPanel() {
  const { history, applyHistoryItem, clearHistory } = useCalculatorStore()
  const [search, setSearch] = useState('') 
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered = search.trim()
    ? history.filter(item =>
        item.expression.toLowerCase().includes(search.toLowerCase()) ||
        item.result.toLowerCase().includes(search.toLowerCase())
      )
    : history

  const handleClear = () => {
    if (confirmClear) {
      clearHistory()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 2500)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-4 pt-3 pb-2 border-b border-white/[0.05] flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-white">History</h3>
            {history.length > 0 && (
              <motion.span
                key={history.length}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded-full font-bold"
              >
                {history.length}
              </motion.span>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className={`flex items-center gap-1 text-[11px] transition-all cursor-pointer px-2 py-1 rounded-lg ${
                confirmClear
                  ? 'text-red-400 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20'
                  : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent'
              }`}
            >
              <Trash2 className="w-3 h-3" />
              <span>{confirmClear ? 'Confirm?' : 'Clear'}</span>
            </button>
          )}
        </div>

        {/* search */}
        {history.length > 3 && (
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full h-7 pl-7 pr-3 text-[11px] bg-zinc-800/40 border border-white/[0.05] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/30 focus:bg-zinc-800/60 focus:ring-1 focus:ring-emerald-500/15 transition-all"
            />
          </div>
        )}
      </div>

      {/* list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-14 text-zinc-600">
                {search ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/40 border border-white/[0.04] flex items-center justify-center mb-3">
                      <Search className="w-5 h-5 opacity-30" />
                    </div>
                    <p className="text-sm font-medium">No matches found</p>
                    <p className="text-[11px] mt-1 opacity-50">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-12 h-12 rounded-2xl bg-zinc-800/40 border border-white/[0.04] flex items-center justify-center mb-3"
                    >
                      <Clock className="w-5 h-5 opacity-20" />
                    </motion.div>
                    <p className="text-sm font-medium">No calculations yet</p>
                    <p className="text-[11px] mt-1 opacity-50">Results will appear here</p>
                  </>
                )}
              </motion.div>
            ) : (
              filtered.map((item, index) => (
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
        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.07] transition-all cursor-pointer border border-transparent hover:border-white/[0.03]"
        aria-label={`Use result: ${item.result}`}
      >
        {/* top row: expression + mode badge */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-[11px] text-zinc-500 font-mono truncate flex-1">
            {item.expression}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
              item.mode === 'scientific'
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/15'
                : 'bg-zinc-800/80 text-zinc-500 border border-white/[0.04]'
            }`}>
              {item.mode === 'scientific' ? 'SCI' : 'BAS'}
            </span>
            {/* copy — always visible on touch, hover on desktop */}
            <button onClick={handleCopy}
              className="lg:opacity-0 lg:group-hover:opacity-100 p-1 rounded-md hover:bg-white/5 active:bg-white/10 transition-all cursor-pointer"
              aria-label="Copy">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="c" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                    <Check className="w-3 h-3 text-emerald-400" />
                  </motion.div>
                ) : (
                  <motion.div key="p" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                    <Copy className="w-3 h-3 text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <ArrowRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* bottom row: result */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* exact form badge */}
          {item.exactForm && item.exactForm !== item.result && (
            <span className="text-[11px] font-semibold text-amber-400 font-mono truncate bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-md">
              {item.exactForm}
            </span>
          )}
          <p className="text-[0.95rem] font-bold text-white font-mono truncate" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {item.result}
          </p>
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
