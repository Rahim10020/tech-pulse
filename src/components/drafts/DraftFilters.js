"use client";

import { useState } from "react";
import { Search, Filter, X, Calendar, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DraftFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories = [],
  totalDrafts = 0,
  filteredCount = 0,
  onClearFilters,
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() || selectedCategory !== "all" || sortBy !== "updated";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("updated");
    setShowAdvancedFilters(false);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Ligne principale */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par titre, contenu ou catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 body-text"
          />
        </div>

        {/* Filtres principaux */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Catégorie */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 body-text bg-white min-w-[180px]"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 body-text bg-white min-w-[200px]"
            >
              <option value="updated">Dernière modification</option>
              <option value="created">Date de création</option>
              <option value="title">Titre (A-Z)</option>
              <option value="wordcount">Nombre de mots</option>
            </select>
          </div>

          {/* Bouton filtres avancés */}
          <Button
            variant={showAdvancedFilters ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            icon={<Filter className="w-4 h-4" />}
            className="hidden sm:flex"
          >
            Filtres
          </Button>

          {/* Bouton de réinitialisation */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              icon={<X className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Filtres avancés (collapsibles) */}
      {showAdvancedFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Période de création */}
            <div>
              <label className="h5-title text-gray-700 mb-2">
                Période de création
              </label>
              <select className="w-full input-field">
                <option value="all">Toute période</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>

            {/* Nombre de mots */}
            <div>
              <label className="h5-title text-gray-700 mb-2">
                Nombre de mots
              </label>
              <select className="w-full input-field">
                <option value="all">Tous</option>
                <option value="short">Court (0-300 mots)</option>
                <option value="medium">Moyen (300-1000 mots)</option>
                <option value="long">Long (1000+ mots)</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="h5-title text-gray-700 mb-2">
                Statut
              </label>
              <select className="w-full input-field">
                <option value="all">Tous les brouillons</option>
                <option value="empty">Brouillons vides</option>
                <option value="incomplete">Incomplets</option>
                <option value="ready">Prêts à publier</option>
              </select>
            </div>
          </div>

          {/* Actions avancées */}
          <div className="mt-4 flex items-center justify-between">
            <div className="small-text text-gray-600">
              <span className="font-medium">{filteredCount}</span> brouillon
              {filteredCount !== 1 ? "s" : ""}
              {filteredCount !== totalDrafts && (
                <span>
                  {" "}
                  sur <span className="font-medium">{totalDrafts}</span> au
                  total
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Masquer les filtres avancés
            </Button>
          </div>
        </div>
      )}

      {/* Résumé des filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="small-text text-gray-600">
              Filtres actifs:
            </span>

            {searchQuery.trim() && (
              <span className="badge badge-primary">
                Recherche: "{searchQuery.substring(0, 20)}
                {searchQuery.length > 20 ? "..." : ""}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-teal-600 hover:text-teal-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="badge badge-primary">
                Catégorie:{" "}
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy !== "updated" && (
              <span className="badge badge-primary">
                Tri:{" "}
                {sortBy === "created"
                  ? "Date de création"
                  : sortBy === "title"
                    ? "Titre"
                    : "Mots"}
                <button
                  onClick={() => setSortBy("updated")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}