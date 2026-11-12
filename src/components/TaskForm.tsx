import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskPriority } from '../types'
import './TaskForm.scss'

export function TaskForm() {
  const { createTask, updateTask, editingTask, setEditingTask } = useTaskContext()

  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? 'medium',
  )
  const [category, setCategory] = useState(editingTask?.category ?? '')
  const [titleError, setTitleError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Adjusting form state when editingTask changes (React pattern)
  const [prevEditingTask, setPrevEditingTask] = useState(editingTask)
  if (editingTask !== prevEditingTask) {
    setPrevEditingTask(editingTask)
    setTitle(editingTask?.title ?? '')
    setDescription(editingTask?.description ?? '')
    setPriority(editingTask?.priority ?? 'medium')
    setCategory(editingTask?.category ?? '')
    setTitleError('')
  }

  const isEditing = Boolean(editingTask)

  const handleCancel = () => {
    setEditingTask(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setTitleError('Введіть назву завдання')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && editingTask) {
        await updateTask(editingTask.id, {
          title: trimmedTitle,
          description: description.trim(),
          priority,
          category: category.trim(),
        })
      } else {
        await createTask({
          title: trimmedTitle,
          description: description.trim(),
          priority,
          category: category.trim(),
        })
        setTitle('')
        setDescription('')
        setCategory('')
        setPriority('medium')
        setTitleError('')
      }
    } catch {
      // Error is handled in context toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="task-form__field">
        <span>Назва завдання (POST / PUT)</span>
        <input
          required
          disabled={isSubmitting}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (titleError) setTitleError('')
          }}
          placeholder="Назва завдання"
          aria-label="Назва завдання"
          aria-invalid={Boolean(titleError)}
        />
        {titleError && <span className="task-form__error">{titleError}</span>}
      </label>

      <label className="task-form__field">
        <span>Опис (клієнтські метадані)</span>
        <input
          disabled={isSubmitting}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Короткий опис"
          aria-label="Опис завдання"
        />
      </label>

      <label className="task-form__field">
        <span>Категорія</span>
        <input
          disabled={isSubmitting}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Наприклад: React, REST API"
          aria-label="Категорія завдання"
        />
      </label>

      <label className="task-form__field">
        <span>Пріоритет</span>
        <select
          disabled={isSubmitting}
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          aria-label="Пріоритет"
        >
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </label>

      <div className="task-form__actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`task-form__button${
            isEditing ? ' task-form__button--edit' : ''
          }`}
        >
          {isSubmitting
            ? 'Збереження в API...'
            : isEditing
              ? 'Зберегти зміни (PUT)'
              : 'Додати завдання (POST)'}
        </button>
        {isEditing && (
          <button
            type="button"
            disabled={isSubmitting}
            className="task-form__button task-form__button--cancel"
            onClick={handleCancel}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
