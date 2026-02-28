import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, TrendingUp, TrendingDown, Users, DollarSign, Target, ChevronRight } from 'lucide-react';

interface PoolResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: any;
}

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

  const getUserInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] p-0 gap-0 overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Pool Results</h2>
          </div>
          <p className="text-sm text-muted-foreground">{pool.title}</p>
        </div>

        <div className="overflow-y-auto scrollbar-hide px-6 py-5 space-y-5">
          {/* Final Score Card */}
          <div className="rounded-lg border bg-card p-5 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Final Score</p>
            <p className="text-2xl font-bold tracking-tight mb-3">{results.finalScore}</p>
            <Badge variant="default" className="text-xs">
              Winning: {results.winningOutcome.charAt(0).toUpperCase() + results.winningOutcome.slice(1)}
            </Badge>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-3 text-center">
              <DollarSign className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold">${results.totalPayout}</p>
              <p className="text-[11px] text-muted-foreground">Total Payout</p>
            </div>
            <div className="rounded-lg border bg-card p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold text-green-500">{winnersCount}</p>
              <p className="text-[11px] text-muted-foreground">Winners</p>
            </div>
            <div className="rounded-lg border bg-card p-3 text-center">
              <TrendingDown className="h-4 w-4 mx-auto text-destructive mb-1" />
              <p className="text-lg font-bold text-destructive">{losersCount}</p>
              <p className="text-[11px] text-muted-foreground">Losers</p>
            </div>
          </div>

          {/* Your Performance */}
          {pool.result && (
            <div className={`rounded-lg border p-4 ${pool.result === 'won' ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Your Performance</p>
                <Badge variant={pool.result === 'won' ? 'default' : 'destructive'} className="ml-auto text-[10px]">
                  {pool.result === 'won' ? 'Won' : 'Lost'}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Your Bet</p>
                  <p className="text-base font-semibold">${pool.myBet}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Winnings</p>
                  <p className={`text-base font-semibold ${pool.result === 'won' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {pool.result === 'won' ? `+$${pool.winnings}` : '$0'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">ROI</p>
                  <p className={`text-base font-semibold ${pool.result === 'won' ? 'text-green-500' : 'text-destructive'}`}>
                    {pool.result === 'won' ? `+${(((pool.winnings - pool.myBet) / pool.myBet) * 100).toFixed(0)}%` : '-100%'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Participants ({results.participantResults.length})</p>
            </div>
            <div className="space-y-2">
              {results.participantResults.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                >
                  <Avatar className="h-8 w-8 text-xs">
                    <AvatarFallback className="text-[10px]">{getUserInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{participant.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {participant.side.charAt(0).toUpperCase() + participant.side.slice(1)} · ${participant.bet}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    {participant.status === 'won' ? (
                      <>
                        <span className="text-sm font-semibold text-green-500">+${participant.payout}</span>
                        <Badge variant="default" className="text-[10px] px-1.5">Won</Badge>
                      </>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] px-1.5">Lost</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pool Info Footer */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pool Size</span>
              <span className="font-medium">${pool.totalPool}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sport</span>
              <span className="font-medium">{pool.sport}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participants</span>
              <span className="font-medium">{pool.participants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Match Date</span>
              <span className="font-medium">{pool.matchDate}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
