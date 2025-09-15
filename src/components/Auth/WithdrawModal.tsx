import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, updateWallet } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const transactionFee = 5; // Fixed $5 fee
  const minWithdraw = 10;
  const amount = parseFloat(withdrawAmount) || 0;
  const totalDeduction = amount + transactionFee;

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount || !destinationAddress) return;
    
    if (amount < minWithdraw) {
      toast({
        title: "Invalid amount",
        description: `Minimum withdrawal is $${minWithdraw}`,
        variant: "destructive",
      });
      return;
    }

    if (totalDeduction > user.walletBalance) {
      toast({
        title: "Insufficient funds",
        description: "Not enough balance to cover withdrawal and fees",
        variant: "destructive",
      });
      return;
    }

    if (!destinationAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      updateWallet(-totalDeduction);
      
      toast({
        title: "Withdrawal submitted!",
        description: `$${amount} withdrawal to ${destinationAddress.slice(0, 10)}...${destinationAddress.slice(-8)} is being processed`,
      });

      setWithdrawAmount('');
      setDestinationAddress('');
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  if (!user) return null;

  const isValidAmount = amount >= minWithdraw && totalDeduction <= user.walletBalance;
  const isValidAddress = destinationAddress.match(/^0x[a-fA-F0-9]{40}$/);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Balance */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${user.walletBalance.toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="destination-address">Destination Wallet Address</Label>
              <Input
                id="destination-address"
                placeholder="0x742d35Cc6634C0532925a3b8D4C5B8B5C8D8E9F0"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="font-mono text-sm"
              />
              {destinationAddress && !isValidAddress && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Invalid wallet address format
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="withdraw-amount">Withdrawal Amount (USD)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={minWithdraw}
                max={user.walletBalance - transactionFee}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum withdrawal: ${minWithdraw}
              </p>
            </div>
          </div>

          <Separator />

          {/* Transaction Summary */}
          {amount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Transaction Summary</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Withdrawal Amount</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Fee</span>
                  <span>${transactionFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Deduction</span>
                  <span>${totalDeduction.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Remaining Balance</span>
                  <span>${(user.walletBalance - totalDeduction).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={!isValidAmount || !isValidAddress || !destinationAddress || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : `Withdraw $${amount.toFixed(2) || '0.00'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};