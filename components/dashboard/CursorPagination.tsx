"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function CursorPagination({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  className,
}: Props) {
  return (
    <div className={className}>
      <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.04] overflow-hidden">
        
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onPrev}
          className="border-r border-white/[0.08] p-2 text-white/55 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          disabled={!hasNext}
          onClick={onNext}
          className="p-2 text-white/55 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}