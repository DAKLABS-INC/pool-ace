import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  walletBalance: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('poolace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem('poolace_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        walletAddress: foundUser.walletAddress,
        walletBalance: foundUser.walletBalance
      };
      setUser(userSession);
      localStorage.setItem('poolace_user', JSON.stringify(userSession));
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${foundUser.name}`,
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('poolace_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      toast({
        title: "Signup failed",
        description: "User with this email already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
    
    // Generate mock wallet address and balance
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const walletBalance = Math.floor(Math.random() * 10000) + 1000; // Random balance between 1000-11000
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      name,
      walletAddress,
      walletBalance
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('poolace_users', JSON.stringify(storedUsers));
    
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      walletAddress: newUser.walletAddress,
      walletBalance: newUser.walletBalance
    };
    
    setUser(userSession);
    localStorage.setItem('poolace_user', JSON.stringify(userSession));
    
    toast({
      title: "Account created!",
      description: `Welcome to PoolAce, ${name}!`,
    });
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('poolace_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateWallet = (amount: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
    setUser(updatedUser);
    localStorage.setItem('poolace_user', JSON.stringify(updatedUser));
    
    // Also update in users storage
    const storedUsers = JSON.parse(localStorage.getItem('poolace_users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      storedUsers[userIndex].walletBalance = updatedUser.walletBalance;
      localStorage.setItem('poolace_users', JSON.stringify(storedUsers));
    }
  };

  const refreshWallet = () => {
    if (!user) return;
    
    // Simulate refreshing wallet balance - in real app this would fetch from API
    const randomChange = Math.floor(Math.random() * 200) - 100; // Random change between -100 to +100
    const newBalance = Math.max(0, user.walletBalance + randomChange);
    
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('poolace_user', JSON.stringify(updatedUser));
    
    // Also update in users storage
    const storedUsers = JSON.parse(localStorage.getItem('poolace_users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      storedUsers[userIndex].walletBalance = newBalance;
      localStorage.setItem('poolace_users', JSON.stringify(storedUsers));
    }
    
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
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};