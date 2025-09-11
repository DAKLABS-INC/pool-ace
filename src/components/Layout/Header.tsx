import { Button } from "@/components/ui/button";
import { Trophy, User, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">PoolAce</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/pools" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse Pools
          </Link>
          <Link to="/create" className="text-muted-foreground hover:text-foreground transition-colors">
            Create Pool
          </Link>
          <Link to="/my-pools" className="text-muted-foreground hover:text-foreground transition-colors">
            My Pools
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;