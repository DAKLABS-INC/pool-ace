import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Activity, Target, Zap, Award, TrendingDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrendingPoolCardProps {
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

export const TrendingPoolCard = ({ pool }: TrendingPoolCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 15000);

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
        {/* Front - Live Statistics */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 backface-hidden overflow-hidden
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/60 before:via-primary/30 before:to-transparent before:-z-10
          ${isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.7)]">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                TRENDING NOW
              </Badge>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold">+24%</span>
              </div>
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Active Bets Growth */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/30 shadow-[0_0_25px_rgba(34,197,94,0.4)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Active Bets</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-3xl font-bold text-primary-glow">
                {pool.participants}
              </p>
              <p className="text-xs text-primary mt-1">+{Math.floor(pool.participants * 0.12)}/hour growth</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/50 rounded-lg p-2.5 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="h-3 w-3 text-primary" />
                  <p className="text-[10px] text-muted-foreground">Momentum</p>
                </div>
                <p className="text-lg font-bold text-primary-glow">+32%</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2.5 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-accent-purple" />
                  <p className="text-[10px] text-muted-foreground">24h Vol</p>
                </div>
                <p className="text-lg font-bold text-accent-purple">${(pool.totalStaked * 4.2).toFixed(0)}K</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2.5 border border-accent-pink/20">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-accent-pink" />
                  <p className="text-[10px] text-muted-foreground">Win Rate</p>
                </div>
                <p className="text-lg font-bold text-accent-pink">72%</p>
              </div>
            </div>

            {/* Avg Predicted Win & Pool Value */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Avg Win</p>
                </div>
                <p className="text-xl font-bold text-primary-glow">$2,840</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-accent-purple" />
                  <p className="text-xs text-muted-foreground">Pool Value</p>
                </div>
                <p className="text-xl font-bold text-accent-purple">${pool.totalStaked.toLocaleString()}</p>
              </div>
            </div>

            {/* Current Odds */}
            <div className="bg-background/70 rounded-lg p-3 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Live Odds</p>
                  <p className="text-2xl font-bold text-primary-glow">{pool.liveOdds}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Min Entry</p>
                  <p className="text-xl font-bold text-foreground">$50</p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <Button className="w-full shadow-[0_0_30px_rgba(34,197,94,0.5),0_0_60px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7),0_0_80px_rgba(34,197,94,0.4)] transition-all" size="lg">
              Join Pool Now
            </Button>
          </CardContent>
        </Card>

        {/* Back - Prediction Graph */}
        <Card className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-accent-purple/10 rotate-y-180 backface-hidden overflow-hidden
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/60 before:via-accent-purple/40 before:to-transparent before:-z-10
          ${!isFlipped ? 'invisible' : 'visible'}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.7)]">
                <TrendingUp className="h-3 w-3 mr-1" />
                PREDICTION TREND
              </Badge>
              <Activity className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-lg leading-tight">{pool.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Prediction Chart */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/30 shadow-[0_0_25px_rgba(34,197,94,0.4)]">
              <p className="text-xs text-muted-foreground mb-3">30-Minute Trend</p>
              <ChartContainer config={chartConfig} className="h-[160px] w-full">
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
                      filter="drop-shadow(0 0 10px hsl(var(--primary)))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/50 rounded-lg p-2.5 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-primary" />
                  <p className="text-[10px] text-muted-foreground">Growth</p>
                </div>
                <p className="text-lg font-bold text-primary-glow">+18/min</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2.5 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="h-3 w-3 text-accent-purple" />
                  <p className="text-[10px] text-muted-foreground">Top Prize</p>
                </div>
                <p className="text-lg font-bold text-accent-purple">$15K</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2.5 border border-accent-pink/20">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="h-3 w-3 text-accent-pink" />
                  <p className="text-[10px] text-muted-foreground">Risk</p>
                </div>
                <p className="text-lg font-bold text-accent-pink">Low</p>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <p className="text-xs text-muted-foreground">Total Locked</p>
                </div>
                <p className="text-xl font-bold text-primary-glow">${pool.totalStaked.toLocaleString()}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-accent-purple/20">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="h-3 w-3 text-accent-purple" />
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
                <p className="text-xl font-bold text-accent-purple">89%</p>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.9)]"></div>
                <span className="text-muted-foreground font-medium">Live Updates</span>
              </span>
              <span className="flex items-center gap-1 text-primary font-semibold">
                <Zap className="h-3 w-3" />
                Hot
              </span>
            </div>

            {/* Join Button */}
            <Button className="w-full shadow-[0_0_30px_rgba(34,197,94,0.5),0_0_60px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7),0_0_80px_rgba(34,197,94,0.4)] transition-all" size="lg">
              Join Pool Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
