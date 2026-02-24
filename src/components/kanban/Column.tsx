"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { ColumnType, Task } from "./KanbanBoard";
import { Card } from "./Card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface Props {
  column: ColumnType;
  tasks: Task[];
}

export function Column({ column, tasks }: Props) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 w-80 min-h-[500px] rounded-xl flex flex-col p-4 shadow-sm border border-gray-200"
    >
      <h2 className="font-bold mb-4 px-2 text-gray-600 uppercase text-xs tracking-widest">
        {column.title} ({tasks.length})
      </h2>
      <div className="flex flex-col gap-3 flex-grow p-1">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
