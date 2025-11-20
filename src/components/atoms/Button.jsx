import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  pressed = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white hover:bg-gray-50 text-slate-700 border border-slate-200 shadow-sm",
    primary: "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-600 shadow-md",
    secondary: "bg-gradient-to-b from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white border border-slate-500 shadow-md",
    clear: "bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border border-orange-500 shadow-md",
    equals: "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-600 shadow-md"
  }

  const sizes = {
    default: "h-16 px-4 text-lg font-semibold rounded-xl",
    large: "h-20 px-6 text-xl font-bold rounded-xl col-span-2"
  }

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: pressed ? 0.95 : 1,
        filter: pressed ? "brightness(0.9)" : "brightness(1)"
      }}
      transition={{ duration: 0.1 }}
      className={cn(
        "relative font-mono transition-all duration-150 active:shadow-inner select-none touch-manipulation",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = "Button"

export default Button