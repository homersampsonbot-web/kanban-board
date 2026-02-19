'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'
import { Calendar, User } from 'lucide-react'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getAssigneeColor = (assignee: string) => {
    switch (assignee) {
      case 'Homer': return 'bg-blue-500'
      case 'Bart': return 'bg-purple-500'
      case 'Lisa': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h4>
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`} />
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-gray-400" />
            <span className={`text-xs px-2 py-1 rounded-full text-white ${getAssigneeColor(task.assignee)}`}>
              {task.assignee}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(task.createdDate)}</span>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} text-white`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {task.status}
        </span>
      </div>
    </div>
  )
}