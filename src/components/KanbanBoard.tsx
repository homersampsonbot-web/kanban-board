'use client'

import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from '@/types/task'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newColumn: string) => void
}

const columns = [
  { 
    id: 'backlog', 
    title: 'Backlog', 
    color: 'bg-slate-800', 
    headerColor: 'bg-slate-700',
    description: 'Ideas and future tasks'
  },
  { 
    id: 'assigned', 
    title: 'Assigned', 
    color: 'bg-blue-900', 
    headerColor: 'bg-blue-700',
    description: 'Ready to start'
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    color: 'bg-amber-900', 
    headerColor: 'bg-amber-700',
    description: 'Currently being worked on'
  },
  { 
    id: 'review', 
    title: 'Review', 
    color: 'bg-purple-900', 
    headerColor: 'bg-purple-700',
    description: 'Awaiting feedback'
  },
  { 
    id: 'done', 
    title: 'Done', 
    color: 'bg-emerald-900', 
    headerColor: 'bg-emerald-700',
    description: 'Completed tasks'
  },
]

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slightly larger distance for better touch experience
      },
    })
  )

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setDragOverColumn(null)

    if (!over) return

    const taskId = active.id as string
    const newColumnId = over.id as string

    // Check if we're dropping on a column
    const isColumn = columns.some(col => col.id === newColumnId)
    if (isColumn) {
      const task = tasks.find(t => t.id === taskId)
      if (task && task.column !== newColumnId) {
        onTaskMove(taskId, newColumnId)
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) {
      setDragOverColumn(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    // Update visual feedback for column hovering
    const overColumn = columns.find(col => col.id === overId)
    if (overColumn) {
      setDragOverColumn(overColumn.id)
    } else {
      // If we're over a task, highlight that task's column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        setDragOverColumn(overTask.column)
      } else {
        setDragOverColumn(null)
      }
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setDragOverColumn(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      {/* Board Header with Stats */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {columns.map(column => {
            const columnTasks = getTasksByColumn(column.id)
            const isHighlighted = dragOverColumn === column.id
            
            return (
              <div
                key={column.id}
                className={`
                  p-3 rounded-xl border transition-smooth
                  ${isHighlighted 
                    ? 'border-blue-400/50 bg-blue-400/5' 
                    : 'border-gray-700/50 bg-gray-800/30'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-1">
                    {columnTasks.length}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {column.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {columns.map(column => {
          const columnTasks = getTasksByColumn(column.id)
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              headerColor={column.headerColor}
              tasks={columnTasks}
            />
          )
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="transform rotate-3 scale-105">
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>

      {/* Global drag indicator */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/10 pointer-events-none z-40 backdrop-blur-sm">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-card">
              Moving "{activeTask.title}" to {dragOverColumn ? columns.find(c => c.id === dragOverColumn)?.title : 'a column'}
            </div>
          </div>
        </div>
      )}
    </DndContext>
  )
}