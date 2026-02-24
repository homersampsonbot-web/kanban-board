"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  MeasuringStrategy,
  DragCancelEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "./Column";
import { Card } from "./Card";

export type Task = {
  id: string;
  content: string;
  columnId: string;
};

export type ColumnType = {
  id: string;
  title: string;
};

const INITIAL_COLUMNS: ColumnType[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "In Progress" },
  { id: "done", title: "Done" },
];

const INITIAL_TASKS: Task[] = [
  { id: "1", content: "Setup Project", columnId: "backlog" },
  { id: "2", content: "Implement DND", columnId: "backlog" },
  { id: "3", content: "Styling", columnId: "todo" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Trello-style: Only block scroll when handle is held
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: tasks[overIndex].columnId };
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: overId as string };
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
  }

  function onDragCancel() {
    setActiveTask(null);
  }

  return (
    <div className="flex gap-6 p-6 min-h-[100dvh] overflow-x-auto overflow-y-auto items-start touch-pan-y w-full max-w-7xl mx-auto bg-gray-50">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="flex gap-6">
          {INITIAL_COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((t) => t.columnId === col.id)}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask ? <Card task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
