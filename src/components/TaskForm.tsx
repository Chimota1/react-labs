import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task, TaskPriority } from '../types'

type TaskFormProps = {
  onAddTask: (task: Task) => void
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !description.trim() || !category.trim()) return

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      category: category.trim(),
    })
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Назва" aria-label="Назва завдання" />
      <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Опис" aria-label="Опис завдання" />
      <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Категорія" aria-label="Категорія завдання" />
      <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} aria-label="Пріоритет">
        <option value="low">Низький</option>
        <option value="medium">Середній</option>
        <option value="high">Високий</option>
      </select>
      <button type="submit">Додати завдання</button>
    </form>
  )
}

export default TaskForm
