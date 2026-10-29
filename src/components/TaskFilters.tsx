import type { TaskFilter } from '../types'

type TaskFiltersProps = {
  filter: TaskFilter
  searchQuery: string
  onFilterChange: (filter: TaskFilter) => void
  onSearchChange: (query: string) => void
}

const filterOptions: Array<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

function TaskFilters({
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters" aria-label="Фільтри завдань">
      <label className="task-filters__search">
        <span>Пошук за назвою</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Введіть назву завдання"
          aria-label="Пошук завдань за назвою"
        />
      </label>
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
