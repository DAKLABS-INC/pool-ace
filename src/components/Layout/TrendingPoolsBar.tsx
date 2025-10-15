import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const trendingPools = [
  { id: "1", title: "Lakers vs Warriors - Winner Takes All", participants: 45 },
  { id: "2", title: "Premier League Final Day Showdown", participants: 67 },
  { id: "3", title: "Champions League Finals Pool", participants: 89 },
  { id: "4", title: "NFL Super Bowl Prediction Pool", participants: 123 },
  { id: "5", title: "Wimbledon Men's Finals", participants: 34 },
  { id: "6", title: "UFC Championship Fight Night", participants: 56 },
  { id: "7", title: "NBA Playoffs Conference Finals", participants: 78 },
  { id: "8", title: "World Cup Quarter Finals", participants: 156 },
];

const TrendingPoolsBar = () => {
  const navigate = useNavigate();

  // Duplicate the pools array for seamless loop
  const duplicatedPools = [...trendingPools, ...trendingPools];

  return (
    <div className="bg-gradient-to-r from-background via-primary/10 to-background border-b border-primary/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-primary/5 animate-pulse" />
      
      <div className="relative flex items-center gap-8 py-3 animate-marquee hover:pause">
        {duplicatedPools.map((pool, index) => (
          <div
            key={`${pool.id}-${index}`}
            onClick={() => navigate(`/pools/${pool.id}`)}
            className="flex items-center gap-3 px-6 py-2 bg-background/50 backdrop-blur-sm rounded-lg border border-primary/40 cursor-pointer hover:border-primary hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 whitespace-nowrap group"
          >
            <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {pool.title}
              </span>
              <span className="text-xs text-primary/80">
                {pool.participants} participants
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPoolsBar;
