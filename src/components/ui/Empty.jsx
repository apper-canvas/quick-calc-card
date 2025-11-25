import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  message = "There's nothing here yet. Get started by adding your first item.", 
  actionLabel = "Get Started", 
  onAction, 
  className = "" 
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-sky-100 to-primary-100 rounded-full mx-auto animate-pulse opacity-50"></div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 gradient-text">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>
        
        {onAction && (
          <div className="pt-2">
            <Button 
              onClick={onAction}
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              {actionLabel}
            </Button>
          </div>
        )}
        
        <div className="text-xs text-slate-400 pt-4">
          Start building your skydiving operation today
        </div>
      </div>
    </div>
  );
};

export default Empty;