import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const HistoryPanel = ({ history, isOpen, onToggle, onClearHistory }) => {
  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), "HH:mm")
    } catch {
      return "00:00"
    }
  }

  return (
    <>
      {/* Mobile toggle button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-3 rounded-xl shadow-lg transition-all duration-200"
      >
        <ApperIcon name={isOpen ? "X" : "History"} size={20} />
      </motion.button>

      {/* Desktop panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="hidden lg:block w-80 bg-white rounded-2xl shadow-xl border border-slate-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 font-sans flex items-center gap-2">
              <ApperIcon name="History" size={20} className="text-blue-500" />
              History
            </h3>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="Clear History"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            )}
          </div>

          <div className="space-y-3 history-scroll max-h-96 overflow-y-auto">
            <AnimatePresence>
              {history.length > 0 ? (
                history.map((calc) => (
                  <motion.div
                    key={calc.Id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="font-mono text-sm text-slate-700 mb-1">
                      {calc.firstOperand} {calc.operator} {calc.secondOperand} = {calc.result}
                    </div>
                    <div className="text-xs text-slate-500 font-sans">
                      {formatTime(calc.timestamp)}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-slate-500 font-sans"
                >
                  <ApperIcon name="Calculator" size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">No calculations yet</p>
                  <p className="text-xs mt-1">Start calculating to see history</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onToggle}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 font-sans flex items-center gap-2">
                    <ApperIcon name="History" size={20} className="text-blue-500" />
                    History
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Clear History"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-3 history-scroll overflow-y-auto">
                  <AnimatePresence>
                    {history.length > 0 ? (
                      history.map((calc) => (
                        <motion.div
                          key={calc.Id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100"
                        >
                          <div className="font-mono text-sm text-slate-700 mb-1">
                            {calc.firstOperand} {calc.operator} {calc.secondOperand} = {calc.result}
                          </div>
                          <div className="text-xs text-slate-500 font-sans">
                            {formatTime(calc.timestamp)}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-slate-500 font-sans"
                      >
                        <ApperIcon name="Calculator" size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-sm">No calculations yet</p>
                        <p className="text-xs mt-1">Start calculating to see history</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HistoryPanel