import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Trophy, User, LogIn, UserPlus, Wallet, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/Auth/AuthModal';
import { AccountModal } from '@/components/Auth/AccountModal';

const Header = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleLoginSuccess = () => {
    setShowAccountModal(true);
  };

  useEffect(() => {
    if (showAccountModal) {
      const timer = setTimeout(() => {
        setAccountModalOpen(true);
        setShowAccountModal(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showAccountModal]);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-libertinus">PoolAce</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/pools" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Pools
            </Link>
            {user && (
              <>
                <Link to="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Pool
                </Link>
                <Link to="/my-pools" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Pools
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  ${user.walletBalance.toLocaleString()}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setAccountModalOpen(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Account Info
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <AccountModal 
        isOpen={accountModalOpen} 
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
};

export default Header;