import './MapPlaceholder.css';

/**
 * Map placeholder component with interactive pins
 * @param {Object} props - Component props
 * @param {Array} props.providers - List of providers to show
 * @param {Object} [props.selectedProvider] - Currently selected provider
 * @param {Function} [props.onSelectProvider] - Provider selection handler
 */
export function MapPlaceholder({ providers = [], selectedProvider, onSelectProvider }) {
  // Normalize coordinates to fit in the placeholder
  const getPosition = (provider) => {
    const minLat = 40.7;
    const maxLat = 40.8;
    const minLng = -74.1;
    const maxLng = -73.9;

    const lat = provider.coordinates?.lat || 40.75;
    const lng = provider.coordinates?.lng || -74;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.min(Math.max(x, 5), 95)}%`,
      top: `${Math.min(Math.max(y, 5), 95)}%`
    };
  };

  return (
    <div className="map-placeholder" role="img" aria-label="Map showing provider locations">
      <div className="map-placeholder__background">
        {/* Grid lines for visual effect */}
        <div className="map-placeholder__grid" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} className="map-placeholder__grid-line map-placeholder__grid-line--horizontal" style={{ top: `${(i + 1) * 20}%` }} />
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} className="map-placeholder__grid-line map-placeholder__grid-line--vertical" style={{ left: `${(i + 1) * 20}%` }} />
          ))}
        </div>

        {/* Provider pins */}
        {providers.map(provider => {
          const position = getPosition(provider);
          const isSelected = selectedProvider?.id === provider.id;

          return (
            <button
              key={provider.id}
              className={`map-placeholder__pin ${isSelected ? 'map-placeholder__pin--selected' : ''}`}
              style={position}
              onClick={() => onSelectProvider?.(provider)}
              aria-label={`${provider.name}, ${provider.specialty}`}
              aria-pressed={isSelected}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {isSelected && (
                <div className="map-placeholder__tooltip">
                  <strong>{provider.name}</strong>
                  <span>{provider.specialty}</span>
                </div>
              )}
            </button>
          );
        })}

        {/* Map label */}
        <div className="map-placeholder__label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Interactive Map</span>
          <p>Click on pins to view provider details</p>
        </div>
      </div>
    </div>
  );
}
