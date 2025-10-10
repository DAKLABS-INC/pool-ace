import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useClerk } from '@clerk/clerk-react';

interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  walletBalance: number;
  dakTokens: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateWallet: (amount: number) => void;
  refreshWallet: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded && clerkUser) {
      // Get or create wallet data for user
      const walletKey = `wallet_${clerkUser.id}`;
      let walletData = localStorage.getItem(walletKey);
      
      if (!walletData) {
        // Create new wallet for user
        const newWallet = {
          walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          walletBalance: Math.floor(Math.random() * 10000) + 1000,
          dakTokens: Math.floor(Math.random() * 500) + 100
        };
        localStorage.setItem(walletKey, JSON.stringify(newWallet));
        walletData = JSON.stringify(newWallet);
      }
      
      const parsedWallet = JSON.parse(walletData);
      const { walletAddress, walletBalance, dakTokens = 0 } = parsedWallet;
      
      setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        walletAddress,
        walletBalance,
        dakTokens
      });
    } else if (isLoaded && !clerkUser) {
      setUser(null);
    }
  }, [clerkUser, isLoaded]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Clerk handles authentication, just open the sign-in modal
    openSignIn();
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Clerk handles authentication, just open the sign-up modal
    openSignUp();
    return true;
  };

  const logout = () => {
    signOut();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateWallet = (amount: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
    setUser(updatedUser);
    
    // Update wallet in localStorage
    const walletKey = `wallet_${user.id}`;
    localStorage.setItem(walletKey, JSON.stringify({
      walletAddress: updatedUser.walletAddress,
      walletBalance: updatedUser.walletBalance,
      dakTokens: updatedUser.dakTokens
    }));
  };

  const refreshWallet = () => {
    if (!user) return;
    
    // Simulate refreshing wallet balance - in real app this would fetch from API
    const randomChange = Math.floor(Math.random() * 200) - 100;
    const newBalance = Math.max(0, user.walletBalance + randomChange);
    
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    
    // Update wallet in localStorage
    const walletKey = `wallet_${user.id}`;
    localStorage.setItem(walletKey, JSON.stringify({
      walletAddress: updatedUser.walletAddress,
      walletBalance: newBalance,
      dakTokens: updatedUser.dakTokens
    }));
    
    toast({
      title: "Wallet refreshed",
      description: "Wallet balance updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateWallet,
      refreshWallet,
      isLoading: !isLoaded
    }}>
      {children}
    </AuthContext.Provider>
  );
};