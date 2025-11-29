import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

/**
 * Sign In page
 */
export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, error } = useAuth();
  
  const [email, setEmail] = useState('demo@doctorgo.com');
  const [password, setPassword] = useState('demo123');
  const [localError, setLocalError] = useState('');

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-page__container">
          <div className="auth-page__header">
            <h1 className="auth-page__title">Welcome Back</h1>
            <p className="auth-page__subtitle">Sign in to your DoctorGo account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-page__form">
            {(localError || error) && (
              <div className="auth-page__error" role="alert">
                {localError || error}
              </div>
            )}

            <div className="auth-page__demo-notice">
              <strong>Demo Credentials:</strong>
              <p>Email: demo@doctorgo.com</p>
              <p>Password: demo123</p>
            </div>

            <Input
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="auth-page__footer">
            Don't have an account?{' '}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Sign Up page
 */
export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      navigate('/', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-page__container">
          <div className="auth-page__header">
            <h1 className="auth-page__title">Create Account</h1>
            <p className="auth-page__subtitle">Join DoctorGo to book appointments easily</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-page__form">
            {(localError || error) && (
              <div className="auth-page__error" role="alert">
                {localError || error}
              </div>
            )}

            <div className="auth-page__row">
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                autoComplete="given-name"
              />
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              hint="At least 6 characters"
              required
              autoComplete="new-password"
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="auth-page__footer">
            Already have an account?{' '}
            <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Profile page
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    insuranceProvider: user?.insuranceProvider || '',
    insuranceId: user?.insuranceId || ''
  });
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/signin', { state: { from: '/profile' } });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
    } catch (err) {
      setLocalError(err.message || 'Failed to update profile');
    }
  };

  return (
    <Layout>
      <div className="auth-page auth-page--profile">
        <div className="auth-page__container auth-page__container--wide">
          <div className="auth-page__header">
            <h1 className="auth-page__title">My Profile</h1>
            <p className="auth-page__subtitle">Manage your account information</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-page__form">
            {(localError || error) && (
              <div className="auth-page__error" role="alert">
                {localError || error}
              </div>
            )}

            {success && (
              <div className="auth-page__success" role="status">
                Profile updated successfully!
              </div>
            )}

            <div className="auth-page__section">
              <h2 className="auth-page__section-title">Personal Information</h2>
              <div className="auth-page__row">
                <Input
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                id="email"
                type="email"
                label="Email Address"
                value={user?.email || ''}
                disabled
                hint="Email cannot be changed"
              />

              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />

              <Input
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, City, State ZIP"
              />
            </div>

            <div className="auth-page__section">
              <h2 className="auth-page__section-title">Insurance Information</h2>
              <div className="auth-page__row">
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  placeholder="Blue Cross"
                />
                <Input
                  id="insuranceId"
                  name="insuranceId"
                  label="Member ID"
                  value={formData.insuranceId}
                  onChange={handleChange}
                  placeholder="ABC123456789"
                />
              </div>
            </div>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
