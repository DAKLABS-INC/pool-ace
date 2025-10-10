import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, LogIn, UserPlus, Wallet, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { user, refreshWallet } = useAuth();
  const { isSignedIn } = useUser();

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
            {isSignedIn && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    ${user.walletBalance.toLocaleString()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshWallet}
                    className="h-7 w-7 p-0"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: "shadow-lg",
                    }
                  }}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;