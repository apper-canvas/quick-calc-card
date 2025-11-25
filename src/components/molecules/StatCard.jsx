import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon, 
  iconColor = "sky",
  className = "" 
}) => {
  const changeColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50",
  };

  const iconColors = {
    sky: "text-sky-600 bg-gradient-to-br from-sky-100 to-sky-200",
    primary: "text-primary-600 bg-gradient-to-br from-primary-100 to-primary-200",
    amber: "text-amber-600 bg-gradient-to-br from-amber-100 to-amber-200",
    green: "text-green-600 bg-gradient-to-br from-green-100 to-green-200",
    purple: "text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200",
    red: "text-red-600 bg-gradient-to-br from-red-100 to-red-200",
  };

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-slate-300",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-800 gradient-text">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              changeColors[changeType]
            )}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                className="w-3 h-3 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            iconColors[iconColor]
          )}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;