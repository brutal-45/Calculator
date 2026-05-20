'use client'

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, Copy, Check, Search, X, ArrowRight, Calculator, Atom } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

interface HistoryPanelProps {
  onClose?: () => void
}

export function HistoryPanel({ onClose }: HistoryPanelProps) {
  const { history, applyHistoryItem, clearHistory } = useCalculatorStore()
  const [search, setSearch] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered = useMemo(() =>
    search.trim()
      ? history.filter(item =>
          item.expression.toLowerCase().includes(search.toLowerCase()) ||
          item.result.toLowerCase().includes(search.toLowerCase()) ||
          (item.exactForm && item.exactForm.toLowerCase().includes(search.toLowerCase()))
        )
      : history
  , [history, search])

  // Group by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: HistoryItem[] }[] = []
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 86400000)

    filtered.forEach(item => {
      if (!item.createdAt) return
      const d = new Date(item.createdAt)
      let label: string
      if (d >= today) label = 'Today'
      else if (d >= yesterday) label = 'Yesterday'
      else label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })

      const existing = groups.find(g => g.label === label)
      if (existing) existing.items.push(item)
      else groups.push({ label, items: [item] })
    })
    return groups
  }, [filtered])

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
      {/* ──── header ──── */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0 space-y-3 border-b border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/15">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">History</h3>
              {history.length > 0 && (
                <p className="text-[10px] text-zinc-500 -mt-0.5">
                  {history.length} calculation{history.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <motion.button
                key={confirmClear ? 'confirm' : 'clear'}
                initial={confirmClear ? { scale: 0.9 } : {}}
                animate={{ scale: 1 }}
                onClick={handleClear}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-all cursor-pointer px-2.5 py-1.5 rounded-lg ${
                  confirmClear
                    ? 'text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/25'
                    : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent'
                }`}
              >
                <Trash2 className="w-3 h-3" />
                <span>{confirmClear ? 'Confirm?' : 'Clear'}</span>
              </motion.button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* search */}
        {history.length > 2 && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calculations..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-800/40 border border-white/[0.05] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/30 focus:bg-zinc-800/60 focus:ring-1 focus:ring-emerald-500/15 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ──── list ──── */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-zinc-600">
                {search ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800/40 border border-white/[0.04] flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 opacity-25" />
                    </div>
                    <p className="text-sm font-medium text-zinc-400">No matches found</p>
                    <p className="text-[11px] mt-1 opacity-60">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-14 h-14 rounded-2xl bg-zinc-800/40 border border-white/[0.04] flex items-center justify-center mb-3"
                    >
                      <Clock className="w-6 h-6 opacity-15" />
                    </motion.div>
                    <p className="text-sm font-medium text-zinc-400">No calculations yet</p>
                    <p className="text-[11px] mt-1 opacity-60">Your results will appear here</p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Ungrouped items (no createdAt) */}
                {filtered.filter(i => !i.createdAt).map((item, index) => (
                  <HistoryEntry key={`no-date-${index}`} item={item} onClick={() => applyHistoryItem(item)} />
                ))}
                {/* Grouped items */}
                {grouped.map(group => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-1">
                      {group.label}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item, index) => (
                        <HistoryEntry
                          key={`${item.id || ''}-${item.expression}-${index}`}
                          item={item}
                          onClick={() => applyHistoryItem(item)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* ──── footer stats ──── */}
      {history.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-center">
          <p className="text-[10px] text-zinc-600 tabular-nums">
            {history.length} stored · max 50 · tap to reuse
          </p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   HISTORY ENTRY
   ═══════════════════════════════════════ */
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
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClick}
        className="w-full text-left px-3 py-3 rounded-xl bg-zinc-800/20 hover:bg-zinc-800/40 active:bg-white/[0.06] transition-all cursor-pointer border border-white/[0.03] hover:border-white/[0.06] group"
        aria-label={`Use result: ${item.result}`}
      >
        {/* top row: expression + badges */}
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-[11px] text-zinc-500 font-mono truncate flex-1 leading-tight">
            {item.expression}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
              item.mode === 'scientific'
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/15'
                : 'bg-zinc-800/80 text-zinc-500 border border-white/[0.04]'
            }`}>
              {item.mode === 'scientific' ? (
                <><Atom className="w-2.5 h-2.5" />SCI</>
              ) : (
                <><Calculator className="w-2.5 h-2.5" />BAS</>
              )}
            </span>

            {/* copy button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-white/5 active:bg-white/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Copy"
            >
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

        {/* result row */}
        <div className="flex items-center gap-2 min-w-0">
          {/* exact form badge */}
          {item.exactForm && item.exactForm !== item.result && (
            <span className="text-[11px] font-semibold text-amber-400 font-mono truncate bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {item.exactForm}
            </span>
          )}
          <p className="text-[0.95rem] font-bold text-white font-mono truncate" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {item.result}
          </p>
        </div>

        {/* timestamp */}
        {timeStr && (
          <p className="text-[9px] text-zinc-600 mt-1.5 font-mono pl-0.5">{timeStr}</p>
        )}
      </button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   TIME FORMATTING
   ═══════════════════════════════════════ */
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
