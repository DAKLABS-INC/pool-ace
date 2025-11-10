import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Clock, Activity, Target, Zap, TrendingDown, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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

  // Mock prediction data
  const predictionData = [
    { time: "0m", value: 45 },
    { time: "5m", value: 52 },
    { time: "10m", value: 48 },
    { time: "15m", value: 61 },
    { time: "20m", value: 58 },
    { time: "25m", value: 67 },
    { time: "30m", value: 73 },
  ];

  const chartConfig = {
    value: {
      label: "Predictions",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="perspective-1000 h-full">
      <div 
        className={`relative h-full transition-all duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front - Trending Statistics */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 backface-hidden overflow-hidden
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3),inset_0_0_30px_rgba(34,197,94,0.1)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4),inset_0_0_40px_rgba(34,197,94,0.15)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/50 before:via-primary/20 before:to-transparent before:-z-10
          ${isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                TRENDING
              </Badge>
              <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-background/70 rounded-lg p-4 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-3 w-3 text-primary" />
                <p className="text-xs text-muted-foreground">Live Activity</p>
              </div>
              <p className="text-2xl font-bold text-primary-glow animate-pulse">
                {pool.participants} Active Bets
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Total Pool</p>
                </div>
                <p className="text-base font-bold text-primary-glow">${pool.totalStaked}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Momentum</p>
                </div>
                <p className="text-base font-bold text-primary-glow">+24%</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-accent-purple" />
                  <p className="text-xs text-muted-foreground">24h Vol</p>
                </div>
                <p className="text-base font-bold text-accent-purple">$89K</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <p className="text-base font-bold text-primary-glow">68%</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-pink/20">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="h-3 w-3 text-accent-pink" />
                  <p className="text-xs text-muted-foreground">Avg Win</p>
                </div>
                <p className="text-base font-bold text-accent-pink">$2,340</p>
              </div>
            </div>
            <div className="bg-background/70 rounded-lg p-3 border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Odds</p>
                  <p className="text-xl font-bold text-primary-glow">{pool.liveOdds}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Min Entry</p>
                  <p className="text-lg font-bold text-foreground">$50</p>
                </div>
              </div>
            </div>
            <Button className="w-full shadow-[0_0_25px_rgba(34,197,94,0.4),0_0_50px_rgba(34,197,94,0.2)] hover:shadow-[0_0_35px_rgba(34,197,94,0.6),0_0_70px_rgba(34,197,94,0.3)]" size="sm">
              Join Pool
            </Button>
          </CardContent>
        </Card>

        {/* Back - Prediction Graph */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-accent-purple/10 rotate-y-180 backface-hidden overflow-hidden
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3),inset_0_0_30px_rgba(34,197,94,0.1)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4),inset_0_0_40px_rgba(34,197,94,0.15)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/50 before:via-accent-purple/30 before:to-transparent before:-z-10
          ${!isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                PREDICTION GRAPH
              </Badge>
              <Activity className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-background/70 rounded-lg p-3 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <p className="text-xs text-muted-foreground mb-2">Prediction Trend (30 min)</p>
              <ChartContainer config={chartConfig} className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={false}
                      filter="drop-shadow(0 0 8px hsl(var(--primary)))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/50 rounded-lg p-2 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-accent-purple" />
                  <p className="text-xs text-muted-foreground">Time Left</p>
                </div>
                <p className="text-base font-bold text-accent-purple animate-pulse">{pool.timeRemaining}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Growth</p>
                </div>
                <p className="text-base font-bold text-primary-glow">+12/min</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-pink/20">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="h-3 w-3 text-accent-pink" />
                  <p className="text-xs text-muted-foreground">Risk</p>
                </div>
                <p className="text-base font-bold text-accent-pink">Low</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Pot Value</p>
                </div>
                <p className="text-base font-bold text-primary-glow">${pool.totalStaked}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="h-3 w-3 text-accent-purple" />
                  <p className="text-xs text-muted-foreground">Top Prize</p>
                </div>
                <p className="text-base font-bold text-accent-purple">$12K</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs px-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.9)]"></div>
                <span className="text-muted-foreground">Live Updates</span>
              </span>
              <span className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-3 w-3" />
                <span className="font-semibold">Hot</span>
              </span>
            </div>
            <Button className="w-full shadow-[0_0_25px_rgba(34,197,94,0.4),0_0_50px_rgba(34,197,94,0.2)] hover:shadow-[0_0_35px_rgba(34,197,94,0.6),0_0_70px_rgba(34,197,94,0.3)]" size="sm">
              Join Pool
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
