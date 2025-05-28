import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format, addDays } from 'date-fns'

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
        createdAt: new Date()
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
        createdAt: new Date()
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
        createdAt: new Date()
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
        performance: { completedTasks: 24, totalWordCount: 48000, deadlinesMet: 22, averageRating: 4.8 }
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
        performance: { completedTasks: 18, totalWordCount: 32000, deadlinesMet: 17, averageRating: 4.6 }
      }
    ]

    setTasks(sampleTasks)
    setWriters(sampleWriters)
  }, [])

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
      createdAt: new Date()
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
      performance: { completedTasks: 0, totalWordCount: 0, deadlinesMet: 0, averageRating: 0 }
    }
    setWriters([...writers, newWriter])
    setShowWriterModal(false)
    toast.success('Writer added successfully!')
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    toast.success(`Task status updated to ${newStatus}`)
  }

  const getWriterName = (writerId) => {
    const writer = writers.find(w => w.id === writerId)
    return writer ? writer.name : 'Unassigned'
  }

  const statsData = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => ['pending', 'in-progress'].includes(t.status)).length,
    completedTasks: tasks.filter(t => t.status === 'approved').length,
    activeWriters: writers.filter(w => w.status === 'active').length
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Tasks', value: statsData.totalTasks, icon: 'ClipboardList', color: 'from-blue-500 to-blue-600' },
          { label: 'Active Tasks', value: statsData.activeTasks, icon: 'Clock', color: 'from-amber-500 to-amber-600' },
          { label: 'Completed', value: statsData.completedTasks, icon: 'CheckCircle', color: 'from-green-500 to-green-600' },
          { label: 'Active Writers', value: statsData.activeWriters, icon: 'Users', color: 'from-purple-500 to-purple-600' }
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

      {/* Tab Navigation */}
      <div className="writeflow-card p-2">
        <div className="flex flex-wrap space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
            { id: 'tasks', label: 'Tasks', icon: 'ClipboardList' },
            { id: 'writers', label: 'Writers', icon: 'Users' },
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
              {/* Recent Tasks */}
              <div className="writeflow-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Tasks</h3>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900 truncate">{task.title}</h4>
                        <p className="text-sm text-surface-600">Assigned to {getWriterName(task.assignedTo)}</p>
                      </div>
                      <span className={`writeflow-status-badge ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Writer Performance */}
              <div className="writeflow-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {writers.slice(0, 3).map((writer) => (
                    <div key={writer.id} className="flex items-center space-x-4 p-4 bg-surface-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {writer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900">{writer.name}</h4>
                        <p className="text-sm text-surface-600">
                          {writer.performance.completedTasks} tasks • {(writer.performance.totalWordCount / 1000).toFixed(1)}k words
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-sm font-medium">{writer.performance.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="writeflow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-surface-900">Task Management</h3>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="writeflow-button-primary flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
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
                          <span>Assigned to: {getWriterName(task.assignedTo)}</span>
                          <span>{task.wordCount} words</span>
                          <span>Due: {format(task.deadline, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="writeflow-input text-sm py-2 min-w-0"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="submitted">Submitted</option>
                          <option value="in-review">In Review</option>
                          <option value="approved">Approved</option>
                          <option value="needs-revision">Needs Revision</option>
                        </select>
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

          {activeTab === 'writers' && (
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
                {writers.map((writer) => (
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
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Performance Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-900">Team Productivity</h4>
                  {writers.map((writer) => (
                    <div key={writer.id} className="p-4 bg-surface-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-surface-900">{writer.name}</span>
                        <span className="text-sm text-surface-600">{writer.performance.completedTasks} tasks</span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                          style={{ width: `${(writer.performance.completedTasks / 30) * 100}%` }}
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
                  <h4 className="font-medium text-surface-900">Task Distribution</h4>
                  <div className="space-y-3">
                    {['pending', 'in-progress', 'submitted', 'approved'].map((status) => {
                      const count = tasks.filter(t => t.status === status).length
                      const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0
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

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        writers={writers}
      />

      {/* Writer Creation Modal */}
      <WriterModal
        isOpen={showWriterModal}
        onClose={() => setShowWriterModal(false)}
        onSubmit={handleCreateWriter}
      />
    </div>
  )
}

// Task Creation Modal Component
const TaskModal = ({ isOpen, onClose, onSubmit, writers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wordCount: '',
    deadline: '',
    assignedTo: '',
    tags: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.assignedTo) {
      toast.error('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      wordCount: parseInt(formData.wordCount) || 0,
      deadline: new Date(formData.deadline),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })

    setFormData({
      title: '',
      description: '',
      wordCount: '',
      deadline: '',
      assignedTo: '',
      tags: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="writeflow-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Create New Task</h3>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="writeflow-input"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="writeflow-input h-24 resize-none"
              placeholder="Describe the task requirements"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Word Count</label>
              <input
                type="number"
                value={formData.wordCount}
                onChange={(e) => setFormData({ ...formData, wordCount: e.target.value })}
                className="writeflow-input"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="writeflow-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Assign to Writer *</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="writeflow-input"
              required
            >
              <option value="">Select a writer</option>
              {writers.filter(w => w.status === 'active').map((writer) => (
                <option key={writer.id} value={writer.id}>{writer.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="writeflow-input"
              placeholder="blog, seo, marketing (comma separated)"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="writeflow-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="writeflow-button-primary flex-1"
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Writer Creation Modal Component
const WriterModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    expertise: '',
    teamTags: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(Boolean),
      teamTags: formData.teamTags.split(',').map(tag => tag.trim()).filter(Boolean)
    })

    setFormData({
      name: '',
      email: '',
      bio: '',
      expertise: '',
      teamTags: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="writeflow-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Add New Writer</h3>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="writeflow-input"
              placeholder="Enter writer's full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="writeflow-input"
              placeholder="writer@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="writeflow-input h-20 resize-none"
              placeholder="Brief description of the writer's background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Expertise</label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="writeflow-input"
              placeholder="Blog Writing, SEO, Technical Content (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Team Tags</label>
            <input
              type="text"
              value={formData.teamTags}
              onChange={(e) => setFormData({ ...formData, teamTags: e.target.value })}
              className="writeflow-input"
              placeholder="blog, technical, creative (comma separated)"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="writeflow-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="writeflow-button-primary flex-1"
            >
              Add Writer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default MainFeature