import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'
import { format, subDays } from 'date-fns'

const TaskFilters = ({ onFilterChange, writers, availableTags, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    status: activeFilters.status || '',
    assignee: activeFilters.assignee || '',
    tag: activeFilters.tag || '',
    deadlineRange: activeFilters.deadlineRange || '',
    priority: activeFilters.priority || '',
    wordCountRange: activeFilters.wordCountRange || ''
  })

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      status: '',
      assignee: '',
      tag: '',
      deadlineRange: '',
      priority: '',
      wordCountRange: ''
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-amber-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'submitted', label: 'Submitted', color: 'text-purple-600' },
    { value: 'in-review', label: 'In Review', color: 'text-indigo-600' },
    { value: 'approved', label: 'Approved', color: 'text-green-600' },
    { value: 'needs-revision', label: 'Needs Revision', color: 'text-red-600' }
  ]

  const deadlineRangeOptions = [
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Due Today' },
    { value: 'tomorrow', label: 'Due Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' }
  ]

  const wordCountRangeOptions = [
    { value: '0-500', label: '0 - 500 words' },
    { value: '501-1000', label: '501 - 1,000 words' },
    { value: '1001-2000', label: '1,001 - 2,000 words' },
    { value: '2001-5000', label: '2,001 - 5,000 words' },
    { value: '5000+', label: '5,000+ words' }
  ]

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-amber-600' },
    { value: 'low', label: 'Low Priority', color: 'text-green-600' }
  ]

  return (
    <div className="writeflow-card p-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-5 h-5 text-surface-600" />
          <h3 className="font-medium text-surface-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={handleReset}
              className="text-sm text-surface-600 hover:text-surface-900 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-surface-600 hover:text-surface-900 transition-colors"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4" 
            />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.slice(0, 3).map((status) => (
          <button
            key={status.value}
            onClick={() => handleFilterChange('status', 
              filters.status === status.value ? '' : status.value
            )}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === status.value
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Assigned Writer
              </label>
              <select
                value={filters.assignee}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Writers</option>
                {writers.filter(w => w.role === 'writer').map((writer) => (
                  <option key={writer.id} value={writer.id}>
                    {writer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Tag
              </label>
              <select
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline Range Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Deadline
              </label>
              <select
                value={filters.deadlineRange}
                onChange={(e) => handleFilterChange('deadlineRange', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Deadlines</option>
                {deadlineRangeOptions.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Word Count Range Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Word Count
              </label>
              <select
                value={filters.wordCountRange}
                onChange={(e) => handleFilterChange('wordCountRange', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Word Counts</option>
                {wordCountRangeOptions.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="writeflow-input text-sm"
              >
                <option value="">All Priorities</option>
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              
              let displayValue = value
              if (key === 'assignee') {
                const writer = writers.find(w => w.id === value)
                displayValue = writer ? writer.name : value
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  <span>{key}: {displayValue}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="hover:text-primary-dark transition-colors"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskFilters
