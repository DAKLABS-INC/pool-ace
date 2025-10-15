import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const [winSplit, setWinSplit] = useState([70]);
  const [isPrivate, setIsPrivate] = useState(false);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="rugby">Rugby</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="league">League/Competition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select league" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premier-league">Premier League</SelectItem>
                    <SelectItem value="champions-league">Champions League</SelectItem>
                    <SelectItem value="nba">NBA</SelectItem>
                    <SelectItem value="nfl">NFL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="match">Match</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man-city-arsenal">
                    <div className="flex items-center justify-between w-full min-w-[300px]">
                      <span>Man City vs Arsenal</span>
                      <span className="text-xs text-accent/80 ml-8">Jan 15, 3:00 PM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="liverpool-chelsea">
                    <div className="flex items-center justify-between w-full min-w-[300px]">
                      <span>Liverpool vs Chelsea</span>
                      <span className="text-xs text-accent/80 ml-8">Jan 16, 5:30 PM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lakers-warriors">
                    <div className="flex items-center justify-between w-full min-w-[300px]">
                      <span>Lakers vs Warriors</span>
                      <span className="text-xs text-accent/80 ml-8">Jan 17, 7:00 PM</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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

              <Button className="w-full" size="lg">
                Create Pool
              </Button>
            </CardContent>
          </ScrollArea>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
