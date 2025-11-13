import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Target,
  Zap,
  Award,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
      setIsFlipped((prev) => !prev);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

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
    <div className="perspective-1000 h-full min-h-[550px] md:min-h-[330px]">
      <div
        className={`relative h-full transition-all duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front - Live Statistics */}
        <Card
          onClick={handleFlip}
          className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 backface-hidden overflow-hidden cursor-pointer
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/60 before:via-primary/30 before:to-transparent before:-z-10
          ${isFlipped ? "invisible" : "visible"}`}
        >
          <CardHeader className="pb-3 pt-4 px-4 md:pb-2">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.7)] text-[10px] px-2 py-0.5">
                <Activity className="h-2.5 w-2.5 mr-1 animate-pulse" />
                TRENDING
              </Badge>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">+24%</span>
              </div>
            </div>
            <CardTitle className="text-base leading-tight">
              {pool.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 px-4 pb-4 md:space-y-0 md:grid md:grid-cols-[1fr_2fr_1fr] md:gap-4 md:items-center">
            {/* Left Column: Active Bets & Pool Value */}
            <div className="space-y-2">
              <div className="bg-background/70 rounded-lg p-2.5 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Activity className="h-3 w-3 text-primary" />
                  <p className="text-[10px] text-muted-foreground">
                    Active Bets
                  </p>
                </div>
                <p className="text-xl font-bold text-primary-glow">
                  {pool.participants}
                </p>
                <p className="text-[9px] text-primary mt-0.5">
                  +{Math.floor(pool.participants * 0.12)}/hour
                </p>
              </div>
              <div className="bg-background/70 rounded-lg p-2.5 border border-accent-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <DollarSign className="h-3 w-3 text-accent-purple" />
                  <p className="text-[10px] text-muted-foreground">
                    Pool Value
                  </p>
                </div>
                <p className="text-xl font-bold text-accent-purple">
                  ${pool.totalStaked.toLocaleString()}
                </p>
                <p className="text-[9px] text-accent-purple mt-0.5">
                  Growing fast
                </p>
              </div>
            </div>

            {/* Center Column: Stats Grid + Odds */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1.5">
                <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                  <Target className="h-3 w-3 text-primary mb-1" />
                  <p className="text-[9px] text-muted-foreground mb-0.5">
                    Momentum
                  </p>
                  <p className="text-sm font-bold text-primary-glow">+32%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2 border border-accent-purple/20">
                  <Zap className="h-3 w-3 text-accent-purple mb-1" />
                  <p className="text-[9px] text-muted-foreground mb-0.5">
                    24h Vol
                  </p>
                  <p className="text-sm font-bold text-accent-purple">
                    ${(pool.totalStaked * 4.2).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-2 border border-accent-pink/20">
                  <TrendingUp className="h-3 w-3 text-accent-pink mb-1" />
                  <p className="text-[9px] text-muted-foreground mb-0.5">
                    Win Rate
                  </p>
                  <p className="text-sm font-bold text-accent-pink">72%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                  <Award className="h-3 w-3 text-primary mb-1" />
                  <p className="text-[9px] text-muted-foreground mb-0.5">
                    Avg Win
                  </p>
                  <p className="text-sm font-bold text-primary-glow">$2.8K</p>
                </div>
              </div>

              <div className="bg-background/70 rounded-lg p-2.5 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      Live Odds
                    </p>
                    <p className="text-lg font-bold text-primary-glow">
                      {pool.liveOdds}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground mb-1">
                      Min Entry
                    </p>
                    <p className="text-lg font-bold text-foreground">$50</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Join Button */}
            <div className="space-y-2">
              <Button
                onClick={(e) => e.stopPropagation()}
                className="w-full shadow-[0_0_30px_rgba(34,197,94,0.5),0_0_60px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7),0_0_80px_rgba(34,197,94,0.4)] transition-all md:h-full md:min-h-[120px] md:text-base"
                size="sm"
              >
                Join Pool Now
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                Click card to see prediction trend
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back - Prediction Graph */}
        <Card
          onClick={handleFlip}
          className={`absolute inset-0 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-accent-purple/10 rotate-y-180 backface-hidden overflow-hidden cursor-pointer
          shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)] 
          hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.4)]
          animate-[glow_3s_ease-in-out_infinite]
          before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-primary/60 before:via-accent-purple/40 before:to-transparent before:-z-10
          ${!isFlipped ? "invisible" : "visible"}`}
        >
          <CardHeader className="pb-3 pt-4 px-4 md:pb-2">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.7)] text-[10px] px-2 py-0.5">
                <TrendingUp className="h-2.5 w-2.5 mr-1" />
                PREDICTION
              </Badge>
              <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-base leading-tight">
              {pool.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{pool.sport}</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 px-4 pb-4 md:space-y-0 md:grid md:grid-cols-[2fr_1fr_1fr] md:gap-4 md:items-center">
            {/* Left Column: Prediction Chart */}
            <div className="bg-background/70 rounded-lg p-2.5 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <p className="text-[10px] text-muted-foreground mb-2">
                30-Minute Trend
              </p>
              <ChartContainer
                config={chartConfig}
                className="h-[120px] w-full md:h-[160px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={false}
                      filter="drop-shadow(0 0 8px hsl(var(--primary)))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Center Column: Additional Stats */}
            <div className="grid grid-cols-4 gap-1.5 md:grid-cols-2">
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <Users className="h-3 w-3 text-primary mb-1" />
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  Growth
                </p>
                <p className="text-sm font-bold text-primary-glow">+18/m</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-purple/20">
                <Award className="h-3 w-3 text-accent-purple mb-1" />
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  Top Prize
                </p>
                <p className="text-sm font-bold text-accent-purple">$15K</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-accent-pink/20">
                <TrendingDown className="h-3 w-3 text-accent-pink mb-1" />
                <p className="text-[9px] text-muted-foreground mb-0.5">Risk</p>
                <p className="text-sm font-bold text-accent-pink">Low</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                <Target className="h-3 w-3 text-primary mb-1" />
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  Confidence
                </p>
                <p className="text-sm font-bold text-primary-glow">89%</p>
              </div>
            </div>

            {/* Right Column: Live Indicator & Join Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1 md:flex-col md:items-start md:gap-2">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.9)]"></div>
                  <span className="text-muted-foreground font-medium text-[10px]">
                    Live Updates
                  </span>
                </span>
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Zap className="h-3 w-3" />
                  <span className="text-[10px]">Hot</span>
                </span>
              </div>

              <Button
                onClick={(e) => e.stopPropagation()}
                className="w-full shadow-[0_0_30px_rgba(34,197,94,0.5),0_0_60px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7),0_0_80px_rgba(34,197,94,0.4)] transition-all md:h-full md:min-h-[100px] md:text-base"
                size="sm"
              >
                Join Pool Now
              </Button>

              <p className="text-center text-[10px] text-muted-foreground">
                Click card to go back
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
