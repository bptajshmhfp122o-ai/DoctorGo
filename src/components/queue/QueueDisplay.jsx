import { useEffect, useState } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './QueueDisplay.css';

/**
 * Virtual queue display component
 * @param {Object} props - Component props
 * @param {Object} props.queueEntry - Queue entry data
 * @param {Function} props.onRefresh - Refresh handler
 * @param {Function} props.onLeave - Leave queue handler
 * @param {Object} [props.provider] - Provider data
 */
export function QueueDisplay({ queueEntry, onRefresh, onLeave, provider }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Auto-refresh queue status every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      onRefresh?.();
    }, 30000);

    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
    };
  }, [onRefresh]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'invited': return 'success';
      case 'waiting': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (!queueEntry) return null;

  return (
    <div className="queue-display">
      <div className="queue-display__header">
        <h2 className="queue-display__title">Virtual Queue</h2>
        <Badge variant={getStatusVariant(queueEntry.status)} size="large">
          {queueEntry.status === 'invited' ? 'Your Turn!' : queueEntry.status}
        </Badge>
      </div>

      {provider && (
        <div className="queue-display__provider">
          <span className="queue-display__provider-label">Provider:</span>
          <span className="queue-display__provider-name">{provider.name}</span>
        </div>
      )}

      <div className="queue-display__main">
        <div className="queue-display__position">
          <div className="queue-display__position-number" aria-live="polite">
            {queueEntry.position}
          </div>
          <div className="queue-display__position-label">
            {queueEntry.position === 1 ? "You're Next!" : 'Position in Queue'}
          </div>
        </div>

        <div className="queue-display__stats">
          <div className="queue-display__stat">
            <span className="queue-display__stat-value">{queueEntry.estimatedWait || queueEntry.eta || 0}</span>
            <span className="queue-display__stat-label">Est. Wait (min)</span>
          </div>
          <div className="queue-display__stat">
            <span className="queue-display__stat-value">{formatTime(timeElapsed)}</span>
            <span className="queue-display__stat-label">Time Waiting</span>
          </div>
        </div>
      </div>

      <div className="queue-display__token">
        <span className="queue-display__token-label">Your Token</span>
        <code className="queue-display__token-value">{queueEntry.token}</code>
      </div>

      {queueEntry.status === 'invited' && (
        <div className="queue-display__alert" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          <div>
            <strong>It's your turn!</strong>
            <p>Please proceed to the provider's office.</p>
          </div>
        </div>
      )}

      <div className="queue-display__actions">
        <Button variant="outline" onClick={onRefresh} size="small">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, marginRight: 4 }}>
            <polyline points="23,4 23,10 17,10" />
            <polyline points="1,20 1,14 7,14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh Status
        </Button>
        <Button variant="ghost" onClick={onLeave} size="small">
          Leave Queue
        </Button>
      </div>

      <p className="queue-display__note">
        Status updates automatically every 30 seconds
      </p>
    </div>
  );
}
