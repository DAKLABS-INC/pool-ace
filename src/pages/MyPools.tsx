import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, DollarSign, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PoolResultsModal } from "@/components/Pool/PoolResultsModal";

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
  },
];

const MyPools = () => {
  const activePools = mockMyPools.filter(pool => pool.status === 'active');
  const completedPools = mockMyPools.filter(pool => pool.status === 'completed');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  const handleViewResults = (pool: any) => {
    setSelectedPool(pool);
    setResultsModalOpen(true);
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

                      <Button className="w-full" size="sm" variant="outline" asChild>
                        <Link to={`/pool/${pool.id}`}>
                          View Details
                        </Link>
                      </Button>
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

                      <Button 
                        className="w-full" 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewResults(pool)}
                      >
                        View Results
                      </Button>
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
      </div>
    </Layout>
  );
};

export default MyPools;