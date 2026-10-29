import type { TaskFilter } from '../types'

type TaskFiltersProps = {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" aria-label="Фільтри завдань">
      {(['all', 'active', 'completed'] as const).map((value) => (
        <button key={value} className={filter === value ? 'filter--active' : ''} type="button" onClick={() => onFilterChange(value)}>
          {value === 'all' ? 'Усі' : value === 'active' ? 'Активні' : 'Виконані'}
        </button>
      ))}
    </div>
  )
}

export default TaskFilters
