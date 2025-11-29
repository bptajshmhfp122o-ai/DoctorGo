import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';
import { 
  getProviderById, 
  getProviderQueue, 
  inviteNextPatient,
  postponePatient,
  cancelQueueEntry,
  updateProviderAvailability 
} from '../api/mockService';
import './ProviderPanelPage.css';

/**
 * Provider/Clinic Management Panel
 */
export function ProviderPanelPage() {
  const [providerId, setProviderId] = useState('prov-001');
  const [provider, setProvider] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  const loadProviderData = async () => {
    setLoading(true);
    try {
      const [providerData, queueData] = await Promise.all([
        getProviderById(providerId),
        getProviderQueue(providerId)
      ]);
      setProvider(providerData);
      setQueue(queueData);
    } catch (err) {
      console.error('Failed to load provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [providerId]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInviteNext = async () => {
    setActionLoading(true);
    try {
      const result = await inviteNextPatient(providerId);
      showMessage(result.message);
      loadProviderData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostpone = async (token) => {
    setActionLoading(true);
    try {
      const result = await postponePatient(token);
      showMessage(`Patient postponed to position ${result.newPosition}`);
      loadProviderData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (token) => {
    setActionLoading(true);
    try {
      await cancelQueueEntry(token);
      showMessage('Queue entry cancelled');
      loadProviderData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.date || !newSlot.time) return;
    
    setActionLoading(true);
    try {
      const updatedSlots = [
        ...(provider.availabilitySlots || []),
        { date: newSlot.date, time: newSlot.time, available: true }
      ];
      await updateProviderAvailability(providerId, updatedSlots);
      showMessage('Slot added successfully');
      setNewSlot({ date: '', time: '' });
      loadProviderData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSlot = async (slotId) => {
    setActionLoading(true);
    try {
      const updatedSlots = provider.availabilitySlots.map(slot =>
        slot.id === slotId ? { ...slot, available: !slot.available } : slot
      );
      await updateProviderAvailability(providerId, updatedSlots);
      showMessage('Slot availability updated');
      loadProviderData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="provider-panel__loading">
          <Loading text="Loading provider panel..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="provider-panel">
        <div className="provider-panel__container">
          <header className="provider-panel__header">
            <h1 className="provider-panel__title">Provider Management Panel</h1>
            <p className="provider-panel__subtitle">
              Manage your queue, appointments, and availability
            </p>
          </header>

          {/* Provider Selector */}
          <Card className="provider-panel__selector">
            <CardBody>
              <div className="provider-panel__selector-content">
                <label htmlFor="provider-select" className="provider-panel__selector-label">
                  Select Provider (Demo)
                </label>
                <select
                  id="provider-select"
                  className="provider-panel__select"
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                >
                  <option value="prov-001">Dr. Sarah Chen - General Practice</option>
                  <option value="prov-002">Dr. Michael Roberts - Cardiology</option>
                  <option value="prov-003">Dr. Emily Watson - Dermatology</option>
                  <option value="prov-004">Dr. James Park - Orthopedics</option>
                  <option value="prov-005">Dr. Amanda Foster - Pediatrics</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Message Toast */}
          {message && (
            <div className={`provider-panel__message provider-panel__message--${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          {provider && (
            <div className="provider-panel__grid">
              {/* Queue Management */}
              <Card className="provider-panel__section">
                <CardHeader>
                  <h2 className="provider-panel__section-title">
                    Virtual Queue
                    <Badge variant="primary">{queue.length} patients</Badge>
                  </h2>
                </CardHeader>
                <CardBody>
                  <Button 
                    onClick={handleInviteNext} 
                    fullWidth 
                    loading={actionLoading}
                    disabled={queue.filter(q => q.status === 'waiting').length === 0}
                  >
                    Invite Next Patient
                  </Button>

                  {queue.length === 0 ? (
                    <p className="provider-panel__empty">No patients in queue</p>
                  ) : (
                    <ul className="provider-panel__queue-list">
                      {queue.map(entry => (
                        <li key={entry.token} className="provider-panel__queue-item">
                          <div className="provider-panel__queue-info">
                            <span className="provider-panel__queue-position">#{entry.position}</span>
                            <div className="provider-panel__queue-details">
                              <code className="provider-panel__queue-token">{entry.token}</code>
                              <span className="provider-panel__queue-time">
                                Joined: {new Date(entry.joinedAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <Badge variant={entry.status === 'invited' ? 'success' : 'warning'} size="small">
                              {entry.status}
                            </Badge>
                          </div>
                          {entry.status === 'waiting' && (
                            <div className="provider-panel__queue-actions">
                              <Button 
                                variant="ghost" 
                                size="small" 
                                onClick={() => handlePostpone(entry.token)}
                                disabled={actionLoading}
                              >
                                Postpone
                              </Button>
                              <Button 
                                variant="danger" 
                                size="small" 
                                onClick={() => handleCancel(entry.token)}
                                disabled={actionLoading}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>

              {/* Availability Management */}
              <Card className="provider-panel__section">
                <CardHeader>
                  <h2 className="provider-panel__section-title">Availability</h2>
                </CardHeader>
                <CardBody>
                  <div className="provider-panel__add-slot">
                    <Input
                      id="new-slot-date"
                      type="date"
                      label="Date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Input
                      id="new-slot-time"
                      type="time"
                      label="Time"
                      value={newSlot.time}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, time: e.target.value }))}
                    />
                    <Button 
                      onClick={handleAddSlot} 
                      disabled={!newSlot.date || !newSlot.time || actionLoading}
                    >
                      Add Slot
                    </Button>
                  </div>

                  <div className="provider-panel__slots">
                    {provider.availabilitySlots?.map(slot => (
                      <button
                        key={slot.id}
                        className={`provider-panel__slot ${slot.available ? 'provider-panel__slot--available' : 'provider-panel__slot--unavailable'}`}
                        onClick={() => handleToggleSlot(slot.id)}
                        disabled={actionLoading}
                      >
                        <span className="provider-panel__slot-date">{slot.date}</span>
                        <span className="provider-panel__slot-time">{slot.time}</span>
                        <span className="provider-panel__slot-status">
                          {slot.available ? 'Available' : 'Booked'}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Provider Stats */}
              <Card className="provider-panel__section provider-panel__section--stats">
                <CardHeader>
                  <h2 className="provider-panel__section-title">Today's Overview</h2>
                </CardHeader>
                <CardBody>
                  <div className="provider-panel__stats">
                    <div className="provider-panel__stat">
                      <span className="provider-panel__stat-value">{provider.queueLength}</span>
                      <span className="provider-panel__stat-label">In Queue</span>
                    </div>
                    <div className="provider-panel__stat">
                      <span className="provider-panel__stat-value">
                        {provider.availabilitySlots?.filter(s => s.available).length || 0}
                      </span>
                      <span className="provider-panel__stat-label">Open Slots</span>
                    </div>
                    <div className="provider-panel__stat">
                      <span className="provider-panel__stat-value">{provider.rating}</span>
                      <span className="provider-panel__stat-label">Rating</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
