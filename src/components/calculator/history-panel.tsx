'use client'

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function HistoryPanel() {
  const { history, applyHistoryItem, clearHistory } = useCalculatorStore()

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-foreground">History</h3>
          {history.length > 0 && (
            <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full font-medium">
              {history.length}
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          <AnimatePresence mode="popLayout">
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-14 text-zinc-600"
              >
                <Clock className="w-9 h-9 mb-2.5 opacity-25" />
                <p className="text-sm">No calculations yet</p>
                <p className="text-[11px] mt-1 opacity-50">Your history will appear here</p>
              </motion.div>
            ) : (
              history.map((item, index) => (
                <HistoryEntry
                  key={`${item.expression}-${item.result}-${index}`}
                  item={item}
                  onClick={() => applyHistoryItem(item)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

function HistoryEntry({ item, onClick }: { item: HistoryItem; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className="w-full group text-right px-3 py-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors cursor-pointer"
      aria-label={`Use result: ${item.result}`}
    >
      <p className="text-[11px] text-zinc-500 font-mono truncate group-hover:text-zinc-400 transition-colors">
        {item.expression}
      </p>
      <div className="flex items-center justify-end gap-1.5 mt-0.5">
        <p className="text-[0.95rem] font-bold text-foreground font-mono">{item.result}</p>
        <ArrowRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.button>
  )
}
