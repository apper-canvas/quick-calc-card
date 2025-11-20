import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"

const Display = React.forwardRef(({ 
  className, 
  value = "0",
  operation = "",
  previousValue = "",
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-slate-200 rounded-2xl p-6 shadow-inner min-h-[120px] flex flex-col justify-end",
        className
      )}
      {...props}
    >
      {/* Previous calculation display */}
      <AnimatePresence mode="wait">
        {operation && previousValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-slate-500 font-mono text-right mb-1"
          >
            {previousValue} {operation}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main display */}
      <div className="text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.15 }}
            className="text-4xl md:text-5xl font-bold font-mono text-slate-800 break-all"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
})

Display.displayName = "Display"

export default Display