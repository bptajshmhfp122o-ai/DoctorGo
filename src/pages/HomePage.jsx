import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/providers/SearchBar';
import { ProviderCard } from '../components/providers/ProviderCard';
import { MapPlaceholder } from '../components/providers/MapPlaceholder';
import { Loading } from '../components/common/Loading';
import { EmptyState, ErrorState } from '../components/common/EmptyState';
import { useProviders } from '../context/ProvidersContext';
import './HomePage.css';

/**
 * Home page with provider search and discovery
 */
export function HomePage() {
  const { 
    providers, 
    loading, 
    error, 
    searchProviders, 
    searchParams 
  } = useProviders();
  
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'list', 'map', 'split'

  // Initial search on mount
  useEffect(() => {
    searchProviders();
  }, []);

  const handleSearch = (params) => {
    searchProviders(params);
    setSelectedProvider(null);
  };

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
  };

  return (
    <Layout>
      <div className="home-page">
        <section className="home-page__hero">
          <div className="home-page__hero-content">
            <h1 className="home-page__title">
              Find the Right Healthcare Provider
            </h1>
            <p className="home-page__subtitle">
              Search and book appointments with top-rated doctors, specialists, 
              and healthcare providers in your area.
            </p>
          </div>
          <div className="home-page__search">
            <SearchBar onSearch={handleSearch} initialValues={searchParams} />
          </div>
        </section>

        <section className="home-page__results" aria-label="Search results">
          <div className="home-page__results-header">
            <div className="home-page__results-info">
              <h2 className="home-page__results-title">
                {loading ? 'Searching...' : `${providers.length} Providers Found`}
              </h2>
              {searchParams.specialty && searchParams.specialty !== 'all' && (
                <span className="home-page__results-filter">
                  Specialty: {searchParams.specialty}
                </span>
              )}
            </div>
            <div className="home-page__view-toggle" role="group" aria-label="View mode">
              <button
                className={`home-page__view-btn ${viewMode === 'list' ? 'home-page__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                List
              </button>
              <button
                className={`home-page__view-btn ${viewMode === 'split' ? 'home-page__view-btn--active' : ''}`}
                onClick={() => setViewMode('split')}
                aria-pressed={viewMode === 'split'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="18" />
                  <rect x="14" y="3" width="7" height="18" />
                </svg>
                Split
              </button>
              <button
                className={`home-page__view-btn ${viewMode === 'map' ? 'home-page__view-btn--active' : ''}`}
                onClick={() => setViewMode('map')}
                aria-pressed={viewMode === 'map'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Map
              </button>
            </div>
          </div>

          {loading && (
            <div className="home-page__loading">
              <Loading text="Finding providers..." />
            </div>
          )}

          {error && !loading && (
            <ErrorState 
              title="Unable to load providers" 
              message={error}
              onRetry={() => searchProviders(searchParams)}
            />
          )}

          {!loading && !error && providers.length === 0 && (
            <EmptyState
              title="No providers found"
              description="Try adjusting your search filters or location to find more providers."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              }
            />
          )}

          {!loading && !error && providers.length > 0 && (
            <div className={`home-page__content home-page__content--${viewMode}`}>
              {(viewMode === 'list' || viewMode === 'split') && (
                <div className="home-page__list">
                  {providers.map(provider => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      selected={selectedProvider?.id === provider.id}
                      onSelect={handleSelectProvider}
                    />
                  ))}
                </div>
              )}
              {(viewMode === 'map' || viewMode === 'split') && (
                <div className="home-page__map">
                  <MapPlaceholder
                    providers={providers}
                    selectedProvider={selectedProvider}
                    onSelectProvider={handleSelectProvider}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
