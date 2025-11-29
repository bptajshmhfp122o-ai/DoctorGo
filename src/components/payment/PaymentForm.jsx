import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import './PaymentForm.css';

/**
 * Sandbox payment form component
 * @param {Object} props - Component props
 * @param {number} props.amount - Payment amount
 * @param {string} props.bookingId - Booking ID
 * @param {Function} props.onPay - Payment handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} [props.loading=false] - Loading state
 */
export function PaymentForm({ amount, bookingId, onPay, onCancel, loading = false }) {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('Test User');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay();
  };

  return (
    <div className="payment-form">
      <div className="payment-form__header">
        <h2 className="payment-form__title">Payment Details</h2>
        <Badge variant="warning" size="small">Sandbox Mode</Badge>
      </div>

      <div className="payment-form__sandbox-notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          This is a sandbox payment for testing. No real charges will be made.
          Use the pre-filled test card details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form__form">
        <div className="payment-form__summary">
          <div className="payment-form__summary-row">
            <span>Booking ID</span>
            <code>{bookingId}</code>
          </div>
          <div className="payment-form__summary-row payment-form__summary-row--total">
            <span>Total Amount</span>
            <span className="payment-form__amount">${amount.toFixed(2)}</span>
          </div>
        </div>

        <Input
          id="card-name"
          label="Cardholder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="card-number"
          label="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
          required
        />

        <div className="payment-form__row">
          <Input
            id="card-expiry"
            label="Expiry Date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
            required
          />
          <Input
            id="card-cvc"
            label="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            required
          />
        </div>

        <div className="payment-form__actions">
          <Button variant="ghost" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Pay ${amount.toFixed(2)}
          </Button>
        </div>
      </form>
    </div>
  );
}

/**
 * Payment receipt component
 * @param {Object} props - Component props
 * @param {Object} props.payment - Payment data
 * @param {Object} props.booking - Booking data
 * @param {Function} props.onDownload - Download handler
 * @param {Function} props.onClose - Close handler
 */
export function PaymentReceipt({ payment, booking, onDownload, onClose }) {
  const handleDownload = () => {
    // Create a JSON receipt
    const receipt = {
      receiptId: payment.paymentToken,
      bookingId: booking.bookingId,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt,
      cardLast4: payment.cardLast4,
      cardBrand: payment.cardBrand,
      status: payment.status
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.paymentToken}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  return (
    <div className="payment-receipt">
      <div className="payment-receipt__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22,4 12,14.01 9,11.01" />
        </svg>
      </div>

      <h2 className="payment-receipt__title">Payment Successful!</h2>
      <p className="payment-receipt__message">Your payment has been processed successfully.</p>

      <div className="payment-receipt__details">
        <div className="payment-receipt__detail">
          <span className="payment-receipt__label">Payment ID</span>
          <code className="payment-receipt__value">{payment.paymentToken}</code>
        </div>
        <div className="payment-receipt__detail">
          <span className="payment-receipt__label">Amount Paid</span>
          <span className="payment-receipt__value payment-receipt__value--amount">
            ${payment.amount.toFixed(2)} {payment.currency}
          </span>
        </div>
        <div className="payment-receipt__detail">
          <span className="payment-receipt__label">Card</span>
          <span className="payment-receipt__value">
            {payment.cardBrand} •••• {payment.cardLast4}
          </span>
        </div>
        <div className="payment-receipt__detail">
          <span className="payment-receipt__label">Date</span>
          <span className="payment-receipt__value">
            {new Date(payment.paidAt).toLocaleString()}
          </span>
        </div>
        <div className="payment-receipt__detail">
          <span className="payment-receipt__label">Status</span>
          <Badge variant="success">{payment.status}</Badge>
        </div>
      </div>

      <div className="payment-receipt__actions">
        <Button variant="outline" onClick={handleDownload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, marginRight: 8 }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Receipt
        </Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
