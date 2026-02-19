'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Task } from '@/types/task'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data.tasks)
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTasks, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateTaskStatus = async (taskId: string, newColumn: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          column: newColumn,
          status: getStatusFromColumn(newColumn)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      // Refresh tasks after update
      fetchTasks()
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task')
    }
  }

  const getStatusFromColumn = (column: string): string => {
    switch (column) {
      case 'backlog': return 'Backlog'
      case 'assigned': return 'Assigned'  
      case 'in-progress': return 'In Progress'
      case 'review': return 'Review'
      case 'done': return 'Done'
      default: return 'Backlog'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Homer-Bart-Lisa Task Board
          </h1>
          <p className="text-gray-600">
            Team task management and progress tracking
          </p>
        </header>

        <KanbanBoard tasks={tasks} onTaskMove={updateTaskStatus} />
      </div>
    </div>
  )
}