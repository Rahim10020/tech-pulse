/**
 * Category articles page component.
 * Displays all articles belonging to a specific category.
 * Supports dynamic category routing and article filtering.
 */
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ArticleList from '@/components/articles/ArticleList';
import CategoryFilter from '@/components/articles/CategoryFilter';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const categorySlug = resolvedParams.category;

    return {
        title: `${categorySlug} - pixelpulse`,
        description: `Articles in the ${categorySlug} category`,
    };
}

export default async function CategoryPage({ params }) {
    const resolvedParams = await params;
    const categorySlug = resolvedParams.category;

    // You can add category validation here if needed
    // For now, we'll assume the category exists

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container-sm py-6">
                <h1 className="h2-title text-gray-900 mb-6 capitalize">
                    {categorySlug.replace('-', ' ')} Articles
                </h1>

                <CategoryFilter activeCategory={categorySlug} />
                <ArticleList category={categorySlug} />
            </div>
        </div>
    );
}