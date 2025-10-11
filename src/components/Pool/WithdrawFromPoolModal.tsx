import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WithdrawFromPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: any;
}

export const WithdrawFromPoolModal: React.FC<WithdrawFromPoolModalProps> = ({ isOpen, onClose, pool }) => {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const withdrawalFee = 0.05; // 5% fee
  const maxWithdrawal = pool?.myBet || 0;
  const feeAmount = parseFloat(amount || '0') * withdrawalFee;
  const netAmount = parseFloat(amount || '0') - feeAmount;

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > maxWithdrawal) {
      toast({
        title: "Amount too high",
        description: `Maximum withdrawal is $${maxWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Withdrawal successful!",
      description: `$${netAmount.toFixed(2)} has been returned to your wallet (after ${(withdrawalFee * 100)}% fee)`,
    });

    setIsWithdrawing(false);
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw from Pool</DialogTitle>
          <DialogDescription>
            Withdraw your bet from "{pool?.title}". A {(withdrawalFee * 100)}% fee will be applied.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
                min="0"
                max={maxWithdrawal}
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: ${maxWithdrawal.toFixed(2)}
            </p>
          </div>

          {parseFloat(amount || '0') > 0 && (
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Withdrawal Amount:</span>
                <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee ({(withdrawalFee * 100)}%):</span>
                <span className="font-medium text-destructive">-${feeAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-sm">
                <span className="font-medium">You'll receive:</span>
                <span className="font-bold text-primary">${netAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Withdrawing from a pool before the match ends will incur a {(withdrawalFee * 100)}% fee. 
              This action cannot be undone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isWithdrawing}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawal || isWithdrawing}
            variant="destructive"
          >
            {isWithdrawing ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
