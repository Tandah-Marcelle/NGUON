import { ChevronLeft, ChevronRight } from "lucide-react";

// Shared pager for server-side-paginated admin lists — shows a compact
// "X–Y sur Z" summary plus prev/next, matching the page/size/totalElements
// shape returned by the backend's PageResponse<T>.
export default function AdminPager({
  page, size, totalElements, totalPages, onPageChange,
}: { page: number; size: number; totalElements: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalElements === 0) return null;

  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex items-center justify-between gap-4 py-4 flex-wrap">
      <p className="text-xs text-muted-foreground font-semibold">
        {from}–{to} sur {totalElements}
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground/70 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} /> Précédent
        </button>
        <span className="text-xs font-semibold text-muted-foreground px-2">
          Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground/70 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Suivant <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
