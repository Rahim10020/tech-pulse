/**
 * A basic skeleton loading component for displaying placeholder content with shimmer animation.
 *
 * @param {Object} props - The component props
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * @returns {JSX.Element} The skeleton element
 */
export default function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-shimmer bg-gray-200 rounded ${className}`}
            {...props}
        />
    );
}

/**
 * Skeleton component for article cards with optional horizontal layout.
 *
 * @param {Object} props - The component props
 * @param {boolean} [props.horizontal=false] - Whether to use horizontal layout
 * @returns {JSX.Element} The article card skeleton
 */
export function ArticleCardSkeleton({ horizontal = false }) {
    if (horizontal) {
        return (
            <div className="bg-white border-b border-gray-200 p-8 transition-colors">
                <div className="flex items-start space-x-6">
                    <div className="flex-1">
                        <div className="flex items-center mb-3 space-x-3">
                            <Skeleton className="h-4 w-16 rounded-full" />
                            <Skeleton className="h-4 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-3 rounded-lg" />
                        <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                        <Skeleton className="h-4 w-2/3 mb-4 rounded-lg" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-3 w-20 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="w-32 h-24 flex-shrink-0 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-colors">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
                <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                <Skeleton className="h-4 w-2/3 mb-4 rounded-lg" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-3 w-16 rounded-full" />
                        <Skeleton className="h-3 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-10 rounded-full" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton component for category cards.
 *
 * @returns {JSX.Element} The category card skeleton
 */
export function CategoryCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 transition-colors">
            <Skeleton className="w-12 h-12 mb-4 rounded-xl" />
            <Skeleton className="h-5 w-2/3 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2 rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
    );
}