import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, DollarSign, Search } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Pools</h1>
          <p className="text-muted-foreground">Join existing pools or create your own</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPools.map((pool) => (
            <Card key={pool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{pool.sport}</Badge>
                  {pool.isPrivate && <Badge variant="outline">Private</Badge>}
                </div>
                <CardTitle className="text-lg">{pool.title}</CardTitle>
                <CardDescription>{pool.league}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm" asChild>
                      <Link to={`/pools/${pool.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button className="flex-1" size="sm" asChild>
                      <Link to={`/pools/${pool.id}`}>
                        Join Pool
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
    </Layout>
  );
};

export default Pools;