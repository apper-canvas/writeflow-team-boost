import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import TaskModal from './TaskModal'
import WriterModal from './WriterModal'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { filterTasksByRole, calculateRoleBasedStats, getWeeklyPerformance, getPendingReviews } from '../utils/roleUtils'

const MainFeature = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [tasks, setTasks] = useState([])
  const [writers, setWriters] = useState([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showWriterModal, setShowWriterModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Initialize sample data
  useEffect(() => {
    const sampleTasks = [
      {
        id: '1',
        title: 'Blog Post: AI in Content Marketing',
        description: 'Write a comprehensive guide about AI tools in content marketing',
        wordCount: 2000,
        deadline: addDays(new Date(), 3),
        assignedTo: 'sarah-wilson',
        status: 'in-progress',
        tags: ['blog', 'ai', 'marketing'],
        createdBy: 'admin',
        createdAt: new Date(),
        submittedAt: null,
        reviewedAt: null
      },
      {
        id: '2',
        title: 'Social Media Copy - Product Launch',
        description: 'Create engaging social media posts for new product launch',
        wordCount: 500,
        deadline: addDays(new Date(), 1),
        assignedTo: 'mike-chen',
        status: 'pending',
        tags: ['social-media', 'product-launch'],
        createdBy: 'admin',
        createdAt: new Date(),
        submittedAt: null,
        reviewedAt: null
      },
      {
        id: '3',
        title: 'Email Newsletter - Weekly Roundup',
        description: 'Write weekly newsletter with industry insights',
        wordCount: 800,
        deadline: addDays(new Date(), 2),
        assignedTo: 'sarah-wilson',
        status: 'submitted',
        tags: ['newsletter', 'email'],
        createdBy: 'admin',
        createdAt: addDays(new Date(), -5),
        submittedAt: addDays(new Date(), -1),
        reviewedAt: null
      },
      {
        id: '4',
        title: 'Product Description - New Features',
        description: 'Create compelling product descriptions for new feature set',
        wordCount: 1200,
        deadline: addDays(new Date(), 4),
        assignedTo: 'sarah-wilson',
        status: 'in-review',
        tags: ['product', 'features'],
        createdBy: 'admin',
        createdAt: addDays(new Date(), -3),
        submittedAt: addDays(new Date(), -1),
        reviewedAt: new Date()
      }
    ]

    const sampleWriters = [
      {
        id: 'sarah-wilson',
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        role: 'writer',
        bio: 'Experienced content writer specializing in tech and marketing',
        expertise: ['Blog Writing', 'Technical Content', 'SEO'],
        status: 'active',
        teamTags: ['blog', 'technical'],
        performance: { 
          completedTasks: 24, 
          totalWordCount: 48000, 
          deadlinesMet: 22, 
          averageRating: 4.8,
          weeklyWordCount: 3200,
          weeklyTasksCompleted: 2
        }
      },
      {
        id: 'mike-chen',
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'writer',
        bio: 'Creative copywriter with social media expertise',
        expertise: ['Social Media', 'Creative Copy', 'Brand Voice'],
        status: 'active',
        teamTags: ['social-media', 'creative'],
        performance: { 
          completedTasks: 18, 
          totalWordCount: 32000, 
          deadlinesMet: 17, 
          averageRating: 4.6,
          weeklyWordCount: 1800,
          weeklyTasksCompleted: 3
        }
      },
      {
        id: currentUser.role === 'writer' ? 'alex-chen' : 'admin',
        name: currentUser.name,
        email: currentUser.role === 'writer' ? 'alex@company.com' : 'admin@company.com',
        role: currentUser.role,
        bio: currentUser.role === 'writer' ? 'Content writer focused on technical documentation' : 'Team manager and content strategist',
        expertise: currentUser.role === 'writer' ? ['Technical Writing', 'Documentation', 'API Guides'] : ['Team Management', 'Content Strategy'],
        status: 'active',
        teamTags: currentUser.role === 'writer' ? ['technical', 'documentation'] : ['management'],
        performance: currentUser.role === 'writer' ? {
          completedTasks: 15,
          totalWordCount: 28000,
          deadlinesMet: 14,
          averageRating: 4.7,
          weeklyWordCount: 2100,
          weeklyTasksCompleted: 1
        } : {
          completedTasks: 0,
          totalWordCount: 0,
          deadlinesMet: 0,
          averageRating: 0,
          weeklyWordCount: 0,
          weeklyTasksCompleted: 0
        }
      }
    ]

    // Add current user's tasks if they're a writer
    if (currentUser.role === 'writer') {
      const userTasks = [
        {
          id: '5',
          title: 'API Documentation Update',
          description: 'Update REST API documentation with new endpoints',
          wordCount: 1500,
          deadline: addDays(new Date(), 5),
          assignedTo: 'alex-chen',
          status: 'in-progress',
          tags: ['documentation', 'api'],
          createdBy: 'admin',
          createdAt: addDays(new Date(), -2),
          submittedAt: null,
          reviewedAt: null
        },
        {
          id: '6',
          title: 'User Guide - Advanced Features',
          description: 'Create comprehensive user guide for advanced platform features',
          wordCount: 2500,
          deadline: addDays(new Date(), 7),
          assignedTo: 'alex-chen',
          status: 'pending',
          tags: ['user-guide', 'features'],
          createdBy: 'admin',
          createdAt: new Date(),
          submittedAt: null,
          reviewedAt: null
        }
      ]
      sampleTasks.push(...userTasks)
    }

    setTasks(sampleTasks)
    setWriters(sampleWriters)
  }, [currentUser])

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'submitted': 'bg-purple-100 text-purple-800 border-purple-200',
      'in-review': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'needs-revision': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      createdBy: currentUser.name,
      createdAt: new Date(),
      submittedAt: null,
      reviewedAt: null
    }
    setTasks([...tasks, newTask])
    setShowTaskModal(false)
    toast.success('Task created successfully!')
  }

  const handleCreateWriter = (writerData) => {
    const newWriter = {
      id: Date.now().toString(),
      ...writerData,
      role: 'writer',
      status: 'active',
      performance: { 
        completedTasks: 0, 
        totalWordCount: 0, 
        deadlinesMet: 0, 
        averageRating: 0,
        weeklyWordCount: 0,
        weeklyTasksCompleted: 0
      }
    }
    setWriters([...writers, newWriter])
    setShowWriterModal(false)
    toast.success('Writer added successfully!')
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus }
        if (newStatus === 'submitted' && !task.submittedAt) {
          updatedTask.submittedAt = new Date()
        }
        if (newStatus === 'in-review' && !task.reviewedAt) {
          updatedTask.reviewedAt = new Date()
        }
        return updatedTask
      }
      return task
    }))
    toast.success(`Task status updated to ${newStatus.replace('-', ' ')}`)
  }

  const getWriterName = (writerId) => {
    const writer = writers.find(w => w.id === writerId)
    return writer ? writer.name : 'Unassigned'
  }

  // Role-based data filtering
  const visibleTasks = filterTasksByRole(tasks, currentUser)
  const statsData = calculateRoleBasedStats(visibleTasks, writers, currentUser)
  const weeklyPerformance = getWeeklyPerformance(visibleTasks, writers, currentUser)
  const pendingReviews = getPendingReviews(visibleTasks, currentUser)

  // Role-based writers list
  const visibleWriters = currentUser.role === 'admin' 
    ? writers.filter(w => w.role === 'writer')
    : writers.filter(w => w.id === currentUser.id || w.role === 'admin')

  return (
    <div className="space-y-6">
      {/* Role-Based Welcome Message */}
      <div className="writeflow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-surface-900">
              {currentUser.role === 'admin' ? 'Team Dashboard' : 'My Dashboard'}
            </h2>
            <p className="text-surface-600 mt-1">
              {currentUser.role === 'admin' 
                ? 'Manage your writing team and track overall performance'
                : 'Track your tasks, deadlines, and writing performance'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentUser.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {currentUser.role === 'admin' ? 'Team Manager' : 'Writer'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { 
            label: currentUser.role === 'admin' ? 'Total Tasks' : 'My Tasks', 
            value: statsData.totalTasks, 
            icon: 'ClipboardList', 
            color: 'from-blue-500 to-blue-600' 
          },
          { 
            label: currentUser.role === 'admin' ? 'Active Tasks' : 'Active', 
            value: statsData.activeTasks, 
            icon: 'Clock', 
            color: 'from-amber-500 to-amber-600' 
          },
          { 
            label: currentUser.role === 'admin' ? 'Pending Reviews' : 'Submitted', 
            value: currentUser.role === 'admin' ? pendingReviews.length : statsData.submittedTasks, 
            icon: currentUser.role === 'admin' ? 'Eye' : 'Send', 
            color: 'from-indigo-500 to-indigo-600' 
          },
          { 
            label: currentUser.role === 'admin' ? 'Active Writers' : 'Completed', 
            value: currentUser.role === 'admin' ? statsData.activeWriters : statsData.completedTasks, 
            icon: currentUser.role === 'admin' ? 'Users' : 'CheckCircle', 
            color: currentUser.role === 'admin' ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="writeflow-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Performance Snapshot */}
      <div className="writeflow-card p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          {currentUser.role === 'admin' ? 'Team Weekly Performance' : 'My Weekly Performance'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{weeklyPerformance.totalWords.toLocaleString()}</div>
            <div className="text-sm text-surface-600 mt-1">Words Written</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{weeklyPerformance.tasksCompleted}</div>
            <div className="text-sm text-surface-600 mt-1">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{weeklyPerformance.averageRating.toFixed(1)}/5</div>
            <div className="text-sm text-surface-600 mt-1">Average Rating</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-surface-500 text-center">
          Week of {format(startOfWeek(new Date()), 'MMM dd')} - {format(endOfWeek(new Date()), 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="writeflow-card p-2">
        <div className="flex flex-wrap space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
            { id: 'tasks', label: currentUser.role === 'admin' ? 'All Tasks' : 'My Tasks', icon: 'ClipboardList' },
            ...(currentUser.role === 'admin' ? [{ id: 'writers', label: 'Writers', icon: 'Users' }] : []),
            { id: 'performance', label: 'Performance', icon: 'TrendingUp' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary border border-primary/20'
                  : 'text-surface-600 hover:bg-surface-100/80'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Recent/Active Tasks */}
              <div className="writeflow-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">
                  {currentUser.role === 'admin' ? 'Recent Tasks' : 'My Active Tasks'}
                </h3>
                <div className="space-y-4">
                  {visibleTasks.filter(t => currentUser.role === 'writer' ? ['pending', 'in-progress'].includes(t.status) : true)
                    .slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900 truncate">{task.title}</h4>
                        <p className="text-sm text-surface-600">
                          {currentUser.role === 'admin' 
                            ? `Assigned to ${getWriterName(task.assignedTo)}`
                            : `Due ${format(task.deadline, 'MMM dd')}`
                          }
                        </p>
                      </div>
                      <span className={`writeflow-status-badge ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Reviews or Performance */}
              <div className="writeflow-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">
                  {currentUser.role === 'admin' ? 'Pending Reviews' : 'My Performance'}
                </h3>
                <div className="space-y-4">
                  {currentUser.role === 'admin' ? (
                    pendingReviews.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center space-x-4 p-4 bg-surface-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <ApperIcon name="FileText" className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-surface-900 truncate">{task.title}</h4>
                          <p className="text-sm text-surface-600">By {getWriterName(task.assignedTo)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-surface-500">
                            Submitted {task.submittedAt ? format(task.submittedAt, 'MMM dd') : 'Recently'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600">Tasks Completed</span>
                        <span className="font-semibold">{statsData.completedTasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600">Words This Week</span>
                        <span className="font-semibold">{weeklyPerformance.totalWords.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600">Average Rating</span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-semibold">{weeklyPerformance.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600">Deadlines Met</span>
                        <span className="font-semibold">{Math.round((statsData.deadlinesMet / Math.max(statsData.completedTasks, 1)) * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="writeflow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-surface-900">
                  {currentUser.role === 'admin' ? 'Task Management' : 'My Tasks'}
                </h3>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="writeflow-button-primary flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>New Task</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {visibleTasks.map((task) => (
                  <div key={task.id} className="border border-surface-200 rounded-xl p-4 hover:shadow-soft transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <h4 className="font-semibold text-surface-900">{task.title}</h4>
                          <span className={`writeflow-status-badge ${getStatusColor(task.status)} self-start`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 mt-1">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-500">
                          {currentUser.role === 'admin' && (
                            <span>Assigned to: {getWriterName(task.assignedTo)}</span>
                          )}
                          <span>{task.wordCount} words</span>
                          <span>Due: {format(task.deadline, 'MMM dd, yyyy')}</span>
                          {task.submittedAt && (
                            <span>Submitted: {format(task.submittedAt, 'MMM dd')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {(currentUser.role === 'admin' || 
                          (currentUser.role === 'writer' && task.assignedTo === currentUser.id)) && (
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            className="writeflow-input text-sm py-2 min-w-0"
                            disabled={currentUser.role === 'writer' && ['approved', 'in-review'].includes(task.status)}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="submitted">Submitted</option>
                            {currentUser.role === 'admin' && (
                              <>
                                <option value="in-review">In Review</option>
                                <option value="approved">Approved</option>
                                <option value="needs-revision">Needs Revision</option>
                              </>
                            )}
                          </select>
                        )}
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'writers' && currentUser.role === 'admin' && (
            <div className="writeflow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-surface-900">Writer Management</h3>
                <button
                  onClick={() => setShowWriterModal(true)}
                  className="writeflow-button-primary flex items-center space-x-2"
                >
                  <ApperIcon name="UserPlus" className="w-4 h-4" />
                  <span>Add Writer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleWriters.map((writer) => (
                  <div key={writer.id} className="border border-surface-200 rounded-xl p-6 hover:shadow-soft transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {writer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-surface-900">{writer.name}</h4>
                          <span className={`writeflow-status-badge ${
                            writer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {writer.status}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 mt-1">{writer.email}</p>
                        <p className="text-sm text-surface-500 mt-2">{writer.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {writer.expertise.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-surface-500">Tasks Completed</span>
                            <p className="font-semibold">{writer.performance.completedTasks}</p>
                          </div>
                          <div>
                            <span className="text-surface-500">Average Rating</span>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Star" className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="font-semibold">{writer.performance.averageRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="writeflow-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">
                {currentUser.role === 'admin' ? 'Team Performance Analytics' : 'My Performance Analytics'}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-900">
                    {currentUser.role === 'admin' ? 'Team Productivity' : 'My Productivity'}
                  </h4>
                  {(currentUser.role === 'admin' ? visibleWriters : [writers.find(w => w.id === currentUser.id)]).map((writer) => (
                    <div key={writer.id} className="p-4 bg-surface-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-surface-900">
                          {currentUser.role === 'admin' ? writer.name : 'You'}
                        </span>
                        <span className="text-sm text-surface-600">{writer.performance.completedTasks} tasks</span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                          style={{ width: `${Math.min((writer.performance.completedTasks / 30) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>{(writer.performance.totalWordCount / 1000).toFixed(1)}k words</span>
                        <span>Rating: {writer.performance.averageRating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-900">
                    {currentUser.role === 'admin' ? 'Task Distribution' : 'My Task Status'}
                  </h4>
                  <div className="space-y-3">
                    {['pending', 'in-progress', 'submitted', 'approved'].map((status) => {
                      const count = visibleTasks.filter(t => t.status === status).length
                      const percentage = visibleTasks.length > 0 ? (count / visibleTasks.length) * 100 : 0
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-surface-900 capitalize">
                            {status.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-surface-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-surface-600 w-8">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Task Creation Modal - Only for Admins */}
      {currentUser.role === 'admin' && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          writers={visibleWriters}
        />
      )}

      {/* Writer Creation Modal - Only for Admins */}
      {currentUser.role === 'admin' && (
        <WriterModal
          isOpen={showWriterModal}
          onClose={() => setShowWriterModal(false)}
          onSubmit={handleCreateWriter}
        />
      )}
    </div>
  )
}

export default MainFeature
