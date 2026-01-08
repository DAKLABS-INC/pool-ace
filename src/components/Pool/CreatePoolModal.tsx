import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Trophy, MapPin, X, Check } from "lucide-react";
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

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const [winSplit, setWinSplit] = useState([70]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Pool</DialogTitle>
          <DialogDescription>Set up your betting pool for an upcoming match</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <CardTitle>Pool Configuration</CardTitle>
            <CardDescription>Configure your pool settings and match selection</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(90vh-180px)]">
            <CardContent className="space-y-6 pl-1 pr-4 pb-8">
              {/* Match Search */}
              <div className="space-y-2">
                <Label>Search Match</Label>
                
                {selectedMatch ? (
                  <div className="relative p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={handleClearSelection}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className={getSportColor(selectedMatch.sport)}>
                            {selectedMatch.sport}
                          </Badge>
                          <Badge variant="outline" className="bg-muted/50">
                            <Trophy className="h-3 w-3 mr-1" />
                            {selectedMatch.league}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {selectedMatch.date}, {selectedMatch.time}
                          </span>
                          {selectedMatch.venue && (
                            <span className="flex items-center gap-1">
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
                      <div className="absolute z-50 w-full mt-1 rounded-lg border border-border bg-popover shadow-lg">
                        <ScrollArea className="max-h-[280px]">
                          {filteredMatches.length > 0 ? (
                            <div className="p-1">
                              {filteredMatches.map((match) => (
                                <button
                                  key={match.id}
                                  className="w-full p-3 text-left rounded-md hover:bg-accent transition-colors"
                                  onClick={() => handleSelectMatch(match)}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-foreground truncate">
                                        {match.homeTeam} vs {match.awayTeam}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <Badge 
                                          variant="outline" 
                                          className={`text-[10px] px-1.5 py-0 h-5 ${getSportColor(match.sport)}`}
                                        >
                                          {match.sport}
                                        </Badge>
                                        <Badge 
                                          variant="outline" 
                                          className="text-[10px] px-1.5 py-0 h-5 bg-muted/50"
                                        >
                                          {match.league}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {match.date}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {match.time}
                                      </p>
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

              <div className="space-y-2">
                <Label htmlFor="min-deposit">Minimum Deposit ($)</Label>
                <Input
                  id="min-deposit"
                  type="number"
                  placeholder="50"
                  min="1"
                />
              </div>

              <div className="space-y-4">
                <Label>Win/Loss Split Ratio</Label>
                <div className="px-3">
                  <Slider
                    value={winSplit}
                    onValueChange={setWinSplit}
                    max={90}
                    min={60}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Winners get {winSplit[0]}%</span>
                  <span>Losers get {100 - winSplit[0]}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-pool">Private Pool</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this pool invite-only
                  </p>
                </div>
                <Switch
                  id="private-pool"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>

              {isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code (Optional)</Label>
                  <Input
                    id="invite-code"
                    placeholder="Enter custom invite code"
                  />
                </div>
              )}

              <Button className="w-full" size="lg" disabled={!selectedMatch}>
                Create Pool
              </Button>
            </CardContent>
          </ScrollArea>
        </Card>
      </DialogContent>
    </Dialog>
  );
};