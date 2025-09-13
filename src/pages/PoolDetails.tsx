import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Trophy, 
  ArrowLeft, 
  UserPlus,
  Crown
} from 'lucide-react';

// Mock pool data - in a real app this would come from an API
const mockPoolDetails = {
  1: {
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
    totalPool: 1200,
    description: "Premier League showdown between Manchester City and Arsenal. Winner takes all based on match result!",
    owner: { id: "owner1", name: "John Smith", initials: "JS" },
    participantsList: [
      { id: "owner1", name: "John Smith", betAmount: 100, initials: "JS", isOwner: true },
      { id: "user1", name: "Alice Johnson", betAmount: 75, initials: "AJ", isOwner: false },
      { id: "user2", name: "Bob Wilson", betAmount: 50, initials: "BW", isOwner: false },
      { id: "user3", name: "Charlie Brown", betAmount: 150, initials: "CB", isOwner: false },
      { id: "user4", name: "Diana Davis", betAmount: 80, initials: "DD", isOwner: false },
    ]
  },
  2: {
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
    totalPool: 600,
    description: "Epic NBA rivalry game between Lakers and Warriors. Private pool for serious basketball fans!",
    owner: { id: "owner2", name: "Mike Jordan", initials: "MJ" },
    participantsList: [
      { id: "owner2", name: "Mike Jordan", betAmount: 100, initials: "MJ", isOwner: true },
      { id: "user5", name: "Sarah Connor", betAmount: 50, initials: "SC", isOwner: false },
      { id: "user6", name: "Tony Stark", betAmount: 200, initials: "TS", isOwner: false },
    ]
  }
};

const PoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateWallet } = useAuth();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState('');
  const [betSide, setBetSide] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const pool = mockPoolDetails[parseInt(id || '0') as keyof typeof mockPoolDetails];
  
  if (!pool) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Pool Not Found</h1>
            <Link to="/pools">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pools
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isParticipant = user && pool.participantsList.some(p => p.id === user.id);
  const canJoin = user && !isParticipant && pool.participants < pool.maxParticipants;
  const userBet = pool.participantsList.find(p => p.id === user?.id);

  const handleJoinPool = async () => {
    if (!user || !betAmount || !betSide) return;
    
    const amount = parseFloat(betAmount);
    if (amount < pool.minDeposit) {
      toast({
        title: "Invalid amount",
        description: `Minimum deposit is $${pool.minDeposit}`,
        variant: "destructive",
      });
      return;
    }
    
    if (amount > user.walletBalance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to join this pool",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update wallet balance
    updateWallet(-amount);
    
    // Update pool data in localStorage (mock database)
    const pools = JSON.parse(localStorage.getItem('poolace_pools') || '[]');
    const poolIndex = pools.findIndex((p: any) => p.id === pool.id);
    
    if (poolIndex !== -1) {
      pools[poolIndex].participants += 1;
      pools[poolIndex].totalPool += amount;
      localStorage.setItem('poolace_pools', JSON.stringify(pools));
    }
    
    toast({
      title: "Successfully joined!",
      description: `You've joined the pool with $${amount} betting on ${betSide}`,
    });
    
    setIsJoining(false);
    setBetAmount('');
    setBetSide('');
    
    // Refresh page to show updated data
    window.location.reload();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/pools')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pools
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pool.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{pool.sport}</Badge>
                <Badge variant="outline">{pool.league}</Badge>
                {pool.isPrivate && <Badge variant="outline">Private</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pool Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pool Details</CardTitle>
                <CardDescription>{pool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{pool.participants}/{pool.maxParticipants}</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">${pool.totalPool}</div>
                    <div className="text-xs text-muted-foreground">Total Pool</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{pool.winSplit}%</div>
                    <div className="text-xs text-muted-foreground">Winner Split</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{pool.matchDate}</div>
                    <div className="text-xs text-muted-foreground">Match Date</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Minimum Deposit:</span>
                  <Badge variant="outline">${pool.minDeposit}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({pool.participantsList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pool.participantsList.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{participant.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {participant.name}
                            {participant.isOwner && (
                              <Crown className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {participant.isOwner ? 'Pool Owner' : 'Participant'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        ${participant.betAmount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Join Pool / My Bet */}
          <div className="space-y-6">
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle>Join This Pool</CardTitle>
                  <CardDescription>Sign in to participate in this pool</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => navigate('/')}>
                    Sign In to Join
                  </Button>
                </CardContent>
              </Card>
            )}

            {user && isParticipant && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">You're In!</CardTitle>
                  <CardDescription>You have successfully joined this pool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary">${userBet?.betAmount}</div>
                    <div className="text-sm text-muted-foreground">Your bet amount</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {canJoin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Join Pool
                  </CardTitle>
                  <CardDescription>Enter your bet amount to join this pool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bet-side">Pick Your Bet</Label>
                    <Select value={betSide} onValueChange={setBetSide}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose win/draw/loss" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="draw">Draw</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bet-amount">Bet Amount (USD)</Label>
                    <Input
                      id="bet-amount"
                      type="number"
                      placeholder={`Min: $${pool.minDeposit}`}
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min={pool.minDeposit}
                      max={user.walletBalance}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Available balance: ${user.walletBalance}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleJoinPool}
                    disabled={!betAmount || !betSide || parseFloat(betAmount) < pool.minDeposit || isJoining}
                  >
                    {isJoining ? 'Joining...' : `Join with $${betAmount || '0'}`}
                  </Button>
                </CardContent>
              </Card>
            )}

            {user && pool.participants >= pool.maxParticipants && !isParticipant && (
              <Card>
                <CardHeader>
                  <CardTitle>Pool Full</CardTitle>
                  <CardDescription>This pool has reached its maximum capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    No more spots available
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PoolDetails;