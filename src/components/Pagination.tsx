import './Pagination.scss'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  isLoading?: boolean
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  isLoading = false,
  onPageChange,
}: PaginationProps) {
  if (totalItems <= pageSize) {
    return null
  }

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav className="pagination" aria-label="Пагінація завдань">
      <button
        type="button"
        className="pagination__button"
        disabled={!hasPrev || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Попередня сторінка"
      >
        &larr; Попередня
      </button>

      <div className="pagination__info">
        <span className="pagination__page">
          Сторінка <strong>{currentPage}</strong> з <strong>{totalPages}</strong>
        </span>
        <span className="pagination__total">({totalItems} завдань)</span>
      </div>

      <button
        type="button"
        className="pagination__button"
        disabled={!hasNext || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Наступна сторінка"
      >
        Наступна &rarr;
      </button>
    </nav>
  )
}

export default Pagination
