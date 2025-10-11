import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, DollarSign, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
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
  const activePools = mockMyPools.filter(pool => pool.status === 'active');
  const completedPools = mockMyPools.filter(pool => pool.status === 'completed');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedClaimPool, setSelectedClaimPool] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedWithdrawPool, setSelectedWithdrawPool] = useState<any>(null);

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

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Pools</TabsTrigger>
            <TabsTrigger value="completed">Completed Pools</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePools.map((pool) => (
                <Card key={pool.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{pool.sport}</Badge>
                      <div className="flex gap-2">
                        <Badge variant={pool.role === 'owner' ? 'default' : 'outline'}>
                          {pool.role}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{pool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                        <Button 
                          className="flex-1" 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(pool)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="flex-1" 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleWithdraw(pool)}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedPools.map((pool) => (
                <Card key={pool.id} className={pool.result === 'won' ? 'border-primary' : 'border-destructive'}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{pool.sport}</Badge>
                      <div className="flex gap-2">
                        <Badge variant={pool.result === 'won' ? 'default' : 'destructive'}>
                          <Trophy className="h-3 w-3 mr-1" />
                          {pool.result === 'won' ? 'Won' : 'Lost'}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{pool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                        <Button 
                          className="flex-1" 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewResults(pool)}
                        >
                          View Results
                        </Button>
                        {pool.result === 'won' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleClaimWinnings(pool)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

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