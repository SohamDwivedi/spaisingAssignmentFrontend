import React from "react";

interface PaginationProps {
  meta: {
    current_page: number;
    last_page: number;
    total?: number;
  } | null;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page, total } = meta;

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      <div className="flex justify-center items-center gap-3">
        <button
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          className={`px-4 py-2 rounded-md transition-all ${
            current_page === 1
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          Prev
        </button>

        <span className="text-gray-300">
          Page <span className="text-purple-400">{current_page}</span> of{" "}
          <span className="text-purple-400">{last_page}</span>
        </span>

        <button
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          className={`px-4 py-2 rounded-md transition-all ${
            current_page === last_page
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {total !== undefined && (
        <p className="text-sm text-gray-400">Total items: {total}</p>
      )}
    </div>
  );
};

export default Pagination;
