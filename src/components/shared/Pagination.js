/**
 * Pagination component displays navigation controls for paginated content.
 *
 * @param {Object} props - The component props
 * @param {number} [props.currentPage=1] - The current active page number
 * @param {number} [props.totalPages=10] - The total number of pages available
 * @returns {JSX.Element} The pagination controls element
 */
export default function Pagination({ currentPage = 1, totalPages = 10 }) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <button className="p-2 hover:bg-gray-100 rounded">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {[1, 2, 3].map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded ${page === currentPage
              ? 'bg-gray-900 text-white'
              : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {page}
        </button>
      ))}

      <span className="px-3 text-gray-500">...</span>

      <button className="w-10 h-10 rounded hover:bg-gray-100 text-gray-700">
        {totalPages}
      </button>

      <button className="p-2 hover:bg-gray-100 rounded">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}