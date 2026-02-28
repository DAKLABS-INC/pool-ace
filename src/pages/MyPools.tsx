import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, DollarSign, Trophy, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { PoolResultsModal } from "@/components/Pool/PoolResultsModal";
import { ClaimModal } from "@/components/Pool/ClaimModal";
import { PoolDetailsModal } from "@/components/Pool/PoolDetailsModal";
import { WithdrawFromPoolModal } from "@/components/Pool/WithdrawFromPoolModal";

const mockMyPools = [
  {
    id: 1,
    title: "Premier League: Man City vs Arsenal",
    sport: "Football",
    role: "owner",
    status: "active",
    participants: 12,
    totalPool: 600,
    myBet: 50,
    winSplit: 70,
    matchDate: "2024-01-15",
    isPrivate: false,
    owner: { id: "owner1", name: "John Smith", initials: "JS" },
    inviteCode: "POOL1ABC",
    participantsList: [
      { id: "owner1", name: "John Smith", betAmount: 100, initials: "JS", isOwner: true, betChoice: "win" },
      { id: "user1", name: "Alice Johnson", betAmount: 75, initials: "AJ", isOwner: false, betChoice: "win" },
      { id: "user2", name: "Bob Wilson", betAmount: 50, initials: "BW", isOwner: false, betChoice: "draw" },
    ]
  },
  {
    id: 2,
    title: "NBA: Lakers vs Warriors",
    sport: "Basketball",
    role: "participant",
    status: "completed",
    result: "won",
    participants: 8,
    totalPool: 200,
    myBet: 25,
    winnings: 87.5,
    matchDate: "2024-01-10",
    owner: { id: "owner2", name: "Mike Jordan", initials: "MJ" },
    inviteCode: "POOL2XYZ",
  },
];

const MyPools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed'>('active');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedClaimPool, setSelectedClaimPool] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedWithdrawPool, setSelectedWithdrawPool] = useState<any>(null);

  const filteredPools = useMemo(() => {
    return mockMyPools.filter(pool => {
      const matchesStatus = pool.status === statusFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.sport.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  const handleViewResults = (pool: any) => {
    setSelectedPool(pool);
    setResultsModalOpen(true);
  };

  const handleClaimWinnings = (pool: any) => {
    setSelectedClaimPool(pool);
    setClaimModalOpen(true);
  };

  const handleViewDetails = (pool: any) => {
    setSelectedPool(pool);
    setDetailsModalOpen(true);
  };

  const handleWithdraw = (pool: any) => {
    setSelectedWithdrawPool(pool);
    setWithdrawModalOpen(true);
  };

  const calculatePredictedWin = (pool: any) => {
    const userContribution = (pool.myBet / pool.totalPool) * 100;
    const potentialWin = (pool.totalPool * pool.winSplit / 100) * (pool.myBet / pool.totalPool);
    return { userContribution, potentialWin };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Pools</h1>
          <p className="text-muted-foreground">Manage your active pools and view results</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className="gap-1.5"
            >
              <Clock className="h-3.5 w-3.5" />
              Active
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
              className="gap-1.5"
            >
              <Trophy className="h-3.5 w-3.5" />
              Completed
            </Button>
          </div>
        </div>

        {/* Pool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <Card key={pool.id} className={pool.status === 'completed' && pool.result === 'won' ? 'border-primary' : pool.status === 'completed' ? 'border-destructive' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{pool.sport}</Badge>
                  <div className="flex gap-2">
                    {pool.status === 'active' ? (
                      <>
                        <Badge variant={pool.role === 'owner' ? 'default' : 'outline'}>
                          {pool.role}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </>
                    ) : (
                      <Badge variant={pool.result === 'won' ? 'default' : 'destructive'}>
                        <Trophy className="h-3 w-3 mr-1" />
                        {pool.result === 'won' ? 'Won' : 'Lost'}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{pool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pool.status === 'active' ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pool.participants} participants</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pool.matchDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Total: ${pool.totalPool}</span>
                        </div>
                        <span className="text-primary font-medium">My bet: ${pool.myBet}</span>
                      </div>
                      {(() => {
                        const { userContribution, potentialWin } = calculatePredictedWin(pool);
                        return (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Your contribution: {userContribution.toFixed(1)}% • Potential win: ${potentialWin.toFixed(2)}
                          </div>
                        );
                      })()}
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" variant="outline" onClick={() => handleViewDetails(pool)}>
                          View Details
                        </Button>
                        <Button className="flex-1" size="sm" variant="destructive" onClick={() => handleWithdraw(pool)}>
                          Withdraw
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>My bet: ${pool.myBet}</span>
                        <span className={pool.result === 'won' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                          {pool.result === 'won' ? `Won: $${pool.winnings}` : 'No winnings'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed on {pool.matchDate}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" variant="outline" onClick={() => handleViewResults(pool)}>
                          View Results
                        </Button>
                        {pool.result === 'won' && (
                          <Button size="sm" onClick={() => handleClaimWinnings(pool)} className="bg-primary hover:bg-primary/90">
                            Claim
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No pools found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {selectedPool && (
          <PoolResultsModal
            isOpen={resultsModalOpen}
            onClose={() => {
              setResultsModalOpen(false);
              setSelectedPool(null);
            }}
            pool={selectedPool}
          />
        )}

        {selectedClaimPool && (
          <ClaimModal
            isOpen={claimModalOpen}
            onClose={() => {
              setClaimModalOpen(false);
              setSelectedClaimPool(null);
            }}
            pool={selectedClaimPool}
          />
        )}

        {selectedPool && (
          <PoolDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedPool(null);
            }}
            pool={selectedPool}
          />
        )}

        {selectedWithdrawPool && (
          <WithdrawFromPoolModal
            isOpen={withdrawModalOpen}
            onClose={() => {
              setWithdrawModalOpen(false);
              setSelectedWithdrawPool(null);
            }}
            pool={selectedWithdrawPool}
          />
        )}
      </div>
    </Layout>
  );
};

export default MyPools;