import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className = "" 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    sky: "bg-gradient-to-r from-sky-100 to-sky-200 text-sky-800",
    amber: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    purple: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
    indigo: "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800",
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };
  
  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export default Badge;