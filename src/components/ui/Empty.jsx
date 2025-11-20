import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet", 
  actionLabel = "Get Started", 
  onAction 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner"
        >
          <ApperIcon name="Calculator" size={36} className="text-slate-400" />
        </motion.div>

        <div className="space-y-3">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-slate-700 font-sans"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-sans leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        {onAction && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 font-sans"
          >
            <ApperIcon name="Plus" size={18} />
            {actionLabel}
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

export default Empty