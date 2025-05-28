// Role-based data filtering and calculation utilities

/**
 * Filter tasks based on user role
 * @param {Array} tasks - All tasks
 * @param {Object} currentUser - Current user object with role and id
 * @returns {Array} Filtered tasks
 */
export const filterTasksByRole = (tasks, currentUser) => {
  if (currentUser.role === 'admin') {
    return tasks // Admins see all tasks
  }
  
  if (currentUser.role === 'writer') {
    // Writers see only their assigned tasks
    const userId = currentUser.name === 'Alex Chen' ? 'alex-chen' : currentUser.id
    return tasks.filter(task => task.assignedTo === userId)
  }
  
  return []
}

/**
 * Calculate role-based statistics
 * @param {Array} visibleTasks - Tasks visible to current user
 * @param {Array} writers - All writers
 * @param {Object} currentUser - Current user object
 * @returns {Object} Statistics object
 */
export const calculateRoleBasedStats = (visibleTasks, writers, currentUser) => {
  const stats = {
    totalTasks: visibleTasks.length,
    activeTasks: visibleTasks.filter(t => ['pending', 'in-progress'].includes(t.status)).length,
    completedTasks: visibleTasks.filter(t => t.status === 'approved').length,
    submittedTasks: visibleTasks.filter(t => t.status === 'submitted').length,
    activeWriters: writers.filter(w => w.status === 'active' && w.role === 'writer').length
  }

  if (currentUser.role === 'writer') {
    // Add writer-specific stats
    const userWriter = writers.find(w => w.name === currentUser.name)
    if (userWriter) {
      stats.deadlinesMet = userWriter.performance.deadlinesMet
      stats.averageRating = userWriter.performance.averageRating
    }
  }

  return stats
}

/**
 * Get weekly performance data
 * @param {Array} visibleTasks - Tasks visible to current user
 * @param {Array} writers - All writers
 * @param {Object} currentUser - Current user object
 * @returns {Object} Weekly performance metrics
 */
export const getWeeklyPerformance = (visibleTasks, writers, currentUser) => {
  const weeklyData = {
    totalWords: 0,
    tasksCompleted: 0,
    averageRating: 0
  }

  if (currentUser.role === 'admin') {
    // Calculate team-wide weekly performance
    weeklyData.totalWords = writers
      .filter(w => w.role === 'writer')
      .reduce((sum, writer) => sum + (writer.performance.weeklyWordCount || 0), 0)
    
    weeklyData.tasksCompleted = writers
      .filter(w => w.role === 'writer')
      .reduce((sum, writer) => sum + (writer.performance.weeklyTasksCompleted || 0), 0)
    
    const writerRatings = writers
      .filter(w => w.role === 'writer' && w.performance.averageRating > 0)
      .map(w => w.performance.averageRating)
    
    weeklyData.averageRating = writerRatings.length > 0 
      ? writerRatings.reduce((sum, rating) => sum + rating, 0) / writerRatings.length
      : 0
  } else if (currentUser.role === 'writer') {
    // Calculate individual writer's weekly performance
    const userWriter = writers.find(w => w.name === currentUser.name)
    if (userWriter) {
      weeklyData.totalWords = userWriter.performance.weeklyWordCount || 0
      weeklyData.tasksCompleted = userWriter.performance.weeklyTasksCompleted || 0
      weeklyData.averageRating = userWriter.performance.averageRating || 0
    }
  }

  return weeklyData
}

/**
 * Get pending reviews for admins
 * @param {Array} tasks - All tasks
 * @param {Object} currentUser - Current user object
 * @returns {Array} Tasks pending review
 */
export const getPendingReviews = (tasks, currentUser) => {
  if (currentUser.role !== 'admin') {
    return []
  }
  
  return tasks.filter(task => task.status === 'submitted')
}

/**
 * Check if user can perform certain actions
 * @param {Object} currentUser - Current user object
 * @param {string} action - Action to check (create-task, manage-writers, etc.)
 * @returns {boolean} Whether user can perform action
 */
export const canPerformAction = (currentUser, action) => {
  const permissions = {
    'create-task': currentUser.role === 'admin',
    'manage-writers': currentUser.role === 'admin',
    'review-submissions': currentUser.role === 'admin',
    'update-task-status': true, // Both roles can update status with restrictions
    'view-team-performance': currentUser.role === 'admin'
  }
  
  return permissions[action] || false
}

/**
 * Get role-appropriate dashboard title
 * @param {Object} currentUser - Current user object
 * @returns {string} Dashboard title
 */
export const getDashboardTitle = (currentUser) => {
  return currentUser.role === 'admin' ? 'Team Dashboard' : 'My Dashboard'
}

/**
 * Get role-appropriate welcome message
 * @param {Object} currentUser - Current user object
 * @returns {string} Welcome message
 */
export const getWelcomeMessage = (currentUser) => {
  return currentUser.role === 'admin'
    ? 'Manage your writing team and track overall performance'
    : 'Track your tasks, deadlines, and writing performance'
}
