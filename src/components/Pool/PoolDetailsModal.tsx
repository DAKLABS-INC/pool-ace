import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, DollarSign, Trophy, Crown, Share2, Copy, Check, TrendingUp, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PoolDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: any;
}

export const PoolDetailsModal: React.FC<PoolDetailsModalProps> = ({ isOpen, onClose, pool }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showIncreaseStake, setShowIncreaseStake] = useState(false);
  const [additionalStake, setAdditionalStake] = useState('');

  if (!pool) return null;

  const isOwner = user?.id === pool.owner?.id;
  const contributionPct = ((pool.myBet / pool.totalPool) * 100).toFixed(1);
  const potentialWin = ((pool.totalPool * pool.winSplit / 100) * (pool.myBet / pool.totalPool)).toFixed(2);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(pool.inviteCode);
    setCopied(true);
    toast({ title: "Copied!", description: "Invite code copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSharePool = () => {
    const shareUrl = `${window.location.origin}/pools/${pool.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", description: "Pool link copied to clipboard" });
  };

  const handleIncreaseStake = () => {
    const amount = parseFloat(additionalStake);
    if (!amount || amount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    toast({ title: "Stake increased!", description: `Added $${amount.toFixed(2)} to your stake` });
    setAdditionalStake('');
    setShowIncreaseStake(false);
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {pool.sport}
                </span>
                {pool.isPrivate && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Private</Badge>
                )}
              </div>
              <DialogHeader className="p-0">
                <DialogTitle className="text-lg font-semibold leading-tight">{pool.title}</DialogTitle>
              </DialogHeader>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleSharePool}>
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Stats Row */}
          <div className="px-6 py-4 grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Participants</div>
              <div className="text-sm font-semibold flex items-center justify-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                {pool.participants}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Total Pool</div>
              <div className="text-sm font-semibold flex items-center justify-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                {pool.totalPool}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Win Split</div>
              <div className="text-sm font-semibold flex items-center justify-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                {pool.winSplit}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Match Date</div>
              <div className="text-sm font-semibold flex items-center justify-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {pool.matchDate}
              </div>
            </div>
          </div>

          {/* Your Position */}
          <div className="px-6 pb-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Position</h3>
                <Badge variant="secondary" className="text-[11px]">
                  {contributionPct}% of pool
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Stake</div>
                  <div className="text-base font-semibold">${pool.myBet}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Potential Win</div>
                  <div className="text-base font-semibold text-primary">${potentialWin}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Multiplier</div>
                  <div className="text-base font-semibold">{(parseFloat(potentialWin) / pool.myBet).toFixed(2)}x</div>
                </div>
              </div>
            </div>
          </div>

          {/* Increase Stake */}
          <div className="px-6 pb-4">
            {!showIncreaseStake ? (
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setShowIncreaseStake(true)}
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Increase Stake
              </Button>
            ) : (
              <div className="rounded-lg border border-border/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Add to Stake
                  </Label>
                  <button
                    onClick={() => { setShowIncreaseStake(false); setAdditionalStake(''); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAdditionalStake(String(amt))}
                      className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                        additionalStake === String(amt)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 hover:border-primary/40 text-muted-foreground'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      value={additionalStake}
                      onChange={(e) => setAdditionalStake(e.target.value)}
                      className="pl-7 h-9 text-sm"
                    />
                  </div>
                  <Button size="sm" className="h-9 px-4" onClick={handleIncreaseStake}>
                    Confirm
                  </Button>
                </div>
                {additionalStake && parseFloat(additionalStake) > 0 && (
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>New stake: ${(pool.myBet + parseFloat(additionalStake)).toFixed(2)}</span>
                    <span>New potential: ${((pool.totalPool + parseFloat(additionalStake)) * pool.winSplit / 100 * ((pool.myBet + parseFloat(additionalStake)) / (pool.totalPool + parseFloat(additionalStake)))).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invite Code */}
          {isOwner && pool.inviteCode && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-muted-foreground mb-0.5">Invite Code</div>
                  <div className="font-mono text-sm truncate">{pool.inviteCode}</div>
                </div>
                <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleCopyInviteCode}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          )}

          {/* Participants */}
          {pool.participantsList && pool.participantsList.length > 0 && (
            <div className="px-6 pb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Participants
                </h3>
                <span className="text-xs text-muted-foreground">{pool.participantsList.length} members</span>
              </div>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto scrollbar-hide">
                {pool.participantsList.map((participant: any) => {
                  const pctContrib = ((participant.betAmount / pool.totalPool) * 100).toFixed(1);
                  return (
                    <div key={participant.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-medium">{participant.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium flex items-center gap-1">
                            <span className="truncate">{participant.name}</span>
                            {participant.isOwner && <Crown className="h-3 w-3 text-primary flex-shrink-0" />}
                          </div>
                          <div className="text-[11px] text-muted-foreground">{pctContrib}% contribution</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant={participant.betChoice === 'win' ? 'default' : participant.betChoice === 'draw' ? 'secondary' : 'outline'}
                          className="capitalize text-[10px] px-1.5 py-0 h-5"
                        >
                          {participant.betChoice}
                        </Badge>
                        <span className="text-sm font-medium tabular-nums w-12 text-right">${participant.betAmount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
