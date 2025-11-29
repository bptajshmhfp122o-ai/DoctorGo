import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import { Card, CardBody } from '../common/Card';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { Loading } from '../common/Loading';
import { getRecommendations } from '../../api/mockService';
import './SymptomHelper.css';

/**
 * Browser-based symptom helper component
 * Provides provider recommendations based on symptom text input
 */
export function SymptomHelper() {
  const [symptoms, setSymptoms] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      const results = await getRecommendations({ symptomsText: symptoms });
      setRecommendations(results);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setRecommendations([]);
    setSearched(false);
  };

  return (
    <div className="symptom-helper">
      <div className="symptom-helper__header">
        <div className="symptom-helper__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </div>
        <h1 className="symptom-helper__title">Symptom Helper</h1>
        <p className="symptom-helper__description">
          Describe your symptoms in your own words, and we'll suggest healthcare providers 
          who can help. This is a preliminary tool - always consult a healthcare professional 
          for medical advice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="symptom-helper__form">
        <Textarea
          id="symptoms-input"
          label="Describe your symptoms"
          placeholder="E.g., I've been experiencing headaches and fatigue for the past week, along with some dizziness when standing up..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          required
        />
        <div className="symptom-helper__actions">
          {searched && (
            <Button type="button" variant="ghost" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button type="submit" disabled={!symptoms.trim() || loading} loading={loading}>
            Find Providers
          </Button>
        </div>
      </form>

      {loading && (
        <div className="symptom-helper__loading">
          <Loading text="Analyzing symptoms..." />
        </div>
      )}

      {!loading && searched && recommendations.length > 0 && (
        <div className="symptom-helper__results">
          <h2 className="symptom-helper__results-title">
            Recommended Providers
          </h2>
          <p className="symptom-helper__results-subtitle">
            Based on your symptoms, we recommend consulting with these specialists:
          </p>

          <div className="symptom-helper__recommendations">
            {recommendations.map((rec, index) => (
              <Card key={rec.providerId} className="symptom-helper__recommendation">
                <CardBody>
                  <div className="symptom-helper__recommendation-header">
                    <Badge variant="primary" size="small">#{index + 1} Match</Badge>
                    <span className="symptom-helper__confidence">
                      {Math.round(rec.confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  <div className="symptom-helper__recommendation-content">
                    <h3 className="symptom-helper__recommendation-name">
                      {rec.providerName}
                    </h3>
                    <p className="symptom-helper__recommendation-specialty">
                      {rec.specialty}
                    </p>
                    <Rating value={rec.rating} size="small" />
                  </div>

                  <div className="symptom-helper__recommendation-rationale">
                    <strong>Why this provider?</strong>
                    <p>{rec.rationale}</p>
                  </div>

                  <Link 
                    to={`/provider/${rec.providerId}`}
                    className="symptom-helper__recommendation-link"
                  >
                    View Profile & Book
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && searched && recommendations.length === 0 && (
        <div className="symptom-helper__no-results">
          <p>No specific recommendations found. Please try describing your symptoms differently, or browse all providers.</p>
          <Link to="/">
            <Button variant="outline">Browse All Providers</Button>
          </Link>
        </div>
      )}

      <div className="symptom-helper__disclaimer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          <strong>Disclaimer:</strong> This tool is for informational purposes only and does not 
          constitute medical advice. The recommendations are based on keyword matching and should 
          not replace professional medical consultation. If you're experiencing a medical emergency, 
          please call emergency services immediately.
        </p>
      </div>
    </div>
  );
}
