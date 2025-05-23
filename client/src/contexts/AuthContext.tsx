import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@shared/schema'; // Assuming User type is imported from shared

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void; // May not be used if login flow is purely redirect-based initially
  logout: () => void;
  // checkAuthState: () => Promise<void>; // Function to fetch user on load
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  // Function to simulate login (can be expanded for other auth methods)
  const login = (userData: User) => {
    setUser(userData);
  };

  // Function to simulate logout
  const clientSideLogout = () => {
    setUser(null);
  };
  
  // Actual logout function that calls the API
  const handleLogout = async () => {
    try {
      // The actual API call will be in Header.tsx or similar UI component
      // This function in context is more for updating local auth state
      // after a successful API logout call.
      clientSideLogout(); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true);
      console.log('[AuthContext] Checking user status...'); // New log
      try {
        const response = await fetch('/api/auth/me');
        console.log('[AuthContext] /api/auth/me response status:', response.status); // New log
        if (response.ok) {
          const userData = await response.json();
          console.log('[AuthContext] /api/auth/me response data (userData):', userData); // New log
          setUser(userData);
        } else {
          console.log('[AuthContext] /api/auth/me response not OK, setting user to null.'); // New log
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Failed to fetch user status:', error); // Modified log
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('[AuthContext] Finished checking user status, isLoading:', false); // New log
      }
    };
    checkUserStatus();
  }, []); // Runs once on mount

  const authState: AuthState = {
    user,
    isLoading,
    isAuthenticated: !!user, // True if user object is not null
    login, // Primarily for manual state updates if needed
    logout: handleLogout, // Expose the function that updates client state
    // checkAuthState: checkUserStatus // Expose if needed for manual re-check
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
