import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Trophy, MapPin, X, Check, Plus, Trash2, BarChart3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league: string;
  date: string;
  time: string;
  venue?: string;
}

const MOCK_MATCHES: Match[] = [
  { id: '1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', sport: 'Football', league: 'Premier League', date: 'Jan 15', time: '3:00 PM', venue: 'Etihad Stadium' },
  { id: '2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', sport: 'Football', league: 'Premier League', date: 'Jan 16', time: '5:30 PM', venue: 'Anfield' },
  { id: '3', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', sport: 'Football', league: 'La Liga', date: 'Jan 17', time: '8:00 PM', venue: 'Santiago Bernabéu' },
  { id: '4', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', sport: 'Football', league: 'Bundesliga', date: 'Jan 18', time: '2:30 PM', venue: 'Allianz Arena' },
  { id: '5', homeTeam: 'Lakers', awayTeam: 'Warriors', sport: 'Basketball', league: 'NBA', date: 'Jan 17', time: '7:00 PM', venue: 'Crypto.com Arena' },
  { id: '6', homeTeam: 'Celtics', awayTeam: 'Heat', sport: 'Basketball', league: 'NBA', date: 'Jan 18', time: '8:30 PM', venue: 'TD Garden' },
  { id: '7', homeTeam: 'Bulls', awayTeam: 'Knicks', sport: 'Basketball', league: 'NBA', date: 'Jan 19', time: '6:00 PM', venue: 'United Center' },
  { id: '8', homeTeam: 'Chiefs', awayTeam: 'Bills', sport: 'Football', league: 'NFL', date: 'Jan 20', time: '1:00 PM', venue: 'Arrowhead Stadium' },
  { id: '9', homeTeam: 'Eagles', awayTeam: 'Cowboys', sport: 'Football', league: 'NFL', date: 'Jan 21', time: '4:25 PM', venue: 'Lincoln Financial Field' },
  { id: '10', homeTeam: 'Djokovic', awayTeam: 'Alcaraz', sport: 'Tennis', league: 'Australian Open', date: 'Jan 22', time: '9:00 AM', venue: 'Rod Laver Arena' },
  { id: '11', homeTeam: 'Sinner', awayTeam: 'Medvedev', sport: 'Tennis', league: 'Australian Open', date: 'Jan 23', time: '11:00 AM', venue: 'Rod Laver Arena' },
  { id: '12', homeTeam: 'All Blacks', awayTeam: 'Springboks', sport: 'Rugby', league: 'Rugby Championship', date: 'Jan 24', time: '5:00 PM', venue: 'Eden Park' },
];

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PoolType = 'pool' | 'market';

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const [poolType, setPoolType] = useState<PoolType>('pool');
  const [winSplit, setWinSplit] = useState([70]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Market-specific state
  const [marketTitle, setMarketTitle] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>(['', '']);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_MATCHES.slice(0, 6);
    const query = searchQuery.toLowerCase();
    return MOCK_MATCHES.filter(match =>
      match.homeTeam.toLowerCase().includes(query) ||
      match.awayTeam.toLowerCase().includes(query) ||
      match.sport.toLowerCase().includes(query) ||
      match.league.toLowerCase().includes(query) ||
      `${match.homeTeam} vs ${match.awayTeam}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getSportColor = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'basketball': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'tennis': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rugby': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleClearSelection = () => {
    setSelectedMatch(null);
    setSearchQuery('');
  };

  const addAlternative = () => {
    setAlternatives([...alternatives, '']);
  };

  const removeAlternative = (index: number) => {
    if (alternatives.length <= 2) return;
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const updateAlternative = (index: number, value: string) => {
    const updated = [...alternatives];
    updated[index] = value;
    setAlternatives(updated);
  };

  const isPoolValid = poolType === 'pool' ? !!selectedMatch : (marketTitle.trim() !== '' && alternatives.filter(a => a.trim()).length >= 2);

  const handleReset = () => {
    setPoolType('pool');
    setWinSplit([70]);
    setIsPrivate(false);
    setSearchQuery('');
    setSelectedMatch(null);
    setMarketTitle('');
    setAlternatives(['', '']);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); handleReset(); } }}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <h2 className="text-lg font-semibold">Create New</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Set up a pool or custom market</p>
        </div>

        <div className="overflow-y-auto scrollbar-hide">
          <div className="px-6 py-5 space-y-5">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPoolType('pool')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  poolType === 'pool'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                }`}
              >
                {poolType === 'pool' && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${poolType === 'pool' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Pool</p>
                  <p className="text-[11px] text-muted-foreground">Bet on a match</p>
                </div>
              </button>

              <button
                onClick={() => setPoolType('market')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  poolType === 'market'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                }`}
              >
                {poolType === 'market' && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${poolType === 'market' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Market</p>
                  <p className="text-[11px] text-muted-foreground">Custom outcomes</p>
                </div>
              </button>
            </div>

            {/* Pool Flow: Match Search */}
            {poolType === 'pool' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Match</Label>
                {selectedMatch ? (
                  <div className="relative p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/10"
                      onClick={handleClearSelection}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getSportColor(selectedMatch.sport)}`}>
                            {selectedMatch.sport}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {selectedMatch.date}, {selectedMatch.time}
                          </span>
                          {selectedMatch.venue && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />
                              {selectedMatch.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by team, sport, or league..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="pl-10"
                      />
                    </div>
                    {isSearchFocused && (
                      <div className="absolute z-50 w-full mt-1 rounded-lg border bg-popover shadow-lg">
                        <ScrollArea className="max-h-[240px]">
                          {filteredMatches.length > 0 ? (
                            <div className="p-1">
                              {filteredMatches.map((match) => (
                                <button
                                  key={match.id}
                                  className="w-full p-3 text-left rounded-md hover:bg-accent transition-colors"
                                  onClick={() => handleSelectMatch(match)}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {match.homeTeam} vs {match.awayTeam}
                                      </p>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getSportColor(match.sport)}`}>
                                          {match.sport}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-muted/50">
                                          {match.league}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 text-[11px] text-muted-foreground">
                                      <p>{match.date}</p>
                                      <p>{match.time}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No matches found for "{searchQuery}"
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Market Flow: Title + Alternatives */}
            {poolType === 'market' && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Market Title</Label>
                  <Input
                    placeholder="e.g. Who will win the Ballon d'Or 2025?"
                    value={marketTitle}
                    onChange={(e) => setMarketTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Alternatives</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-primary hover:text-primary"
                      onClick={addAlternative}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {alternatives.map((alt, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full border bg-muted flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-semibold text-muted-foreground">{index + 1}</span>
                        </div>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={alt}
                          onChange={(e) => updateAlternative(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => removeAlternative(index)}
                          disabled={alternatives.length <= 2}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Minimum 2 alternatives required</p>
                </div>
              </>
            )}

            {/* Shared Settings */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Minimum Deposit ($)</Label>
              <Input type="number" placeholder="50" min="1" />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Win/Loss Split</Label>
              <div className="px-1">
                <Slider value={winSplit} onValueChange={setWinSplit} max={90} min={60} step={5} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Winners: {winSplit[0]}%</span>
                <span>Losers: {100 - winSplit[0]}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Private {poolType === 'pool' ? 'Pool' : 'Market'}</p>
                <p className="text-[11px] text-muted-foreground">Invite-only access</p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>

            {isPrivate && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Invite Code (Optional)</Label>
                <Input placeholder="Custom invite code" />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/20">
            <Button className="w-full" size="lg" disabled={!isPoolValid}>
              Create {poolType === 'pool' ? 'Pool' : 'Market'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
