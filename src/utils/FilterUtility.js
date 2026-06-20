// FilterUtility.js
export const filterUtility = (data, filters = {}) => {
  if (!data || data.length === 0) return [];
  if (Object.keys(filters).length === 0) return data;

  return data.filter((item) => {
    return Object.entries(filters).every(([key, filterValue]) => {
      const itemValue = item[key];

      // If filter is empty or undefined, skip it
      if (filterValue == null || filterValue === '') return true;

      // Handle array filters (multiple selection - e.g. categories)
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true;
        // If item value is also array (multi-value field)
        if (Array.isArray(itemValue)) {
          return filterValue.some((val) => itemValue.includes(val));
        }
        return filterValue.includes(itemValue);
      }

      // Handle range filters (min/max)
      if (typeof filterValue === 'object' && (filterValue.min !== undefined || filterValue.max !== undefined)) {
        if (itemValue == null) return false;
        const numValue = Number(itemValue);

        if (isNaN(numValue)) return false;

        if (filterValue.min !== undefined && numValue < filterValue.min) return false;
        if (filterValue.max !== undefined && numValue > filterValue.max) return false;

        return true;
      }

      // Default: exact match
      return itemValue === filterValue;
    });
  });
};
