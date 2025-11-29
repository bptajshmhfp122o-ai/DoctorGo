import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authenticateUser, registerUser, updateUserProfile } from '../api/mockService';

/**
 * Authentication Context
 * Provides user authentication state and methods throughout the app
 */
const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'doctorgo_auth';

/**
 * AuthProvider component
 * Wraps the application to provide authentication functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved auth state on mount
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const { user: savedUser, token: savedToken } = JSON.parse(saved);
        setUser(savedUser);
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save auth state when it changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user, token]);

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data
   */
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticateUser(email, password);
      if (!result) {
        throw new Error('Invalid email or password');
      }
      setUser(result.user);
      setToken(result.token);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - User data
   */
  const signUp = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(userData);
      setUser(result.user);
      setToken(result.token);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} - Updated user data
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateUserProfile(user.id, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
