import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogIn,
  UserPlus,
  Wallet,
  LogOut,
  History,
  RefreshCw,
  Moon,
  Sun,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AccountModal } from "@/components/Auth/AccountModal";
import { CreatePoolModal } from "@/components/Pool/CreatePoolModal";
import { useTheme } from "next-themes";
import logo from "@/assets/logo.png";

const Header = () => {
  const { user, logout, refreshWallet } = useAuth();
  const { theme, setTheme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [createPoolModalOpen, setCreatePoolModalOpen] = useState(false);
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
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="DakSports" className="h-12 w-12" />
            <span className="text-2xl font-bold text-foreground font-orbitron">
              DakSports
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/pools"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Pools
            </Link>
            {user && (
              <Link
                to="/my-pools"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My Pools
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />$
                    {user.walletBalance.toLocaleString()}
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    {/* Mobile-only nav links, after Create Pool */}
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setCreatePoolModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Pool
                    </DropdownMenuItem>
                    <div className="block md:hidden">
                      <DropdownMenuItem asChild>
                        <Link to="/pools">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          Browse Pools
                        </Link>
                      </DropdownMenuItem>
                      {user && (
                        <DropdownMenuItem asChild>
                          <Link to="/my-pools">
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            My Pools
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setAccountModalOpen(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Account Info
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/transaction-history">
                        <History className="mr-2 h-4 w-4" />
                        Transaction History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      )}
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
              <div className="flex items-center">
                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => {
                    if (window.Clerk && window.Clerk.openSignIn) {
                      window.Clerk.openSignIn();
                    } else if (window.Clerk && window.Clerk.openSignUp) {
                      window.Clerk.openSignUp();
                    }
                  }}
                  className="font-bold px-6"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      <CreatePoolModal
        isOpen={createPoolModalOpen}
        onClose={() => setCreatePoolModalOpen(false)}
      />
    </>
  );
};

export default Header;
