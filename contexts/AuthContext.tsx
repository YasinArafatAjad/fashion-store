'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  badge: string;
  orders: number;
  totalSpent: number;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string, role?: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  hasAdminPrivileges: () => boolean;
  getUserData: (uid: string) => Promise<UserData | null>;
}

/**
 * Authentication Context
 */
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User display name
   * @param {string} role - User role (user, admin, moderator)
   */
  const signup = async (email: string, password: string, name: string, role: string = 'user') => {
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
  const signin = async (email: string, password: string) => {
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
  const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
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
  const isAdmin = (): boolean => {
    return userData?.role === 'admin';
  };

  /**
   * Check if user is moderator
   * @returns {boolean} Is user moderator
   */
  const isModerator = (): boolean => {
    return userData?.role === 'moderator';
  };

  /**
   * Check if user has admin privileges
   * @returns {boolean} Has admin privileges
   */
  const hasAdminPrivileges = (): boolean => {
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

  const value: AuthContextType = {
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