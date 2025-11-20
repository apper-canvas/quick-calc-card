import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"

const useCalculator = () => {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [pressedButton, setPressedButton] = useState("")

  const pressButton = useCallback((button) => {
    setPressedButton(button)
    setTimeout(() => setPressedButton(""), 150)
  }, [])

  const inputNumber = useCallback((number) => {
    if (waitingForNewValue) {
      setDisplay(String(number))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === "0" ? String(number) : display + number)
    }
  }, [display, waitingForNewValue])

  const inputDecimal = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay("0.")
      setWaitingForNewValue(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }, [display, waitingForNewValue])

  const clear = useCallback(() => {
    setDisplay("0")
  }, [])

  const allClear = useCallback(() => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }, [])

  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      if (newValue === null) {
        return null // Error occurred
      }

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  const calculate = useCallback((firstValue, secondValue, operation) => {
    try {
      let result
      switch (operation) {
        case "+":
          result = firstValue + secondValue
          break
        case "-":
          result = firstValue - secondValue
          break
        case "×":
          result = firstValue * secondValue
          break
        case "÷":
          if (secondValue === 0) {
            toast.error("Cannot divide by zero")
            return null
          }
          result = firstValue / secondValue
          break
        default:
          return secondValue
      }

      // Round to avoid floating point precision issues
      result = Math.round(result * 100000000) / 100000000
      
      // Check for overflow
      if (!isFinite(result)) {
        toast.error("Result is too large")
        return null
      }

      return result
    } catch (error) {
      toast.error("Calculation error")
      return null
    }
  }, [])

  const performCalculation = useCallback(() => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display)
      const newValue = calculate(previousValue, inputValue, operation)

      if (newValue !== null) {
        const calculation = {
          firstOperand: previousValue,
          operator: operation,
          secondOperand: inputValue,
          result: newValue
        }

        setDisplay(String(newValue))
        setPreviousValue(newValue)
        setOperation(null)
        setWaitingForNewValue(true)

        return calculation
      } else {
        // Reset on error
        allClear()
        return null
      }
    }
    return null
  }, [display, previousValue, operation, calculate, allClear])

  const toggleSign = useCallback(() => {
    if (display !== "0") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display)
    }
  }, [display])

  const handleButtonClick = useCallback((value) => {
    pressButton(value)

    if (value >= "0" && value <= "9") {
      inputNumber(parseInt(value))
    } else if (value === ".") {
      inputDecimal()
    } else if (value === "=") {
      return performCalculation()
    } else if (["+", "-", "×", "÷"].includes(value)) {
      performOperation(value)
    } else if (value === "C") {
      clear()
    } else if (value === "AC") {
      allClear()
    } else if (value === "±") {
      toggleSign()
    }

    return null
  }, [
    pressButton,
    inputNumber,
    inputDecimal,
    performCalculation,
    performOperation,
    clear,
    allClear,
    toggleSign
  ])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event
      
      // Prevent default for calculator keys to avoid page scrolling, etc.
      if ("0123456789.+-*/=cC".includes(key) || key === "Enter" || key === "Escape" || key === "Backspace") {
        event.preventDefault()
      }

      if (key >= "0" && key <= "9") {
        handleButtonClick(key)
      } else if (key === ".") {
        handleButtonClick(".")
      } else if (key === "+") {
        handleButtonClick("+")
      } else if (key === "-") {
        handleButtonClick("-")
      } else if (key === "*") {
        handleButtonClick("×")
      } else if (key === "/") {
        handleButtonClick("÷")
      } else if (key === "Enter" || key === "=") {
        handleButtonClick("=")
      } else if (key === "Escape") {
        handleButtonClick("AC")
      } else if (key === "Backspace") {
        handleButtonClick("C")
      } else if (key.toLowerCase() === "c") {
        handleButtonClick("C")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleButtonClick])

  return {
    display,
    operation,
    previousValue,
    pressedButton,
    handleButtonClick
  }
}

export default useCalculator