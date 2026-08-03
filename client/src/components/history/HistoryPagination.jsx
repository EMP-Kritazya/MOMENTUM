export default function HistoryPagination({ pagination, onPageChange }) {
  if (pagination.total_pages <= 1) return null;

  return (
    <nav className="mt-5 flex items-center justify-between" aria-label="History pages">
      <button
        type="button"
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-xl border border-momentum-border px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm text-momentum-muted">
        Page {pagination.page} of {pagination.total_pages}
      </span>

      <button
        type="button"
        disabled={pagination.page === pagination.total_pages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded-xl border border-momentum-border px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}