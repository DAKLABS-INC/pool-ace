import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, DollarSign, Search, TrendingUp, Trophy, Target, Flame, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CreatePoolModal } from "@/components/Pool/CreatePoolModal";
import { LivePoolCard } from "@/components/Pool/LivePoolCard";
import Autoplay from "embla-carousel-autoplay";

const allMockPools = [
  {
    id: 1,
    title: "Premier League: Man City vs Arsenal",
    sport: "Football",
    league: "Premier League",
    minDeposit: 50,
    participants: 12,
    maxParticipants: 20,
    winSplit: 70,
    isPrivate: false,
    matchDate: "2024-01-15",
  },
  {
    id: 2,
    title: "NBA: Lakers vs Warriors",
    sport: "Basketball",
    league: "NBA",
    minDeposit: 25,
    participants: 8,
    maxParticipants: 15,
    winSplit: 65,
    isPrivate: true,
    matchDate: "2024-01-16",
  },
  {
    id: 3,
    title: "Champions League: Real Madrid vs Bayern Munich",
    sport: "Football",
    league: "Champions League",
    minDeposit: 100,
    participants: 18,
    maxParticipants: 25,
    winSplit: 75,
    isPrivate: false,
    matchDate: "2024-01-17",
  },
  {
    id: 4,
    title: "NFL: Patriots vs Cowboys",
    sport: "American Football",
    league: "NFL",
    minDeposit: 75,
    participants: 10,
    maxParticipants: 20,
    winSplit: 68,
    isPrivate: false,
    matchDate: "2024-01-18",
  },
  {
    id: 5,
    title: "NHL: Maple Leafs vs Canadiens",
    sport: "Ice Hockey",
    league: "NHL",
    minDeposit: 40,
    participants: 6,
    maxParticipants: 12,
    winSplit: 65,
    isPrivate: true,
    matchDate: "2024-01-19",
  },
  {
    id: 6,
    title: "La Liga: Barcelona vs Real Madrid",
    sport: "Football",
    league: "La Liga",
    minDeposit: 80,
    participants: 15,
    maxParticipants: 22,
    winSplit: 72,
    isPrivate: false,
    matchDate: "2024-01-20",
  },
  {
    id: 7,
    title: "MLB: Yankees vs Red Sox",
    sport: "Baseball",
    league: "MLB",
    minDeposit: 30,
    participants: 9,
    maxParticipants: 18,
    winSplit: 60,
    isPrivate: false,
    matchDate: "2024-01-21",
  },
  {
    id: 8,
    title: "Serie A: Juventus vs Inter Milan",
    sport: "Football",
    league: "Serie A",
    minDeposit: 60,
    participants: 11,
    maxParticipants: 16,
    winSplit: 70,
    isPrivate: true,
    matchDate: "2024-01-22",
  },
  {
    id: 9,
    title: "Bundesliga: Bayern vs Dortmund",
    sport: "Football",
    league: "Bundesliga",
    minDeposit: 55,
    participants: 14,
    maxParticipants: 20,
    winSplit: 68,
    isPrivate: false,
    matchDate: "2024-01-23",
  },
  {
    id: 10,
    title: "UFC: Title Fight Night",
    sport: "MMA",
    league: "UFC",
    minDeposit: 90,
    participants: 7,
    maxParticipants: 12,
    winSplit: 75,
    isPrivate: true,
    matchDate: "2024-01-24",
  },
  {
    id: 11,
    title: "Tennis: ATP Finals",
    sport: "Tennis",
    league: "ATP",
    minDeposit: 45,
    participants: 5,
    maxParticipants: 10,
    winSplit: 65,
    isPrivate: false,
    matchDate: "2024-01-25",
  },
  {
    id: 12,
    title: "NBA: Celtics vs Heat",
    sport: "Basketball",
    league: "NBA",
    minDeposit: 35,
    participants: 13,
    maxParticipants: 18,
    winSplit: 70,
    isPrivate: false,
    matchDate: "2024-01-26",
  },
];

const Pools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [displayedPools, setDisplayedPools] = useState<typeof allMockPools>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const POOLS_PER_PAGE = 6;

  // Get unique sports for filters
  const availableSports = ["all", ...Array.from(new Set(allMockPools.map(pool => pool.sport)))];

  // Filter pools based on search query and sport
  const filteredPools = allMockPools.filter(pool => {
    const matchesSearch = pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = selectedSport === "all" || pool.sport === selectedSport;
    
    return matchesSearch && matchesSport;
  });

  // Load more pools
  const loadMorePools = useCallback(() => {
    const startIndex = (page - 1) * POOLS_PER_PAGE;
    const endIndex = startIndex + POOLS_PER_PAGE;
    const newPools = filteredPools.slice(startIndex, endIndex);
    
    if (newPools.length > 0) {
      setDisplayedPools(prev => [...prev, ...newPools]);
      setPage(prev => prev + 1);
      setHasMore(endIndex < filteredPools.length);
    } else {
      setHasMore(false);
    }
  }, [page, filteredPools]);

  // Reset when search or sport filter changes
  useEffect(() => {
    setDisplayedPools([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedSport]);

  // Initial load and load more
  useEffect(() => {
    if (displayedPools.length === 0) {
      loadMorePools();
    }
  }, [displayedPools.length, loadMorePools]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePools();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadMorePools]);

  // Calculate metrics
  const totalLocked = allMockPools.reduce((sum, pool) => sum + (pool.minDeposit * pool.participants), 0);
  const totalParticipants = allMockPools.reduce((sum, pool) => sum + pool.participants, 0);
  const avgPoolSize = (totalLocked / allMockPools.length).toFixed(0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Pools</h1>
          <p className="text-muted-foreground">Join existing pools or create your own</p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/30 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Locked</p>
                  <p className="text-3xl font-bold text-primary-glow">${totalLocked.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <DollarSign className="h-6 w-6 text-primary-glow" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Pools</p>
                  <p className="text-3xl font-bold text-primary-glow">{allMockPools.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Target className="h-6 w-6 text-primary-glow" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>+3 new today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-primary-glow">{totalParticipants}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Users className="h-6 w-6 text-primary-glow" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>+8.2% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avg Pool Size</p>
                  <p className="text-3xl font-bold text-primary-glow">${avgPoolSize}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Trophy className="h-6 w-6 text-primary-glow" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>Growing steadily</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Competitions and Live Pools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Featured Competitions Carousel */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Competitions</h2>
            </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                <CarouselItem>
                <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30">Premier League</Badge>
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">EPL Championship</CardTitle>
                    <CardDescription>Season-long competition</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Pools Created</p>
                        <p className="text-2xl font-bold text-primary-glow">24</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                        <p className="text-2xl font-bold text-primary-glow">156</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Total Staked</p>
                        <p className="text-2xl font-bold text-primary-glow">$12.4K</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Avg Stake</p>
                        <p className="text-2xl font-bold text-primary-glow">$80</p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setIsCreatePoolOpen(true)}>Create Pool</Button>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem>
                <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30">NBA</Badge>
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">NBA Playoffs</CardTitle>
                    <CardDescription>Knockout stage betting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Pools Created</p>
                        <p className="text-2xl font-bold text-primary-glow">18</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                        <p className="text-2xl font-bold text-primary-glow">92</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Total Staked</p>
                        <p className="text-2xl font-bold text-primary-glow">$8.2K</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Avg Stake</p>
                        <p className="text-2xl font-bold text-primary-glow">$89</p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setIsCreatePoolOpen(true)}>Create Pool</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
          </div>

          {/* Live Pools Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">Trending Pools</h2>
            </div>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="h-[420px]">
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 1,
                    title: "Lakers vs Warriors - Final Quarter",
                    sport: "NBA",
                    currentScore: "98-95",
                    participants: 45,
                    totalStaked: 3250,
                    timeRemaining: "8:23",
                    liveOdds: "Lakers -3.5"
                  }} />
                </CarouselItem>
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 2,
                    title: "Man City vs Arsenal - 2nd Half",
                    sport: "Premier League",
                    currentScore: "2-1",
                    participants: 67,
                    totalStaked: 5100,
                    timeRemaining: "38:45",
                    liveOdds: "Draw 2.8"
                  }} />
                </CarouselItem>
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 3,
                    title: "Patriots vs Chiefs - Q3",
                    sport: "NFL",
                    currentScore: "21-17",
                    participants: 52,
                    totalStaked: 4200,
                    timeRemaining: "11:30",
                    liveOdds: "Over 48.5"
                  }} />
                </CarouselItem>
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 4,
                    title: "Real Madrid vs Barcelona - El Clasico",
                    sport: "La Liga",
                    currentScore: "1-1",
                    participants: 89,
                    totalStaked: 7800,
                    timeRemaining: "52:15",
                    liveOdds: "BTTS 1.65"
                  }} />
                </CarouselItem>
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 5,
                    title: "Celtics vs Heat - NBA Finals",
                    sport: "NBA",
                    currentScore: "87-82",
                    participants: 73,
                    totalStaked: 6200,
                    timeRemaining: "14:56",
                    liveOdds: "Celtics -5.5"
                  }} />
                </CarouselItem>
                <CarouselItem>
                  <LivePoolCard pool={{
                    id: 6,
                    title: "Djokovic vs Nadal - Grand Slam",
                    sport: "Tennis",
                    currentScore: "6-4, 3-5",
                    participants: 34,
                    totalStaked: 2900,
                    timeRemaining: "Live Set 2",
                    liveOdds: "Nadal 2.10"
                  }} />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, sport, or league..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sport Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {availableSports.map((sport) => (
            <Badge
              key={sport}
              variant={selectedSport === sport ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors capitalize"
              onClick={() => setSelectedSport(sport)}
            >
              {sport}
            </Badge>
          ))}
        </div>

        <div className="max-h-[800px] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {displayedPools.map((pool) => (
              <Link key={pool.id} to={`/pools/${pool.id}`} className="block h-full">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{pool.sport}</Badge>
                      {pool.isPrivate && <Badge variant="outline">Private</Badge>}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{pool.title}</CardTitle>
                    <CardDescription>{pool.league}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end">
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pool.participants}/{pool.maxParticipants}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pool.matchDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Min: ${pool.minDeposit}</span>
                        </div>
                        <span className="text-primary font-medium">{pool.winSplit}% winner</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Loading indicator for infinite scroll */}
          {hasMore && (
            <div ref={observerTarget} className="text-center py-8">
              <div className="text-muted-foreground">Loading more pools...</div>
            </div>
          )}

          {!hasMore && displayedPools.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No more pools to load
            </div>
          )}

          {displayedPools.length === 0 && !hasMore && (
            <div className="text-center py-12 text-muted-foreground">
              No pools found matching your search
            </div>
          )}
        </div>
      </div>

      <CreatePoolModal isOpen={isCreatePoolOpen} onClose={() => setIsCreatePoolOpen(false)} />
    </Layout>
  );
};

export default Pools;