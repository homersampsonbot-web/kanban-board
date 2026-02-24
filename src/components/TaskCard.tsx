'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'
import { Calendar, User, AlertCircle, Clock } from 'lucide-react'

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
    opacity: isDragging || isSortableDragging ? 0.7 : 1,
    zIndex: isDragging || isSortableDragging ? 1000 : 1,
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'High': return {
        color: 'priority-high',
        icon: AlertCircle,
        ring: 'ring-red-500/20',
        bg: 'bg-red-500/10',
        text: 'text-red-400'
      }
      case 'Medium': return {
        color: 'priority-medium',
        icon: Clock,
        ring: 'ring-amber-500/20',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400'
      }
      case 'Low': return {
        color: 'priority-low',
        icon: Clock,
        ring: 'ring-emerald-500/20',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400'
      }
      default: return {
        color: 'bg-gray-500',
        icon: Clock,
        ring: 'ring-gray-500/20',
        bg: 'bg-gray-500/10',
        text: 'text-gray-400'
      }
    }
  }

  const getAssigneeConfig = (assignee: string) => {
    switch (assignee) {
      case 'Homer': return { 
        color: 'member-homer',
        initial: 'H',
        name: 'Homer Simpson'
      }
      case 'Bart': return { 
        color: 'member-bart',
        initial: 'B',
        name: 'Bart Simpson'
      }
      case 'Lisa': return { 
        color: 'member-lisa',
        initial: 'L',
        name: 'Lisa Simpson'
      }
      case 'Marge': return { 
        color: 'member-marge',
        initial: 'M',
        name: 'Marge Simpson'
      }
      default: return { 
        color: 'bg-gray-500',
        initial: assignee[0]?.toUpperCase() || '?',
        name: assignee
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const priorityConfig = getPriorityConfig(task.priority)
  const assigneeConfig = getAssigneeConfig(task.assignee)
  const PriorityIcon = priorityConfig.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        gradient-card rounded-xl border border-gray-700/50 p-4 cursor-grab active:cursor-grabbing
        hover:border-gray-600/70 transition-smooth touch-manipulation no-select
        ${isDragging || isSortableDragging ? 'card-shadow-drag scale-105' : 'card-shadow hover:card-shadow-hover'}
        ${isDragging || isSortableDragging ? 'backdrop-blur-card' : ''}
      `}
    >
      {/* Priority indicator bar */}
      <div className={`h-0.5 w-full ${priorityConfig.color} rounded-full mb-3 opacity-60`}></div>
      
      {/* Card header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-white text-sm leading-relaxed flex-1 pr-3 line-clamp-2">
          {task.title}
        </h4>
        
        {/* Priority badge */}
        <div className={`
          ${priorityConfig.bg} ${priorityConfig.ring} ring-1 rounded-lg p-1.5 flex-shrink-0
        `}>
          <PriorityIcon className={`w-3 h-3 ${priorityConfig.text}`} />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Meta information */}
      <div className="flex items-center justify-between mb-3">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className={`
            w-7 h-7 ${assigneeConfig.color} rounded-lg flex items-center justify-center
            text-xs font-bold text-white shadow-sm
          `}>
            {assigneeConfig.initial}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {task.assignee}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(task.createdDate)}</span>
        </div>
      </div>

      {/* Footer with priority and status */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
        <div className={`
          ${priorityConfig.bg} ${priorityConfig.text} 
          text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1
        `}>
          <PriorityIcon className="w-3 h-3" />
          {task.priority}
        </div>
        
        <div className="bg-gray-700/40 text-gray-300 text-xs px-2 py-1 rounded-lg font-medium">
          {task.status}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent rounded-xl opacity-0 hover:opacity-100 transition-smooth pointer-events-none"></div>
    </div>
  )
}