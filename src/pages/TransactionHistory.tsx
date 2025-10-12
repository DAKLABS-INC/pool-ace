import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  address?: string;
  fee?: number;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    description: 'Initial deposit',
  },
  {
    id: '2',
    type: 'withdraw',
    amount: 250,
    date: '2024-01-14T15:45:00Z',
    status: 'completed',
    description: 'Pool winnings withdrawal',
    address: '0x742d35Cc6634C0532925a3b8D4C5B8B5C8D8E9F0',
    fee: 5,
  },
  {
    id: '3',
    type: 'deposit',
    amount: 500,
    date: '2024-01-13T09:15:00Z',
    status: 'completed',
    description: 'Wallet top-up',
  },
  {
    id: '4',
    type: 'deposit',
    amount: 150,
    date: '2024-01-12T14:20:00Z',
    status: 'completed',
    description: 'Joined Lakers vs Warriors pool',
  },
  {
    id: '5',
    type: 'deposit',
    amount: 75,
    date: '2024-01-11T11:10:00Z',
    status: 'completed',
    description: 'Pool winnings claim',
  },
  {
    id: '6',
    type: 'withdraw',
    amount: 300,
    date: '2024-01-10T16:30:00Z',
    status: 'completed',
    description: 'Withdrawal to wallet',
    address: '0x8f3c45Dd7823A1233e5b9c0d7E8F9A0B1C2D3E4F',
    fee: 6,
  },
  {
    id: '7',
    type: 'deposit',
    amount: 200,
    date: '2024-01-09T13:45:00Z',
    status: 'completed',
    description: 'Joined Premier League pool',
  },
  {
    id: '8',
    type: 'deposit',
    amount: 450,
    date: '2024-01-08T10:15:00Z',
    status: 'completed',
    description: 'Account funding',
  },
  {
    id: '9',
    type: 'deposit',
    amount: 100,
    date: '2024-01-07T17:20:00Z',
    status: 'completed',
    description: 'Pool entry - Man City vs Arsenal',
  },
  {
    id: '10',
    type: 'deposit',
    amount: 180,
    date: '2024-01-06T12:00:00Z',
    status: 'completed',
    description: 'Claimed pool rewards',
  },
  {
    id: '11',
    type: 'withdraw',
    amount: 125,
    date: '2024-01-05T09:30:00Z',
    status: 'pending',
    description: 'Pool exit withdrawal',
    address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    fee: 3,
  },
  {
    id: '12',
    type: 'deposit',
    amount: 350,
    date: '2024-01-04T15:50:00Z',
    status: 'completed',
    description: 'Deposit for NBA Championship pool',
  },
  {
    id: '13',
    type: 'deposit',
    amount: 90,
    date: '2024-01-03T11:25:00Z',
    status: 'completed',
    description: 'Pool winnings payout',
  },
  {
    id: '14',
    type: 'withdraw',
    amount: 500,
    date: '2024-01-02T14:40:00Z',
    status: 'completed',
    description: 'Large withdrawal',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    fee: 10,
  },
  {
    id: '15',
    type: 'deposit',
    amount: 275,
    date: '2024-01-01T10:10:00Z',
    status: 'completed',
    description: 'Joined Champions League pool',
  },
  {
    id: '16',
    type: 'deposit',
    amount: 150,
    date: '2023-12-31T16:00:00Z',
    status: 'completed',
    description: 'Bonus claim',
  },
  {
    id: '17',
    type: 'withdraw',
    amount: 200,
    date: '2023-12-30T13:20:00Z',
    status: 'failed',
    description: 'Failed withdrawal - insufficient balance',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    fee: 4,
  },
  {
    id: '18',
    type: 'deposit',
    amount: 320,
    date: '2023-12-29T09:45:00Z',
    status: 'completed',
    description: 'Pool deposit - Tennis Grand Slam',
  },
  {
    id: '19',
    type: 'deposit',
    amount: 110,
    date: '2023-12-28T15:30:00Z',
    status: 'completed',
    description: 'Claimed tournament winnings',
  },
  {
    id: '20',
    type: 'withdraw',
    amount: 400,
    date: '2023-12-27T11:55:00Z',
    status: 'completed',
    description: 'Pool exit payout',
    address: '0x5a4b3c2d1e0f9876543210fedcba9876543210fe',
    fee: 8,
  },
];

const TransactionHistory = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Please login to view transaction history</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground mt-2">View all your deposits and withdrawals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.description}
                      </div>
                      {transaction.address && (
                        <div className="text-xs text-muted-foreground font-mono">
                          To: {transaction.address.slice(0, 10)}...{transaction.address.slice(-8)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </div>
                    {transaction.fee && (
                      <div className="text-xs text-muted-foreground">
                        Fee: ${transaction.fee}
                      </div>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(transaction.status)} text-xs`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;