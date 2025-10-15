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
  Crown,
  Share2,
  Copy,
  Check
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
    inviteCode: "POOL1ABC",
    participantsList: [
      { id: "owner1", name: "John Smith", betAmount: 100, initials: "JS", isOwner: true, betChoice: "win" },
      { id: "user1", name: "Alice Johnson", betAmount: 75, initials: "AJ", isOwner: false, betChoice: "win" },
      { id: "user2", name: "Bob Wilson", betAmount: 50, initials: "BW", isOwner: false, betChoice: "draw" },
      { id: "user3", name: "Charlie Brown", betAmount: 150, initials: "CB", isOwner: false, betChoice: "win" },
      { id: "user4", name: "Diana Davis", betAmount: 80, initials: "DD", isOwner: false, betChoice: "loss" },
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
    inviteCode: "POOL2XYZ",
    participantsList: [
      { id: "owner2", name: "Mike Jordan", betAmount: 100, initials: "MJ", isOwner: true, betChoice: "win" },
      { id: "user5", name: "Sarah Connor", betAmount: 50, initials: "SC", isOwner: false, betChoice: "loss" },
      { id: "user6", name: "Tony Stark", betAmount: 200, initials: "TS", isOwner: false, betChoice: "win" },
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
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

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
  const isOwner = user?.id === pool.owner.id;

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(pool.inviteCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSharePool = () => {
    const shareUrl = `${window.location.origin}/pools/${pool.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Pool link copied to clipboard",
    });
  };

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
            <div>
              <Button variant="outline" size="sm" onClick={handleSharePool}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Pool
              </Button>
            </div>
          </div>
        </div>

        {/* Invite Code Section - Show to owner */}
        {isOwner && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Pool Invite Code
              </CardTitle>
              <CardDescription>Share this code with others to invite them to your pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input value={pool.inviteCode} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={handleCopyInviteCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <div className="text-center p-4 border border-primary/30 bg-card/50 backdrop-blur rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <Users className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div className="text-lg font-semibold text-primary-glow">{pool.participants}/{pool.maxParticipants}</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  
                  <div className="text-center p-4 border border-primary/30 bg-card/50 backdrop-blur rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <DollarSign className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div className="text-lg font-semibold text-primary-glow">${pool.totalPool}</div>
                    <div className="text-xs text-muted-foreground">Total Pool</div>
                  </div>
                  
                  <div className="text-center p-4 border border-primary/30 bg-card/50 backdrop-blur rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <Trophy className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div className="text-lg font-semibold text-primary-glow">{pool.winSplit}%</div>
                    <div className="text-xs text-muted-foreground">Winner Split</div>
                  </div>
                  
                  <div className="text-center p-4 border border-primary/30 bg-card/50 backdrop-blur rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <Calendar className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div className="text-lg font-semibold text-primary-glow">{pool.matchDate}</div>
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
                  {pool.participantsList.map((participant) => {
                    const contributionPercentage = ((participant.betAmount / pool.totalPool) * 100).toFixed(1);
                    const potentialReward = (participant.betAmount * (pool.winSplit / 100) * pool.totalPool / participant.betAmount).toFixed(2);
                    
                    const getBetVariant = (choice: string) => {
                      if (choice === "win") return "default";
                      if (choice === "draw") return "secondary";
                      return "outline";
                    };

                    return (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>{participant.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium flex items-center gap-2 flex-wrap">
                              <span className="truncate">{participant.name}</span>
                              {participant.isOwner && (
                                <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span>{contributionPercentage}% of pool</span>
                              <span>•</span>
                              <span>Potential: ${potentialReward}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={getBetVariant(participant.betChoice)} className="capitalize">
                            {participant.betChoice}
                          </Badge>
                          <Badge variant="secondary">
                            ${participant.betAmount}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
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
                  {pool.isPrivate && !isParticipant && (
                    <div>
                      <Label htmlFor="invite-code">Invite Code</Label>
                      <Input
                        id="invite-code"
                        type="text"
                        placeholder="Enter invite code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className="font-mono"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        This is a private pool. You need an invite code to join.
                      </div>
                    </div>
                  )}
                  
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
                    disabled={
                      !betAmount || 
                      !betSide || 
                      parseFloat(betAmount) < pool.minDeposit || 
                      isJoining ||
                      (pool.isPrivate && inviteCode !== pool.inviteCode)
                    }
                  >
                    {isJoining ? 'Joining...' : `Join with $${betAmount || '0'}`}
                  </Button>
                  {pool.isPrivate && inviteCode && inviteCode !== pool.inviteCode && (
                    <p className="text-xs text-destructive">Invalid invite code</p>
                  )}
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