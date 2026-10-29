import type { TaskFilter } from '../types'

type TaskFiltersProps = {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

const filterOptions: Array<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" aria-label="Фільтри завдань">
      {filterOptions.map(({ value, label }) => (
        <button
          key={value}
          className={`task-filters__button${filter === value ? ' task-filters__button--active' : ''}`}
          type="button"
          aria-pressed={filter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default TaskFilters
