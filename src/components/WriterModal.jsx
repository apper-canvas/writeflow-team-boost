import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

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

export default WriterModal
