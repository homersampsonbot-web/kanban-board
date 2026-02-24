import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Homer's Kanban <span className="text-blue-600">MVP</span>
        </h1>
      </header>
      <div className="flex-grow flex justify-center py-8">
        <KanbanBoard />
      </div>
    </main>
  );
}
