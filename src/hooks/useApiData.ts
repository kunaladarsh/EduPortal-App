import { useState, useEffect, useCallback, useRef } from 'react';

// Generic hook for API data fetching with loading, error, and retry logic
export function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData, // Allow manual data updates
    setError, // Allow manual error clearing
  };
}

// Hook for managing CRUD operations with optimistic updates
export function useCrudOperations<T extends { id: string }>(
  fetchFn: () => Promise<T[]>,
  createFn?: (data: Partial<T>) => Promise<T>,
  updateFn?: (id: string, data: Partial<T>) => Promise<T>,
  deleteFn?: (id: string) => Promise<boolean>
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);
  
  // Use ref to store the latest fetchFn without triggering re-renders
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFnRef.current();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create operation
  const create = useCallback(async (data: Partial<T>) => {
    if (!createFn) {
      throw new Error('Create function not provided');
    }

    try {
      setOperationLoading(true);
      setError(null);
      const newItem = await createFn(data);
      
      // Optimistic update
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [createFn]);

  // Update operation
  const update = useCallback(async (id: string, data: Partial<T>) => {
    if (!updateFn) {
      throw new Error('Update function not provided');
    }

    try {
      setOperationLoading(true);
      setError(null);
      const updatedItem = await updateFn(id, data);
      
      // Optimistic update
      setItems(prev => 
        prev.map(item => item.id === id ? updatedItem : item)
      );
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [updateFn]);

  // Delete operation
  const remove = useCallback(async (id: string) => {
    if (!deleteFn) {
      throw new Error('Delete function not provided');
    }

    try {
      setOperationLoading(true);
      setError(null);
      await deleteFn(id);
      
      // Optimistic update
      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [deleteFn]);

  return {
    items,
    loading,
    error,
    operationLoading,
    refetch: loadData,
    create,
    update,
    remove,
    setItems,
    setError,
  };
}

// Hook for managing lists with search, filter, and pagination
export function useListData<T>(
  data: T[],
  searchFn?: (item: T, query: string) => boolean,
  filterFn?: (item: T, filters: any) => boolean,
  sortFn?: (a: T, b: T) => number
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and search data
  const filteredData = data.filter(item => {
    // Apply search
    if (searchQuery && searchFn && !searchFn(item, searchQuery)) {
      return false;
    }
    // Apply filters
    if (filterFn && !filterFn(item, filters)) {
      return false;
    }
    return true;
  });

  // Sort data
  const sortedData = sortFn 
    ? [...filteredData].sort((a, b) => {
        const result = sortFn(a, b);
        return sortOrder === 'desc' ? -result : result;
      })
    : filteredData;

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return {
    // Data
    items: paginatedData,
    allItems: sortedData,
    totalItems: sortedData.length,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    filters,
    setFilters,
    updateFilter: (key: string, value: any) => 
      setFilters(prev => ({ ...prev, [key]: value })),
    clearFilters: () => setFilters({}),
    
    // Sorting
    sortOrder,
    setSortOrder,
    toggleSortOrder: () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc'),
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
    prevPage: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
  };
}