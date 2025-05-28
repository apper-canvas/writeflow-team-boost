import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center"
            >
              <ApperIcon name="FileX" className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-6xl font-bold text-gradient">404</h1>
            <h2 className="text-2xl font-semibold text-surface-900">Page Not Found</h2>
            <p className="text-surface-600 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/"
              className="writeflow-button-primary inline-flex items-center space-x-2"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound