import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"

const CalculatorGrid = ({ onButtonClick, pressedButton }) => {
  const buttonConfig = [
    [
      { label: "AC", value: "AC", variant: "clear" },
      { label: "C", value: "C", variant: "secondary" },
      { label: "±", value: "±", variant: "secondary" },
      { label: "÷", value: "÷", variant: "primary" }
    ],
    [
      { label: "7", value: "7", variant: "default" },
      { label: "8", value: "8", variant: "default" },
      { label: "9", value: "9", variant: "default" },
      { label: "×", value: "×", variant: "primary" }
    ],
    [
      { label: "4", value: "4", variant: "default" },
      { label: "5", value: "5", variant: "default" },
      { label: "6", value: "6", variant: "default" },
      { label: "-", value: "-", variant: "primary" }
    ],
    [
      { label: "1", value: "1", variant: "default" },
      { label: "2", value: "2", variant: "default" },
      { label: "3", value: "3", variant: "default" },
      { label: "+", value: "+", variant: "primary" }
    ],
    [
      { label: "0", value: "0", variant: "default", className: "col-span-2" },
      { label: ".", value: ".", variant: "default" },
      { label: "=", value: "=", variant: "equals" }
    ]
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="grid grid-cols-4 gap-3 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg"
    >
      {buttonConfig.map((row, rowIndex) =>
        row.map((button, colIndex) => (
          <Button
            key={`${rowIndex}-${colIndex}`}
            variant={button.variant}
            size={button.className?.includes("col-span-2") ? "large" : "default"}
            className={button.className}
            onClick={() => onButtonClick(button.value)}
            pressed={pressedButton === button.value}
          >
            {button.label}
          </Button>
        ))
      )}
    </motion.div>
  )
}

export default CalculatorGrid