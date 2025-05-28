import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const TaskTemplatesModal = ({ isOpen, onClose, onSubmit, existingTemplates }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wordCount: '',
    tags: '',
    category: 'general'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check for duplicate template names
    const isDuplicate = existingTemplates.some(
      template => template.title.toLowerCase() === formData.title.toLowerCase()
    )
    
    if (isDuplicate) {
      toast.error('A template with this title already exists')
      return
    }

    const templateData = {
      ...formData,
      wordCount: parseInt(formData.wordCount) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      id: Date.now().toString(),
      createdAt: new Date()
    }

    onSubmit(templateData)
    toast.success('Task template created successfully!')

    // Reset form
    setFormData({
      title: '',
      description: '',
      wordCount: '',
      tags: '',
      category: 'general'
    })
  }

  if (!isOpen) return null

  const templateCategories = [
    { value: 'general', label: 'General' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'product', label: 'Product Content' },
    { value: 'technical', label: 'Technical Writing' },
    { value: 'seo', label: 'SEO Content' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="writeflow-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Create Task Template</h3>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Template Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="writeflow-input"
              placeholder="e.g., Weekly Blog Post, Product Launch Copy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="writeflow-input h-24 resize-none"
              placeholder="Template description and requirements"
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
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="writeflow-input"
              >
                {templateCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Default Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="writeflow-input"
              placeholder="blog, weekly, marketing (comma separated)"
            />
            <p className="text-xs text-surface-500 mt-1">
              These tags will be automatically applied when using this template
            </p>
          </div>

          {/* Template Preview */}
          <div className="bg-surface-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-surface-900 mb-2">Template Preview</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-surface-700">Title:</span>
                <span className="text-surface-600 ml-2">
                  {formData.title || 'Enter title above'}
                </span>
              </div>
              <div>
                <span className="font-medium text-surface-700">Category:</span>
                <span className="text-surface-600 ml-2">
                  {templateCategories.find(c => c.value === formData.category)?.label}
                </span>
              </div>
              {formData.wordCount && (
                <div>
                  <span className="font-medium text-surface-700">Word Count:</span>
                  <span className="text-surface-600 ml-2">{formData.wordCount} words</span>
                </div>
              )}
              {formData.tags && (
                <div>
                  <span className="font-medium text-surface-700">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              Create Template
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TaskTemplatesModal
