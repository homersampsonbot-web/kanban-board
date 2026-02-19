export interface Task {
  id: string
  title: string
  description: string
  assignee: 'Homer' | 'Bart' | 'Lisa'
  priority: 'High' | 'Medium' | 'Low'
  status: string
  createdDate: string
  column: string
}

export interface TaskData {
  tasks: Task[]
  lastUpdated: string
}