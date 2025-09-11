import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign } from "lucide-react";

const mockPools = [
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
];

const Pools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Pools</h1>
          <p className="text-muted-foreground">Join existing pools or create your own</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPools.map((pool) => (
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

                  <Button className="w-full" size="sm">
                    Join Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pools;