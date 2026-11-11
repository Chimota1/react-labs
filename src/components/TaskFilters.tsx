import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types'
import './TaskFilters.scss'

const filterOptions: Array<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

export function TaskFilters() {
  const { filter, searchQuery, setFilter, setSearchQuery } = useTaskContext()

  return (
    <div className="task-filters" aria-label="Фільтри завдань">
      <label className="task-filters__search">
        <span>Пошук за назвою</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Введіть назву для пошуку"
          aria-label="Пошук завдань за назвою"
        />
      </label>

      <div className="task-filters__group" role="group" aria-label="Фільтрація за статусом">
        {filterOptions.map(({ value, label }) => (
          <button
            key={value}
            className={`task-filters__button${
              filter === value ? ' task-filters__button--active' : ''
            }`}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFilters
