import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: any;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, pool }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const transactionFee = 2.50;
  const netAmount = pool.winnings ? (pool.winnings - transactionFee) : 0;

  const handleClaim = async () => {
    if (!destinationAddress.trim()) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid destination address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Claim Successful",
        description: `$${netAmount.toFixed(2)} has been sent to your address`,
      });
      setIsProcessing(false);
      setDestinationAddress('');
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Claim Pool Winnings
          </DialogTitle>
          <DialogDescription>
            Claim your winnings from {pool?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Winnings Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pool Winnings:</span>
                  <span className="font-medium">${pool?.winnings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Fee:</span>
                  <span className="font-medium">-${transactionFee}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Net Amount:</span>
                  <span className="font-semibold text-primary">${netAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destination Address */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              type="text"
              placeholder="Enter your wallet address"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Double-check your destination address. 
              Transactions cannot be reversed once processed.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              className="flex-1"
              disabled={isProcessing || !destinationAddress.trim()}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Claim ${netAmount.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};