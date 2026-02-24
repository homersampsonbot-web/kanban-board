'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { Plus, MoreVertical } from 'lucide-react'

interface KanbanColumnProps {
  id: string
  title: string
  color: string
  headerColor: string
  tasks: Task[]
}

export function KanbanColumn({ id, title, color, headerColor, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const getColumnConfig = (columnId: string) => {
    switch (columnId) {
      case 'backlog': return {
        gradient: 'from-slate-600/20 to-slate-700/10',
        border: 'border-slate-600/30',
        hoverBorder: 'hover:border-slate-500/50',
        count: 'bg-slate-600/20 text-slate-300',
        icon: '📋'
      }
      case 'assigned': return {
        gradient: 'from-blue-600/20 to-blue-700/10',
        border: 'border-blue-600/30',
        hoverBorder: 'hover:border-blue-500/50',
        count: 'bg-blue-600/20 text-blue-300',
        icon: '👤'
      }
      case 'in-progress': return {
        gradient: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/30',
        hoverBorder: 'hover:border-amber-400/50',
        count: 'bg-amber-500/20 text-amber-300',
        icon: '⚡'
      }
      case 'review': return {
        gradient: 'from-purple-600/20 to-purple-700/10',
        border: 'border-purple-600/30',
        hoverBorder: 'hover:border-purple-500/50',
        count: 'bg-purple-600/20 text-purple-300',
        icon: '👁️'
      }
      case 'done': return {
        gradient: 'from-emerald-500/20 to-emerald-600/10',
        border: 'border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-400/50',
        count: 'bg-emerald-500/20 text-emerald-300',
        icon: '✅'
      }
      default: return {
        gradient: 'from-gray-600/20 to-gray-700/10',
        border: 'border-gray-600/30',
        hoverBorder: 'hover:border-gray-500/50',
        count: 'bg-gray-600/20 text-gray-300',
        icon: '📝'
      }
    }
  }

  const config = getColumnConfig(id)

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-w-[280px] w-80 md:w-[340px] 
        gradient-column rounded-2xl border transition-smooth
        ${config.border} ${config.hoverBorder}
        ${isOver ? 'ring-2 ring-blue-400/50 scale-[1.02] border-blue-400/50' : ''}
      `}
    >
      {/* Column Header */}
      <div className={`
        bg-gradient-to-r ${config.gradient} rounded-t-2xl p-4 border-b border-gray-700/30
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{config.icon}</span>
            <div>
              <h3 className="font-semibold text-white text-base">{title}</h3>
              <div className={`
                ${config.count} text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
              `}>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          </div>
          
          {/* Column Actions */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-smooth focus-ring">
              <Plus className="w-4 h-4 text-gray-400 hover:text-white transition-smooth" />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-smooth focus-ring">
              <MoreVertical className="w-4 h-4 text-gray-400 hover:text-white transition-smooth" />
            </button>
          </div>
        </div>
      </div>

      {/* Column Body */}
      <div className="flex-1 p-4">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 min-h-[120px]">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-700/30 rounded-2xl flex items-center justify-center mb-3">
                  <span className="text-2xl opacity-50">{config.icon}</span>
                </div>
                <div className="text-sm text-gray-500 font-medium mb-1">No tasks yet</div>
                <div className="text-xs text-gray-600">Drop tasks here or create new ones</div>
              </div>
            )}
            
            {/* Drop zone indicator when dragging over */}
            {isOver && tasks.length > 0 && (
              <div className="h-2 bg-blue-400/20 rounded-full border-2 border-dashed border-blue-400/40 animate-pulse"></div>
            )}
          </div>
        </SortableContext>
      </div>

      {/* Column Footer - Add task button */}
      <div className="p-3 border-t border-gray-700/30">
        <button className="w-full p-3 text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-xl transition-smooth text-sm font-medium flex items-center justify-center gap-2 focus-ring">
          <Plus className="w-4 h-4" />
          Add task
        </button>
      </div>
    </div>
  )
}