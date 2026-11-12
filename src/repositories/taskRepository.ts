import { httpClient } from '../api/httpClient'
import type { Task, TaskPriority } from '../types'

export type ApiTodo = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type TodosResponse = {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}

export type GetTasksParams = {
  limit?: number
  skip?: number
  signal?: AbortSignal
}

export type PaginatedTasks = {
  tasks: Task[]
  total: number
  skip: number
  limit: number
}

export type CreateTaskDTO = {
  title: string
  description?: string
  completed?: boolean
  priority?: TaskPriority
  category?: string
}

export type UpdateTaskDTO = {
  title?: string
  description?: string
  completed?: boolean
  priority?: TaskPriority
  category?: string
}

export function toTask(todo: ApiTodo, metadata?: Partial<Task>): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: metadata?.description ?? '',
    completed: todo.completed,
    priority: metadata?.priority ?? 'medium',
    category: metadata?.category ?? 'General',
  }
}

export const taskRepository = {
  async getAll(params?: GetTasksParams): Promise<PaginatedTasks> {
    const limit = params?.limit ?? 10
    const skip = params?.skip ?? 0

    const response = await httpClient.get<TodosResponse>('/todos', {
      params: { limit, skip },
      signal: params?.signal,
    })

    return {
      tasks: response.todos.map((todo) => toTask(todo)),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    }
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const todo = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal })
    return toTask(todo)
  },

  async create(data: CreateTaskDTO): Promise<Task> {
    const payload = {
      todo: data.title.trim(),
      completed: data.completed ?? false,
      userId: 5,
    }

    const created = await httpClient.post<ApiTodo>('/todos/add', payload)

    return toTask(created, {
      description: data.description?.trim() ?? '',
      priority: data.priority ?? 'medium',
      category: data.category?.trim() ?? 'General',
    })
  },

  async update(id: number, data: UpdateTaskDTO): Promise<Task> {
    const payload: { todo?: string; completed?: boolean } = {}
    if (data.title !== undefined) {
      payload.todo = data.title.trim()
    }
    if (data.completed !== undefined) {
      payload.completed = data.completed
    }

    const updated = await httpClient.put<ApiTodo>(`/todos/${id}`, payload)

    return toTask(updated, {
      description: data.description?.trim(),
      priority: data.priority,
      category: data.category?.trim(),
    })
  },

  async delete(id: number): Promise<{ id: number; isDeleted: boolean }> {
    const result = await httpClient.delete<{ id: number; isDeleted: boolean }>(
      `/todos/${id}`,
    )

    return {
      id: result.id ?? id,
      isDeleted: result.isDeleted ?? true,
    }
  },
}
