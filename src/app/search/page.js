// src/app/search/page.js - Page de recherche globale avancée
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import {
    Search,
    Filter,
    X,
    Clock,
    TrendingUp,
    User,
    Tag,
    FileText,
    ChevronDown,
    Calendar,
    Eye,
    Heart,
    MessageCircle
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // État de la recherche
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState({
        articles: [],
        authors: [],
        categories: [],
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Filtres avancés
    const [filters, setFilters] = useState({
        dateRange: 'all',
        sortBy: 'relevance',
        category: 'all',
        author: 'all'
    });

    // Suggestions et historique
    const [suggestions, setSuggestions] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce de la recherche
    const debouncedQuery = useDebounce(query, 300);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Charger l'historique depuis localStorage
    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history).slice(0, 5));
        }
    }, []);

    // Fonction de recherche principale
    const performSearch = useCallback(async (searchQuery = debouncedQuery, page = 1) => {
        if (!searchQuery.trim()) {
            setResults({ articles: [], authors: [], categories: [], total: 0 });
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: searchQuery,
                page: page.toString(),
                limit: '12',
                tab: activeTab,
                ...filters
            });

            const response = await fetch(`/api/search?${params}`);
            const data = await response.json();

            setResults(data);
            setTotalPages(Math.ceil(data.total / 12));

            // Mettre à jour l'URL
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('q', searchQuery);
            if (page > 1) newUrl.searchParams.set('page', page.toString());
            else newUrl.searchParams.delete('page');

            router.replace(newUrl.toString(), { scroll: false });

        } catch (error) {
            console.error('Erreur de recherche:', error);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, activeTab, filters, router]);

    // Recherche automatique quand la query change
    useEffect(() => {
        performSearch(debouncedQuery, 1);
        setCurrentPage(1);
    }, [debouncedQuery, activeTab, filters]);

    // Fonction pour les suggestions en temps réel
    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error('Erreur suggestions:', error);
        }
    }, []);

    // Gestionnaire de changement de query
    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.length >= 2) {
            fetchSuggestions(newQuery);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Sélectionner une suggestion
    const selectSuggestion = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        addToHistory(suggestion);
    };

    // Ajouter à l'historique
    const addToHistory = (searchQuery) => {
        const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // Gestionnaire de soumission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            addToHistory(query.trim());
            setShowSuggestions(false);
            performSearch(query.trim(), 1);
        }
    };

    // Effacer la recherche
    const clearSearch = () => {
        setQuery('');
        setResults({ articles: [], authors: [], categories: [], total: 0 });
        setShowSuggestions(false);
        router.replace('/search');
    };

    // Gestionnaire de pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        performSearch(debouncedQuery, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container py-8">
                {/* Section de recherche */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="text-center mb-8">
                        <h1 className="h1-title text-gray-900 mb-4">
                            Rechercher dans TechPulse
                        </h1>
                        <p className="body-text text-gray-600">
                            Trouvez des articles, auteurs et catégories
                        </p>
                    </div>

                    {/* Barre de recherche principale */}
                    <div className="relative">
                        <form onSubmit={handleSubmit} className="relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={handleQueryChange}
                                    placeholder="Rechercher des articles, auteurs, catégories..."
                                    className="w-full pl-12 pr-20 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white shadow-sm"
                                    autoComplete="off"
                                />

                                {/* Boutons dans l'input */}
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-teal-100 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Suggestions et historique */}
                        {(showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">

                                {/* Suggestions */}
                                {suggestions.length > 0 && (
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="h6-title text-gray-700 mb-2 flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Suggestions
                                        </h3>
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => selectSuggestion(suggestion)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <span className="body-text text-gray-900">{suggestion}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Historique */}
                                {searchHistory.length > 0 && (
                                    <div className="p-4">
                                        <h3 className="h6-title text-gray-700 mb-2 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Recherches récentes
                                        </h3>
                                        {searchHistory.map((historyItem, index) => (
                                            <button
                                                key={index}
                                                onClick={() => selectSuggestion(historyItem)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                                            >
                                                <span className="body-text text-gray-700">{historyItem}</span>
                                                <Clock className="w-3 h-3 text-gray-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Filtres avancés */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-white border border-gray-200 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="h6-title text-gray-700 mb-2">Période</label>
                                    <select
                                        value={filters.dateRange}
                                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="all">Toute période</option>
                                        <option value="week">Cette semaine</option>
                                        <option value="month">Ce mois</option>
                                        <option value="year">Cette année</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="h6-title text-gray-700 mb-2">Trier par</label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="relevance">Pertinence</option>
                                        <option value="date">Date</option>
                                        <option value="popularity">Popularité</option>
                                        <option value="views">Vues</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="h6-title text-gray-700 mb-2">Catégorie</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="all">Toutes</option>
                                        <option value="development">Développement</option>
                                        <option value="design">Design</option>
                                        <option value="ai">Intelligence Artificielle</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="h6-title text-gray-700 mb-2">Type</label>
                                    <select
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="all">Tout</option>
                                        <option value="articles">Articles</option>
                                        <option value="authors">Auteurs</option>
                                        <option value="categories">Catégories</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Résultats */}
                <div className="max-w-6xl mx-auto">
                    {/* Indicateur de résultats */}
                    {query && (
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="h3-title text-gray-900">
                                    {loading ? 'Recherche en cours...' : `${results.total} résultat${results.total !== 1 ? 's' : ''}`}
                                    {query && <span className="text-teal-600"> pour "{query}"</span>}
                                </h2>
                                {!loading && results.total > 0 && (
                                    <p className="small-text text-gray-500 mt-1">
                                        Page {currentPage} sur {totalPages}
                                    </p>
                                )}
                            </div>

                            {/* Onglets de résultats */}
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                {[
                                    { key: 'all', label: 'Tout', count: results.total },
                                    { key: 'articles', label: 'Articles', count: results.articles?.length || 0 },
                                    { key: 'authors', label: 'Auteurs', count: results.authors?.length || 0 },
                                    { key: 'categories', label: 'Catégories', count: results.categories?.length || 0 }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab.label} {tab.count > 0 && `(${tab.count})`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* État de chargement */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                            <span className="ml-3 text-gray-600">Recherche en cours...</span>
                        </div>
                    )}

                    {/* Résultats vides */}
                    {!loading && query && results.total === 0 && (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="h3-title text-gray-900 mb-2">
                                Aucun résultat trouvé
                            </h3>
                            <p className="body-text text-gray-600 mb-6">
                                Essayez avec des mots-clés différents ou plus généraux
                            </p>
                            <button
                                onClick={clearSearch}
                                className="btn-secondary"
                            >
                                Effacer la recherche
                            </button>
                        </div>
                    )}

                    {/* Résultats */}
                    {!loading && results.total > 0 && (
                        <div className="space-y-8">

                            {/* Articles */}
                            {(activeTab === 'all' || activeTab === 'articles') && results.articles?.length > 0 && (
                                <div>
                                    <h3 className="h4-title text-gray-900 mb-4 flex items-center">
                                        <FileText className="w-5 h-5 mr-2" />
                                        Articles ({results.articles.length})
                                    </h3>
                                    <div className="grid gap-6">
                                        {results.articles.map((article) => (
                                            <SearchArticleCard key={article.id} article={article} query={query} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Auteurs */}
                            {(activeTab === 'all' || activeTab === 'authors') && results.authors?.length > 0 && (
                                <div>
                                    <h3 className="h4-title text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Auteurs ({results.authors.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {results.authors.map((author) => (
                                            <SearchAuthorCard key={author.id} author={author} query={query} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Catégories */}
                            {(activeTab === 'all' || activeTab === 'categories') && results.categories?.length > 0 && (
                                <div>
                                    <h3 className="h4-title text-gray-900 mb-4 flex items-center">
                                        <Tag className="w-5 h-5 mr-2" />
                                        Catégories ({results.categories.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {results.categories.map((category) => (
                                            <SearchCategoryCard key={category.id} category={category} query={query} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-90" />
                                </button>

                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                                ? 'bg-teal-600 text-white'
                                                : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-5 h-5 -rotate-90" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Composant pour les cartes d'articles dans les résultats
function SearchArticleCard({ article, query }) {
    // Fonction pour surligner les termes de recherche
    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${article.imageColor || 'bg-gray-200'} rounded-lg flex-shrink-0`}></div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        {article.category && (
                            <span className="badge badge-primary text-xs">
                                {article.category.name}
                            </span>
                        )}
                        <span className="small-text text-gray-500">
                            {article.readTime}
                        </span>
                    </div>

                    <h3 className="h4-title text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                        <a href={`/articles/${article.slug}`}
                            dangerouslySetInnerHTML={{ __html: highlightText(article.title, query) }}
                        />
                    </h3>

                    <p className="body-text text-gray-600 mb-3 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: highlightText(article.description || '', query) }}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 small-text text-gray-500">
                            <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {article.author?.name}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                            </span>
                        </div>

                        <div className="flex items-center space-x-3 small-text text-gray-500">
                            <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {article.views || 0}
                            </span>
                            <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {article.likes || 0}
                            </span>
                            <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {article.commentsCount || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant pour les cartes d'auteurs
function SearchAuthorCard({ author, query }) {
    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">
                        {author.name.charAt(0)}
                    </span>
                </div>

                <h3 className="h5-title text-gray-900 mb-1">
                    <a href={`/author/${author.username}`}
                        dangerouslySetInnerHTML={{ __html: highlightText(author.name, query) }}
                    />
                </h3>

                <p className="small-text text-gray-600 mb-3"
                    dangerouslySetInnerHTML={{ __html: highlightText(author.bio || '', query) }}
                />

                <div className="small-text text-gray-500">
                    {author.articlesCount || 0} article{(author.articlesCount || 0) !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}

// Composant pour les cartes de catégories
function SearchCategoryCard({ category, query }) {
    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
                <Tag className="w-8 h-8 text-gray-600 mx-auto mb-3" />

                <h3 className="h5-title text-gray-900 mb-2">
                    <a href={`/articles?category=${category.slug}`}
                        dangerouslySetInnerHTML={{ __html: highlightText(category.name, query) }}
                    />
                </h3>

                <p className="small-text text-gray-600 mb-3"
                    dangerouslySetInnerHTML={{ __html: highlightText(category.description || '', query) }}
                />

                <div className="small-text text-gray-500">
                    {category.articlesCount || 0} article{(category.articlesCount || 0) !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}