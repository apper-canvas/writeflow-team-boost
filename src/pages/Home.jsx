import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [currentUser, setCurrentUser] = useState({ role: 'admin', name: 'Alex Chen', id: 'alex-chen' })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  // Toggle user role for demonstration
  const toggleUserRole = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'writer' : 'admin',
      name: prev.role === 'admin' ? 'Alex Chen' : 'Alex Chen',
      id: prev.role === 'admin' ? 'alex-chen' : 'admin'
    }))
  }



  const navigationItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', active: true },
    { name: 'Team & Writers', icon: 'Users', active: false },
    { name: 'Task Assignment', icon: 'ClipboardList', active: false },
    { name: 'Content Review', icon: 'FileText', active: false },
    { name: 'Performance', icon: 'TrendingUp', active: false },
    { name: 'Notifications', icon: 'Bell', active: false },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 writeflow-sidebar lg:translate-x-0 transform transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                <ApperIcon name="PenTool" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">WriteFlow</h1>
                <p className="text-xs text-surface-500">Team Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-surface-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-lg">AC</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-surface-500 capitalize">{currentUser.role}</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-surface-500">Online</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary border border-primary/20'
                    : 'text-surface-600 hover:bg-surface-100/80 hover:text-surface-900'
                }`}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Notifications' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-surface-200/50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-surface-600 hover:bg-surface-100/80 transition-all duration-200"
            >
              <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-md border-b border-surface-200/50 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Menu" className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
                <button
                  onClick={toggleUserRole}
                  className="px-3 py-1 text-xs font-medium rounded-full transition-colors
                    bg-primary/10 text-primary hover:bg-primary/20"
                  title="Toggle between Admin and Writer view for demo"
                >
                  Switch to {currentUser.role === 'admin' ? 'Writer' : 'Admin'}
                </button>
              </div>
              <p className="text-surface-500 text-sm">Welcome back, {currentUser.name}</p>


            </div>

            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors">
                <ApperIcon name="Search" className="w-5 h-5 text-surface-600" />
              </button>
              <button className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5 text-surface-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <MainFeature currentUser={currentUser} />
        </main>
      </div>
    </div>
  )
}

export default Home