import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Calendar, DollarSign, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatePoolModal } from "@/components/Pool/CreatePoolModal";
import { PoolFilters, PoolFilterValues } from "@/components/Pool/PoolFilters";

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

  // Filter state
  const [filters, setFilters] = useState<PoolFilterValues>({
    minParticipants: 0,
    maxParticipants: 100,
    minWinPercentage: 0,
    maxWinPercentage: 100,
    dateFilter: "all",
    minDeposit: 0,
    maxDeposit: 1000,
  });

  // Get unique sports for filters
  const availableSports = ["all", ...Array.from(new Set(allMockPools.map(pool => pool.sport)))];

  // Filter pools based on search query, sport, and advanced filters
  const filteredPools = allMockPools.filter(pool => {
    const matchesSearch = pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = selectedSport === "all" || pool.sport === selectedSport;
    
    // Advanced filters
    const matchesParticipants = pool.participants >= filters.minParticipants && 
                                pool.participants <= filters.maxParticipants;
    
    const matchesWinPercentage = pool.winSplit >= filters.minWinPercentage && 
                                 pool.winSplit <= filters.maxWinPercentage;
    
    const matchesDeposit = pool.minDeposit >= filters.minDeposit && 
                           pool.minDeposit <= filters.maxDeposit;
    
    // Date filter logic
    let matchesDate = true;
    if (filters.dateFilter !== "all") {
      const poolDate = new Date(pool.matchDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filters.dateFilter) {
        case "today":
          matchesDate = poolDate.toDateString() === today.toDateString();
          break;
        case "tomorrow":
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = poolDate.toDateString() === tomorrow.toDateString();
          break;
        case "week":
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          matchesDate = poolDate >= today && poolDate <= weekEnd;
          break;
        case "month":
          const monthEnd = new Date(today);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          matchesDate = poolDate >= today && poolDate <= monthEnd;
          break;
      }
    }
    
    return matchesSearch && matchesSport && matchesParticipants && 
           matchesWinPercentage && matchesDeposit && matchesDate;
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
  }, [searchQuery, selectedSport, filters]);

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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Browse Pools</h1>
          <p className="text-sm text-muted-foreground">Find and join prediction pools across all sports</p>
        </div>

        {/* Search Bar and Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, sport, or league..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <PoolFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters({
              minParticipants: 0,
              maxParticipants: 100,
              minWinPercentage: 0,
              maxWinPercentage: 100,
              dateFilter: "all",
              minDeposit: 0,
              maxDeposit: 1000,
            })}
          />
        </div>

        {/* Sport Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {availableSports.map((sport) => (
            <button
              key={sport}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                selectedSport === sport
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport}
            </button>
          ))}
        </div>

        <div className="max-h-[800px] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
            {displayedPools.map((pool) => (
              <Link key={pool.id} to={`/pools/${pool.id}`} className="block h-full">
                <Card className="border-border/60 hover:border-primary/40 transition-all duration-200 cursor-pointer group h-full flex flex-col bg-card/80">
                  <CardHeader className="flex-shrink-0 pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{pool.sport} · {pool.league}</span>
                      {pool.isPrivate && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Private</span>}
                    </div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors leading-snug">{pool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end pt-0">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {pool.participants}/{pool.maxParticipants}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {pool.matchDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" />
                          Min ${pool.minDeposit}
                        </span>
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