'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

/**
 * Authentication Context
 */
const AuthContext = createContext({});

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages user authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User display name
   * @param {string} role - User role (user, admin, moderator)
   */
  const signup = async (email, password, name, role = 'user') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(result.user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        badge: 'Bronze',
        orders: 0,
        totalSpent: 0,
        isActive: true
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sign in existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const signin = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sign out current user
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   */
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  /**
   * Check if user is admin
   * @returns {boolean} Is user admin
   */
  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  /**
   * Check if user is moderator
   * @returns {boolean} Is user moderator
   */
  const isModerator = () => {
    return userData?.role === 'moderator';
  };

  /**
   * Check if user has admin privileges
   * @returns {boolean} Has admin privileges
   */
  const hasAdminPrivileges = () => {
    return userData?.role === 'admin' || userData?.role === 'moderator';
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    loading,
    signup,
    signin,
    logout,
    isAdmin,
    isModerator,
    hasAdminPrivileges,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};