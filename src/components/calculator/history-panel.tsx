'use client' 

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, Copy, Check, Search, X, ArrowRight, Calculator, Atom, Sparkles } from 'lucide-react'
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
      <div className="px-5 pt-6 pb-4 flex-shrink-0 space-y-3 bg-gradient-to-b from-zinc-900/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <Clock className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">History</h3>
              {history.length > 0 && (
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                  {history.length} calculation{history.length !== 1 ? 's' : ''} saved
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
                className={`flex items-center gap-1.5 text-[11px] font-semibold transition-all cursor-pointer px-3 py-1.5 rounded-xl ${
                  confirmClear
                    ? 'text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 shadow-sm shadow-red-500/10'
                    : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmClear ? 'Confirm?' : 'Clear'}</span>
              </motion.button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-all cursor-pointer border border-transparent hover:border-white/[0.06]"
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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calculations..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-800/50 border border-white/[0.06] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/30 focus:bg-zinc-800/70 focus:ring-1 focus:ring-emerald-500/15 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/5 cursor-pointer transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ──── list ──── */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-zinc-600">
                {search ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-white/[0.04] flex items-center justify-center mb-4 shadow-lg">
                      <Search className="w-7 h-7 opacity-20" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-400">No matches found</p>
                    <p className="text-[11px] mt-1.5 opacity-50">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-white/[0.04] flex items-center justify-center mb-4 shadow-lg"
                    >
                      <Clock className="w-7 h-7 opacity-10" />
                    </motion.div>
                    <p className="text-sm font-semibold text-zinc-400">No calculations yet</p>
                    <p className="text-[11px] mt-1.5 opacity-50">Your results will appear here</p>
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
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {group.label}
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
                    </div>
                    <div className="space-y-1.5">
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
        <div className="px-5 py-3 border-t border-white/[0.04] bg-zinc-950/50 flex items-center justify-between">
          <p className="text-[10px] text-zinc-600 tabular-nums">
            {history.length} stored &middot; max 50
          </p>
          <p className="text-[10px] text-zinc-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500/40" />
            Tap to reuse
          </p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   HISTORY ENTRY — using div (not button) to avoid nested <button>
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="w-full text-left px-3.5 py-3 rounded-2xl bg-zinc-800/15 hover:bg-zinc-800/35 active:bg-white/[0.06] transition-all cursor-pointer border border-white/[0.04] hover:border-white/[0.08] group shadow-sm hover:shadow-md"
        aria-label={`Use result: ${item.result}`}
      >
        {/* top row: expression + badges */}
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[11px] text-zinc-500 font-mono truncate flex-1 leading-tight">
            {item.expression}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
              item.mode === 'scientific'
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                : 'bg-zinc-800/80 text-zinc-500 border border-white/[0.05]'
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
              className="p-1 rounded-lg hover:bg-white/[0.08] active:bg-white/[0.12] transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Copy result"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="c" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                    <Check className="w-3 h-3 text-emerald-400" />
                  </motion.div>
                ) : (
                  <motion.div key="p" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                    <Copy className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <ArrowRight className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* result row */}
        <div className="flex items-center gap-2 min-w-0">
          {/* exact form badge */}
          {item.exactForm && item.exactForm !== item.result && (
            <span className="text-[11px] font-semibold text-amber-400 font-mono truncate bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg flex-shrink-0 shadow-sm">
              {item.exactForm}
            </span>
          )}
          <p className="text-[1rem] font-bold text-white font-mono truncate tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {item.result}
          </p>
        </div>

        {/* timestamp */}
        {timeStr && (
          <p className="text-[9px] text-zinc-600 mt-2 font-mono pl-0.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 opacity-40" />
            {timeStr}
          </p>
        )}
      </div>
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
