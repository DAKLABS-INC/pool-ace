import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, User, Copy, Check, ArrowUpRight, RefreshCw, Coins } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <div className="text-lg font-semibold">{user.name}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="text-sm">{user.email}</div>
            </div>
          </div>

          <Separator />

          {/* Wallet Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Wallet Details</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Wallet Balance</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    ${user.walletBalance.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshWallet}
                    className="h-7 w-7 p-0 ml-auto"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm font-mono break-all">
                    {user.walletAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.walletAddress)}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* DAK Tokens Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">DAK Tokens</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Accumulated Tokens</label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {user.dakTokens.toLocaleString()} DAK
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Discount Credits
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use DAK tokens to get discounts on pool entries and transactions
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setWithdrawModalOpen(true)}
              className="flex items-center gap-2"
            >
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
      
      <WithdrawModal 
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </Dialog>
  );
};