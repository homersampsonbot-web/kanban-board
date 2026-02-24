"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./KanbanBoard";
import { GripVertical } from "lucide-react";

interface Props {
  task: Task;
  isOverlay?: boolean;
}

export function Card({ task, isOverlay }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const cardClasses = `bg-white rounded-lg shadow-sm border border-gray-200 min-h-[64px] flex items-center group touch-none ${
    isOverlay ? "shadow-2xl ring-2 ring-blue-500 scale-105 z-50" : ""
  } ${isDragging ? "opacity-30 border-blue-200 bg-blue-50" : "hover:border-gray-300"}`;

  return (
    <div ref={setNodeRef} style={style} className={cardClasses}>
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Drag handle"
      >
        <GripVertical size={20} />
      </div>

      {/* Card Content */}
      <div className="py-4 pr-4 flex-grow">
        <p className="text-gray-800 text-sm font-medium leading-snug">
          {task.content}
        </p>
      </div>
    </div>
  );
}
