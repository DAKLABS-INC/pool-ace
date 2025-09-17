import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Target } from 'lucide-react';

interface PoolResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: any;
}

// Mock detailed results data
const getPoolResults = (poolId: number) => {
  const mockResults = {
    1: {
      finalScore: "Man City 2 - 1 Arsenal",
      winningOutcome: "win",
      totalPayout: 420,
      participantResults: [
        { id: 1, name: "John Smith", bet: 50, side: "win", payout: 87.5, status: "won" },
        { id: 2, name: "Sarah Wilson", bet: 25, side: "win", payout: 43.75, status: "won" },
        { id: 3, name: "Mike Johnson", bet: 30, side: "draw", payout: 0, status: "lost" },
        { id: 4, name: "Emma Davis", bet: 40, side: "loss", payout: 0, status: "lost" },
      ]
    },
    2: {
      finalScore: "Lakers 108 - 112 Warriors",
      winningOutcome: "loss",
      totalPayout: 175,
      participantResults: [
        { id: 1, name: "Current User", bet: 25, side: "win", payout: 87.5, status: "won" },
        { id: 2, name: "Alex Chen", bet: 30, side: "win", payout: 52.5, status: "won" },
        { id: 3, name: "Lisa Park", bet: 20, side: "draw", payout: 0, status: "lost" },
        { id: 4, name: "Tom Brown", bet: 35, side: "loss", payout: 0, status: "lost" },
      ]
    }
  };
  
  return mockResults[poolId as keyof typeof mockResults] || mockResults[2];
};

export const PoolResultsModal: React.FC<PoolResultsModalProps> = ({ isOpen, onClose, pool }) => {
  const results = getPoolResults(pool.id);
  const winnersCount = results.participantResults.filter(p => p.status === "won").length;
  const losersCount = results.participantResults.filter(p => p.status === "lost").length;

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Pool Results: {pool.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Final Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{results.finalScore}</div>
                <Badge variant="default" className="mb-4">
                  Winning Outcome: {results.winningOutcome.charAt(0).toUpperCase() + results.winningOutcome.slice(1)}
                </Badge>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">${results.totalPayout}</div>
                    <div className="text-sm text-muted-foreground">Total Payout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{winnersCount}</div>
                    <div className="text-sm text-muted-foreground">Winners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{losersCount}</div>
                    <div className="text-sm text-muted-foreground">Losers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participant Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Participants ({results.participantResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.participantResults.map((participant, index) => (
                  <div key={participant.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getUserInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Bet on: {participant.side} • ${participant.bet}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className={`flex items-center gap-2 ${
                          participant.status === 'won' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {participant.status === 'won' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <Badge variant={participant.status === 'won' ? 'default' : 'destructive'}>
                            {participant.status === 'won' ? 'Won' : 'Lost'}
                          </Badge>
                        </div>
                        {participant.status === 'won' && (
                          <div className="text-lg font-bold text-green-500">
                            +${participant.payout}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < results.participantResults.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Your Performance (if applicable) */}
          {pool.result && (
            <Card className={pool.result === 'won' ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Your Bet</div>
                    <div className="text-lg font-semibold">${pool.myBet}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {pool.result === 'won' ? 'Your Winnings' : 'Result'}
                    </div>
                    <div className={`text-lg font-semibold ${
                      pool.result === 'won' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {pool.result === 'won' ? `+$${pool.winnings}` : 'No winnings'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Performance: </span>
                    {pool.result === 'won' 
                      ? `You successfully predicted the outcome and earned $${pool.winnings} from your $${pool.myBet} bet.`
                      : `Your prediction was incorrect. Better luck next time!`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pool Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Pool Size:</span>
                  <div className="font-semibold">${pool.totalPool}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Match Date:</span>
                  <div className="font-semibold">{pool.matchDate}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Participants:</span>
                  <div className="font-semibold">{pool.participants}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sport:</span>
                  <div className="font-semibold">{pool.sport}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};