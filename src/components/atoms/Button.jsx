import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  disabled = false,
  className = "", 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl focus:ring-primary-500",
    secondary: "border-2 border-sky-500 text-sky-600 hover:bg-sky-50 hover:border-sky-600 hover:text-sky-700 focus:ring-sky-500",
    accent: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl focus:ring-amber-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    ghost: "text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-500",
    link: "text-sky-600 hover:text-sky-700 underline-offset-4 hover:underline focus:ring-sky-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    icon: "p-2",
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;