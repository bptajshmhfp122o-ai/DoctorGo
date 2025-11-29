import { useState } from 'react';
import { Button } from '../common/Button';
import { Select } from '../common/Input';
import './SearchBar.css';

const SPECIALTIES = [
  { value: 'all', label: 'All Specialties' },
  { value: 'General Practice', label: 'General Practice' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Psychiatry', label: 'Psychiatry' }
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'cost', label: 'Lowest Cost' },
  { value: 'queue', label: 'Shortest Wait' },
  { value: 'name', label: 'Name (A-Z)' }
];

/**
 * Provider search bar component
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Search handler
 * @param {Object} [props.initialValues] - Initial search values
 */
export function SearchBar({ onSearch, initialValues = {} }) {
  const [location, setLocation] = useState(initialValues.location || '');
  const [specialty, setSpecialty] = useState(initialValues.specialty || 'all');
  const [query, setQuery] = useState(initialValues.q || '');
  const [sort, setSort] = useState(initialValues.sort || 'rating');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, specialty, q: query, sort });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-bar__fields">
        <div className="search-bar__field search-bar__field--location">
          <label htmlFor="search-location" className="search-bar__label">Location</label>
          <div className="search-bar__input-wrapper">
            <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              id="search-location"
              type="text"
              className="search-bar__input"
              placeholder="City, ZIP, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="search-bar__field search-bar__field--specialty">
          <Select
            id="search-specialty"
            label="Specialty"
            options={SPECIALTIES}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>

        <div className="search-bar__field search-bar__field--query">
          <label htmlFor="search-query" className="search-bar__label">Search</label>
          <div className="search-bar__input-wrapper">
            <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="search-query"
              type="text"
              className="search-bar__input"
              placeholder="Provider name or condition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="search-bar__field search-bar__field--sort">
          <Select
            id="search-sort"
            label="Sort by"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </div>

        <div className="search-bar__field search-bar__field--submit">
          <Button type="submit" fullWidth>
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
