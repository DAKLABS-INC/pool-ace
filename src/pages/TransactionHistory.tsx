import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, ArrowLeft, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  { id: '1', type: 'deposit', amount: 1000, date: '2024-01-15T10:30:00Z', status: 'completed', description: 'Initial deposit' },
  { id: '2', type: 'withdraw', amount: 250, date: '2024-01-14T15:45:00Z', status: 'completed', description: 'Pool winnings withdrawal', address: '0x742d35Cc6634C0532925a3b8D4C5B8B5C8D8E9F0', fee: 5 },
  { id: '3', type: 'deposit', amount: 500, date: '2024-01-13T09:15:00Z', status: 'completed', description: 'Wallet top-up' },
  { id: '4', type: 'deposit', amount: 150, date: '2024-01-12T14:20:00Z', status: 'completed', description: 'Joined Lakers vs Warriors pool' },
  { id: '5', type: 'deposit', amount: 75, date: '2024-01-11T11:10:00Z', status: 'completed', description: 'Pool winnings claim' },
  { id: '6', type: 'withdraw', amount: 300, date: '2024-01-10T16:30:00Z', status: 'completed', description: 'Withdrawal to wallet', address: '0x8f3c45Dd7823A1233e5b9c0d7E8F9A0B1C2D3E4F', fee: 6 },
  { id: '7', type: 'deposit', amount: 200, date: '2024-01-09T13:45:00Z', status: 'completed', description: 'Joined Premier League pool' },
  { id: '8', type: 'deposit', amount: 450, date: '2024-01-08T10:15:00Z', status: 'completed', description: 'Account funding' },
  { id: '9', type: 'deposit', amount: 100, date: '2024-01-07T17:20:00Z', status: 'completed', description: 'Pool entry - Man City vs Arsenal' },
  { id: '10', type: 'deposit', amount: 180, date: '2024-01-06T12:00:00Z', status: 'completed', description: 'Claimed pool rewards' },
  { id: '11', type: 'withdraw', amount: 125, date: '2024-01-05T09:30:00Z', status: 'pending', description: 'Pool exit withdrawal', address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', fee: 3 },
  { id: '12', type: 'deposit', amount: 350, date: '2024-01-04T15:50:00Z', status: 'completed', description: 'Deposit for NBA Championship pool' },
  { id: '13', type: 'deposit', amount: 90, date: '2024-01-03T11:25:00Z', status: 'completed', description: 'Pool winnings payout' },
  { id: '14', type: 'withdraw', amount: 500, date: '2024-01-02T14:40:00Z', status: 'completed', description: 'Large withdrawal', address: '0xabcdef1234567890abcdef1234567890abcdef12', fee: 10 },
  { id: '15', type: 'deposit', amount: 275, date: '2024-01-01T10:10:00Z', status: 'completed', description: 'Joined Champions League pool' },
  { id: '16', type: 'deposit', amount: 150, date: '2023-12-31T16:00:00Z', status: 'completed', description: 'Bonus claim' },
  { id: '17', type: 'withdraw', amount: 200, date: '2023-12-30T13:20:00Z', status: 'failed', description: 'Failed withdrawal - insufficient balance', address: '0x9876543210fedcba9876543210fedcba98765432', fee: 4 },
  { id: '18', type: 'deposit', amount: 320, date: '2023-12-29T09:45:00Z', status: 'completed', description: 'Pool deposit - Tennis Grand Slam' },
  { id: '19', type: 'deposit', amount: 110, date: '2023-12-28T15:30:00Z', status: 'completed', description: 'Claimed tournament winnings' },
  { id: '20', type: 'withdraw', amount: 400, date: '2023-12-27T11:55:00Z', status: 'completed', description: 'Pool exit payout', address: '0x5a4b3c2d1e0f9876543210fedcba9876543210fe', fee: 8 },
];

const TransactionHistory = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Please login to view transaction history</p>
      </div>
    );
  }

  const filtered = mockTransactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totals = mockTransactions.reduce(
    (acc, t) => {
      if (t.status !== 'failed') {
        if (t.type === 'deposit') acc.deposits += t.amount;
        else acc.withdrawals += t.amount;
      }
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const statusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction History</h1>
        <p className="text-sm text-muted-foreground mt-1">A complete record of all your deposits, withdrawals, and fees.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Deposits</p>
          <p className="text-xl font-semibold mt-1 text-emerald-600 dark:text-emerald-400">+${totals.deposits.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Withdrawals</p>
          <p className="text-xl font-semibold mt-1 text-red-500">-${totals.withdrawals.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Net Flow</p>
          <p className="text-xl font-semibold mt-1">${(totals.deposits - totals.withdrawals).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdraw">Withdrawals</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider font-medium">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-medium">Description</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-medium">Date</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-medium text-right">Amount</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-medium text-right">Fee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-medium text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                          t.type === 'deposit'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {t.type === 'deposit' ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-sm font-medium capitalize">{t.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm">{t.description}</p>
                      {t.address && (
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {t.address.slice(0, 8)}…{t.address.slice(-6)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm">{formatDate(t.date)}</p>
                      <p className="text-[11px] text-muted-foreground">{formatTime(t.date)}</p>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className={`text-sm font-semibold ${
                        t.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                      }`}>
                        {t.type === 'deposit' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm text-muted-foreground">
                      {t.fee ? `$${t.fee}` : '—'}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Badge variant="outline" className={`text-[11px] font-medium ${statusStyle(t.status)}`}>
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground mt-3 text-center">
        Showing {filtered.length} of {mockTransactions.length} transactions
      </p>
    </div>
  );
};

export default TransactionHistory;
