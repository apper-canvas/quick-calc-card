import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  title = "Oops! Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-red-200 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 gradient-text">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>
        
        {onRetry && (
          <div className="pt-2">
            <Button 
              onClick={onRetry}
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
        
        <div className="text-xs text-slate-400 pt-4">
          If this problem persists, please contact support
        </div>
      </div>
    </div>
  );
};

export default ErrorView;