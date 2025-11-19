import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function SearchFilterSection({ 
    onSearch, 
    onFilter, 
    categories = [], 
    placeholder = "Search products...",
    showCategories = true,
    showSort = true,
    className = ""
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({
            term: searchTerm,
            category: selectedCategory,
            sort: sortBy
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('name');
        onFilter({
            term: '',
            category: '',
            sort: 'name'
        });
    };

    return (
        <div className={`bg-white shadow-sm border-b ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={placeholder}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear All</span>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category Filter */}
                                {showCategories && categories.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Sort Filter */}
                                {showSort && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sort By
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="name">Name (A-Z)</option>
                                            <option value="name_desc">Name (Z-A)</option>
                                            <option value="price">Price (Low to High)</option>
                                            <option value="price_desc">Price (High to Low)</option>
                                            <option value="created_at">Newest First</option>
                                            <option value="created_at_desc">Oldest First</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
