import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Toggle = forwardRef(({ 
  label,
  error,
  required = false,
  disabled = false,
  checked,
  defaultChecked,
  onChange,
  className = "",
  id,
  ...props 
}, ref) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={toggleId} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center">
        <button
          ref={ref}
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={(e) => {
            if (onChange) {
              const newChecked = !checked;
              const event = { target: { checked: newChecked, value: newChecked } };
              onChange(event);
            }
          }}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            checked 
              ? "bg-gradient-to-r from-primary-600 to-primary-700" 
              : "bg-slate-300",
            disabled && "opacity-50 cursor-not-allowed",
            error && "focus:ring-red-500",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;