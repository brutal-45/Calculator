'use client'

import { useCalculatorStore, type HistoryItem } from '@/stores/calculator-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function HistoryPanel() {
  const { history, applyHistoryItem, clearHistory } = useCalculatorStore()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">History</h3>
          <span className="text-xs text-muted-foreground bg-zinc-800 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Clock className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No calculations yet</p>
                <p className="text-xs mt-1 opacity-60">Your history will appear here</p>
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
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full group text-right px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
      aria-label={`Use result: ${item.result}`}
    >
      <p className="text-xs text-muted-foreground font-mono truncate group-hover:text-zinc-300 transition-colors">
        {item.expression}
      </p>
      <div className="flex items-center justify-end gap-1.5 mt-0.5">
        <p className="text-base font-semibold text-foreground font-mono">
          {item.result}
        </p>
        <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.button>
  )
}
