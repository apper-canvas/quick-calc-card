import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Display from "@/components/atoms/Display"
import CalculatorGrid from "@/components/molecules/CalculatorGrid"
import HistoryPanel from "@/components/molecules/HistoryPanel"
import useCalculator from "@/hooks/useCalculator"
import calculationService from "@/services/api/calculationService"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"

const CalculatorInterface = () => {
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const {
    display,
    operation,
    previousValue,
    pressedButton,
    handleButtonClick
  } = useCalculator()

  const loadHistory = async () => {
    try {
      setError("")
      const data = await calculationService.getRecent(10)
      setHistory(data)
    } catch (err) {
      setError("Failed to load calculation history")
      console.error("Error loading history:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveCalculation = async (calculation) => {
    try {
      const saved = await calculationService.create(calculation)
      setHistory(prev => [saved, ...prev.slice(0, 9)]) // Keep only 10 recent
      toast.success(`${calculation.firstOperand} ${calculation.operator} ${calculation.secondOperand} = ${calculation.result}`)
    } catch (err) {
      console.error("Error saving calculation:", err)
      toast.error("Failed to save calculation to history")
    }
  }

  const clearHistory = async () => {
    try {
      // In a real app, you'd call a service method to clear server-side history
      setHistory([])
      toast.success("History cleared")
    } catch (err) {
      console.error("Error clearing history:", err)
      toast.error("Failed to clear history")
    }
  }

  const onCalculatorButtonClick = async (value) => {
    const result = handleButtonClick(value)
    if (result) {
      await saveCalculation(result)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadHistory} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Main Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col space-y-6 w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 font-sans mb-2">
                Quick Calc
              </h1>
              <p className="text-slate-600 font-sans">
                Simple calculator for everyday math
              </p>
            </div>

            {/* Display */}
            <Display 
              value={display}
              operation={operation}
              previousValue={previousValue}
            />

            {/* Button Grid */}
            <CalculatorGrid
              onButtonClick={onCalculatorButtonClick}
              pressedButton={pressedButton}
            />

            {/* Keyboard hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-center text-sm text-slate-500 font-sans"
            >
              💡 You can use your keyboard too!
            </motion.div>
          </motion.div>

          {/* History Panel */}
          <HistoryPanel
            history={history}
            isOpen={historyOpen}
            onToggle={() => setHistoryOpen(!historyOpen)}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  )
}

export default CalculatorInterface