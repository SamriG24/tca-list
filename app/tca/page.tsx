'use client';

import { Category } from '@/types/nominees';
import { useEffect, useState, useMemo } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://tcaapi.kaba.et/api/nominee-categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-gray-400">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 py-10 px-4 sm:px-6 lg:px-8 overflow-y-scroll scrollbar-hide">

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Nominee Categories
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Browse through different categories and vote for your favorite creators.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-gray-400 text-sm">
          {filteredCategories.length} of {categories.length} categories found
          {searchTerm && (
            <span>
              {' '}for &aps;<span className="text-white">{searchTerm}</span>&ps;
            </span>
          )}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <a
              key={category.id}
              href={`/tca/category/${category.id}`}
              className="block rounded-2xl bg-[#121212] border border-gray-800 shadow-lg hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden group"
            >
              {/* Image - Increased height */}
              <div className="h-64 sm:h-72 md:h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-40 p-4 rounded-md h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-md sm:text-md font-semibold text-white mb-2 line-clamp-1">
                  {category.name}
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {category.criteria.length} criteria
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                    View Nominees
                  </span>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
            <p className="text-gray-400">
              No categories match your search. Try different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
