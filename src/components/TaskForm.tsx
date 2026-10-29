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
  const [titleError, setTitleError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setTitleError('Введіть назву завдання')
      return
    }

    onAddTask({
      id: Date.now(),
      title: trimmedTitle,
      description: description.trim(),
      completed: false,
      priority,
      category: category.trim(),
    })
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
    setTitleError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="task-form__field">
        Назва
        <input
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (titleError) setTitleError('')
          }}
          placeholder="Назва"
          aria-label="Назва завдання"
          aria-invalid={Boolean(titleError)}
        />
        {titleError && <span className="task-form__error">{titleError}</span>}
      </label>
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
