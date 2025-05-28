import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const TaskModal = ({ isOpen, onClose, onSubmit, writers, taskTemplates, selectedTemplate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wordCount: '',
    deadline: '',
    assignedTo: [], // Changed to array for multiple assignments
    tags: '',
    useTemplate: false,
    templateId: ''
  })

  // Apply template data when selected
  useEffect(() => {
    if (selectedTemplate) {
      setFormData({
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        wordCount: selectedTemplate.wordCount.toString(),
        deadline: '',
        assignedTo: [],
        tags: selectedTemplate.tags.join(', '),
        useTemplate: true,
        templateId: selectedTemplate.id
      })
    }
  }, [selectedTemplate])

  const handleTemplateChange = (templateId) => {
    if (templateId) {
      const template = taskTemplates.find(t => t.id === templateId)
      if (template) {
        setFormData({
          ...formData,
          title: template.title,
          description: template.description,
          wordCount: template.wordCount.toString(),
          tags: template.tags.join(', '),
          useTemplate: true,
          templateId: templateId
        })
        toast.success('Template applied successfully!')
      }
    } else {
      setFormData({
        ...formData,
        title: '',
        description: '',
        wordCount: '',
        tags: '',
        useTemplate: false,
        templateId: ''
      })
    }
  }

  const handleWriterSelection = (writerId) => {
    setFormData(prevData => {
      const currentAssignments = prevData.assignedTo
      const isSelected = currentAssignments.includes(writerId)
      
      if (isSelected) {
        return {
          ...prevData,
          assignedTo: currentAssignments.filter(id => id !== writerId)
        }
      } else {
        return {
          ...prevData,
          assignedTo: [...currentAssignments, writerId]
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || formData.assignedTo.length === 0) {
      toast.error('Please fill in all required fields and assign at least one writer')
      return
    }

    const taskData = {
      ...formData,
      wordCount: parseInt(formData.wordCount) || 0,
      deadline: new Date(formData.deadline),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    onSubmit(taskData)

    // Notify assigned writers
    const assignedWriterNames = formData.assignedTo.map(writerId => {
      const writer = writers.find(w => w.id === writerId)
      return writer ? writer.name : 'Unknown'
    }).join(', ')
    
    toast.success(`Task "${formData.title}" assigned to: ${assignedWriterNames}`)

    // Reset form
    setFormData({
      title: '',
      description: '',
      wordCount: '',
      deadline: '',
      assignedTo: [],
      tags: '',
      useTemplate: false,
      templateId: ''
    })
  }

  if (!isOpen) return null

  const availableWriters = writers.filter(w => w.status === 'active' && w.role === 'writer')

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="writeflow-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">
            {selectedTemplate ? 'Create Task from Template' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Template Selection */}
          {!selectedTemplate && taskTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Use Template (Optional)
              </label>
              <select
                value={formData.templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="writeflow-input"
              >
                <option value="">Select a template...</option>
                {taskTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title} - {template.wordCount} words
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Task Details */}
          <div className="grid grid-cols-1 gap-4">
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
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="writeflow-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Multiple Writer Assignment */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">
              Assign to Writers * ({formData.assignedTo.length} selected)
            </label>
            <div className="border border-surface-200 rounded-xl p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {availableWriters.map((writer) => (
                  <label
                    key={writer.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedTo.includes(writer.id)}
                      onChange={() => handleWriterSelection(writer.id)}
                      className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary/20"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {writer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-surface-900">{writer.name}</div>
                        <div className="text-xs text-surface-500">
                          {writer.expertise.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {formData.assignedTo.length === 0 && (
              <p className="text-sm text-red-600 mt-1">Please select at least one writer</p>
            )}
          </div>

          {/* Tags */}
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

          {/* Form Actions */}
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
              {formData.assignedTo.length > 1 ? 
                `Create Task (${formData.assignedTo.length} writers)` : 
                'Create Task'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TaskModal
