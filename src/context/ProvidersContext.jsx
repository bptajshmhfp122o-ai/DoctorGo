import { createContext, useContext, useState, useCallback } from 'react';
import { getProviders, getProviderById } from '../api/mockService';

/**
 * Providers Context
 * Manages provider search and data state
 */
const ProvidersContext = createContext(null);

/**
 * ProvidersProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ProvidersProvider({ children }) {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    location: '',
    specialty: 'all',
    q: '',
    sort: 'rating'
  });

  /**
   * Search providers with filters
   * @param {Object} params - Search parameters
   */
  const searchProviders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    const newParams = { ...searchParams, ...params };
    setSearchParams(newParams);
    
    try {
      const results = await getProviders(newParams);
      setProviders(results);
    } catch (err) {
      setError(err.message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  /**
   * Fetch a single provider by ID
   * @param {string} id - Provider ID
   */
  const fetchProvider = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = await getProviderById(id);
      if (!provider) {
        throw new Error('Provider not found');
      }
      setSelectedProvider(provider);
      return provider;
    } catch (err) {
      setError(err.message);
      setSelectedProvider(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear selected provider
   */
  const clearSelectedProvider = useCallback(() => {
    setSelectedProvider(null);
  }, []);

  /**
   * Update search parameters
   * @param {Object} params - Parameters to update
   */
  const updateSearchParams = useCallback((params) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  }, []);

  const value = {
    providers,
    selectedProvider,
    loading,
    error,
    searchParams,
    searchProviders,
    fetchProvider,
    clearSelectedProvider,
    updateSearchParams
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
}

/**
 * Hook to access providers context
 * @returns {Object} Providers context value
 */
export function useProviders() {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error('useProviders must be used within a ProvidersProvider');
  }
  return context;
}
