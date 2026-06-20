import { useMemo } from 'react';
import { searchUtility } from './SearchUtility';
import { filterUtility } from './FilterUtility';

/**
 * Reusable React Hook to search, filter, and sort a catalog list (e.g. Products or Rentals)
 * 
 * @param {Array} data - The array of items in the catalog (products, tools, etc.)
 * @param {Object} params - The current active filtering & sorting criteria from Redux
 * @returns {Array} The fully searched, filtered, and sorted catalog array
 */
export const useFilteredCatalog = (data, { searchTerm = '', selectedCategory = 'All', selectedBrand = 'All', sortBy = 'featured' }) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    // 1. Run Search Query (on name, brand, category, and optionally description)
    let result = searchUtility(data, searchTerm, ['name', 'brand', 'category', 'description']);

    // 2. Filter by Category and/or Brand
    const filters = {};
    if (selectedCategory && selectedCategory !== 'All') {
      filters.category = selectedCategory;
    }
    if (selectedBrand && selectedBrand !== 'All') {
      filters.brand = selectedBrand;
    }
    
    result = filterUtility(result, filters);

    // 3. Sort Results
    return [...result].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // Default Featured (maintains initial array order)
    });
  }, [data, searchTerm, selectedCategory, selectedBrand, sortBy]);
};
