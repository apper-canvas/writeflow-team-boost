import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

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

export default TaskModal
