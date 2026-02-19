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
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'assigned', title: 'Assigned', color: 'bg-blue-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'review', title: 'Review', color: 'bg-purple-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
]

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
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

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // If we're over a column, that's fine
    const isOverColumn = columns.some(col => col.id === overId)
    if (isOverColumn) return

    // If we're over a task, move to that task's column
    const overTask = tasks.find(t => t.id === overId)
    if (overTask) {
      const activeTask = tasks.find(t => t.id === activeId)
      if (activeTask && activeTask.column !== overTask.column) {
        // This would trigger an immediate move, but we'll wait for dragEnd
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(column => {
          const columnTasks = getTasksByColumn(column.id)
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={columnTasks}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}