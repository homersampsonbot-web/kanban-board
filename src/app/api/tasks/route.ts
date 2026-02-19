import { NextRequest, NextResponse } from 'next/server'
import { TaskData, Task } from '@/types/task'

const GITHUB_API_URL = 'https://api.github.com'
const REPO_OWNER = 'homersampsonbot-web'
const REPO_NAME = 'homer-ops'
const FILE_PATH = 'tasks/queue.json'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function getFileContent(): Promise<{ content: TaskData; sha: string }> {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const data = await response.json()
  const content = JSON.parse(Buffer.from(data.content, 'base64').toString())
  
  return { content, sha: data.sha }
}

async function updateFileContent(content: TaskData, sha: string): Promise<void> {
  const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update task queue from Kanban board',
        content: contentBase64,
        sha: sha,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to update file: ${response.status}`)
  }
}

export async function GET() {
  try {
    const { content } = await getFileContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, column, status } = body

    const { content, sha } = await getFileContent()
    
    // Update the task
    const taskIndex = content.tasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    content.tasks[taskIndex].column = column
    content.tasks[taskIndex].status = status
    content.lastUpdated = new Date().toISOString()

    await updateFileContent(content, sha)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTask: Omit<Task, 'id'> = await request.json()
    
    const { content, sha } = await getFileContent()
    
    // Generate new task ID
    const taskId = `task-${Date.now()}`
    
    const task: Task = {
      ...newTask,
      id: taskId,
      createdDate: new Date().toISOString(),
    }

    content.tasks.push(task)
    content.lastUpdated = new Date().toISOString()

    await updateFileContent(content, sha)

    return NextResponse.json({ task, success: true })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}