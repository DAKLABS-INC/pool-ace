import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { User, Copy, Check, ArrowUpRight, RefreshCw, Coins } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WithdrawModal } from './WithdrawModal';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshWallet } = useAuth();
  const [copied, setCopied] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [useDakDiscount, setUseDakDiscount] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy wallet address",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">Account</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-hide flex-1 px-6 py-5 space-y-5">
          {/* Wallet Balance & DAK Tokens — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Balance</span>
                <Button variant="ghost" size="sm" onClick={refreshWallet} className="h-6 w-6 p-0">
                  <RefreshCw className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
              <p className="text-xl font-semibold tabular-nums">${user.walletBalance.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">Available</span>
            </div>
            <div className="rounded-lg border border-border/60 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">DAK Tokens</span>
                <Coins className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold tabular-nums">{user.dakTokens.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">Discount credits</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Wallet Address</span>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
              <code className="flex-1 text-xs font-mono text-muted-foreground break-all leading-relaxed">
                {user.walletAddress}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(user.walletAddress)}
                className="shrink-0 h-7 w-7 p-0"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* DAK Discount Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-medium">Use DAK tokens for discounts</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Apply tokens to reduce fees on withdrawals &amp; claims
              </p>
            </div>
            <Checkbox 
              id="use-dak-discount" 
              checked={useDakDiscount}
              onCheckedChange={(checked) => setUseDakDiscount(checked as boolean)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border/60 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => setWithdrawModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </Button>
          <Button onClick={onClose} className="flex-1">Done</Button>
        </div>
      </DialogContent>
      
      <WithdrawModal 
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </Dialog>
  );
};