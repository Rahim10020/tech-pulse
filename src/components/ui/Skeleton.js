// src/components/ui/Skeleton.js
export default function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded ${className}`}
            {...props}
        />
    );
}

// Skeleton pour une carte d'article
export function ArticleCardSkeleton({ horizontal = false }) {
    if (horizontal) {
        return (
            <div className="bg-white border-b border-gray-200 p-8">
                <div className="flex items-start space-x-6">
                    <div className="flex-1">
                        <div className="flex items-center mb-3 space-x-3">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="w-32 h-24 flex-shrink-0" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>
        </div>
    );
}

// Skeleton pour les catégories
export function CategoryCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Skeleton className="w-6 h-6 mb-4" />
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}