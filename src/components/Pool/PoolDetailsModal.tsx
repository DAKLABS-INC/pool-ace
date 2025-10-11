import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Calendar, DollarSign, Trophy, Crown, Share2, Copy, Check } from 'lucide-react';
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

  if (!pool) return null;

  const isOwner = user?.id === pool.owner?.id;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle>{pool.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{pool.sport}</Badge>
                  {pool.isPrivate && <Badge variant="outline">Private</Badge>}
                </div>
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleSharePool}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto scrollbar-hide pr-2 flex-1">
          {/* Invite Code - Show to owner */}
          {isOwner && pool.inviteCode && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Pool Invite Code
              </h3>
              <div className="flex items-center gap-2">
                <Input value={pool.inviteCode} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyInviteCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this code with others to invite them to your pool
              </p>
            </div>
          )}

          {/* Pool Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-sm font-semibold">{pool.participants}</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-sm font-semibold">${pool.totalPool}</div>
              <div className="text-xs text-muted-foreground">Total Pool</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-sm font-semibold">{pool.winSplit}%</div>
              <div className="text-xs text-muted-foreground">Winner Split</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-sm font-semibold">{pool.matchDate}</div>
              <div className="text-xs text-muted-foreground">Match Date</div>
            </div>
          </div>

          <Separator />

          {/* Your Bet Info */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Bet</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bet Amount:</span>
                <span className="font-medium">${pool.myBet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contribution:</span>
                <span className="font-medium">{((pool.myBet / pool.totalPool) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential Win:</span>
                <span className="font-medium text-primary">
                  ${((pool.totalPool * pool.winSplit / 100) * (pool.myBet / pool.totalPool)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Participants List */}
          {pool.participantsList && pool.participantsList.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants ({pool.participantsList.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                {pool.participantsList.map((participant: any) => {
                  const contributionPercentage = ((participant.betAmount / pool.totalPool) * 100).toFixed(1);
                  const potentialReward = (participant.betAmount * (pool.winSplit / 100) * pool.totalPool / participant.betAmount).toFixed(2);
                  
                  const getBetVariant = (choice: string) => {
                    if (choice === "win") return "default";
                    if (choice === "draw") return "secondary";
                    return "outline";
                  };

                  return (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-muted rounded-lg gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm flex items-center gap-1 flex-wrap">
                            <span className="truncate">{participant.name}</span>
                            {participant.isOwner && (
                              <Crown className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contributionPercentage}% • Potential: ${potentialReward}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Badge variant={getBetVariant(participant.betChoice)} className="capitalize text-xs">
                          {participant.betChoice}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          ${participant.betAmount}
                        </Badge>
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
