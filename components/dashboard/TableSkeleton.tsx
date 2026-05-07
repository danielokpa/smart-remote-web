"use client";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 6,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-white/5">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-5 md:px-6 py-4">
              <div
                className={`
                    relative overflow-hidden rounded bg-white/10
                    before:absolute before:inset-0
                    before:animate-[shimmer_1.5s_infinite]
                    before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                    ${
                    j === columns - 1
                        ? "h-8 w-20 ml-auto rounded-full"
                        : j === 2
                        ? "h-7 w-28 rounded-full"
                        : "h-4 w-full max-w-[160px]"
                    }
                `}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}