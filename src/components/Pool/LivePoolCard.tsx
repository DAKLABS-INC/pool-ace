import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface LivePoolCardProps {
  pool: {
    id: number;
    title: string;
    sport: string;
    currentScore: string;
    participants: number;
    totalStaked: number;
    timeRemaining: string;
    liveOdds: string;
  };
}

export const LivePoolCard = ({ pool }: LivePoolCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="perspective-1000 h-full">
      <div 
        className={`relative h-full transition-all duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 backface-hidden
          shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]
          ${isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                TRENDING
              </Badge>
              <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-background/70 rounded-lg p-4 border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Current Score</p>
              <p className="text-3xl font-bold text-primary-glow animate-pulse">{pool.currentScore}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Participants</p>
                </div>
                <p className="text-lg font-bold text-foreground">{pool.participants}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Total Pot</p>
                </div>
                <p className="text-lg font-bold text-foreground">${pool.totalStaked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-accent-purple/10 rotate-y-180 backface-hidden
          shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]
          ${!isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                TRENDING STATS
              </Badge>
              <Clock className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-background/70 rounded-lg p-4 border border-accent-purple/30">
              <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
              <p className="text-2xl font-bold text-accent-purple animate-pulse">{pool.timeRemaining}</p>
            </div>
            <div className="bg-background/70 rounded-lg p-4 border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Live Odds</p>
              <p className="text-2xl font-bold text-primary-glow">{pool.liveOdds}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Updates every 30s</span>
              <TrendingUp className="h-3 w-3 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
