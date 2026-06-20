// searchUtility.js
export const searchUtility = (data, query, fields = null) => {
  if (!query || query.trim() === '') {
    return data; // Return all data if search is empty
  }

  const searchTerm = query.toLowerCase().trim();

  return data.filter((item) => {
    // If no specific fields provided, search all string/number fields
    if (!fields || fields.length === 0) {
      return Object.values(item).some((value) => {
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm);
      });
    }

    // Search only in specified fields
    return fields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
};