import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-sky-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Plane" className="w-12 h-12 text-primary-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-sky-200 to-primary-200 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-slate-800 gradient-text">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-600 leading-relaxed">
            Looks like this page took an unexpected flight path. The page you're looking for doesn't exist or has been moved to a different altitude.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            variant="primary"
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            Return to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate("/event-calendar")}
              variant="secondary"
              className="flex-1 inline-flex items-center justify-center gap-2"
            >
              <ApperIcon name="Calendar" className="w-4 h-4" />
              Events
            </Button>
            <Button 
              onClick={() => navigate("/users")}
              variant="secondary" 
              className="flex-1 inline-flex items-center justify-center gap-2"
            >
              <ApperIcon name="Users" className="w-4 h-4" />
              Users
            </Button>
          </div>

          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Need help? Contact your system administrator or check the documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;