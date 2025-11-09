import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PoolFilterValues {
  minParticipants: number;
  maxParticipants: number;
  minWinPercentage: number;
  maxWinPercentage: number;
  dateFilter: string;
  minDeposit: number;
  maxDeposit: number;
}

interface PoolFiltersProps {
  filters: PoolFilterValues;
  onFiltersChange: (filters: PoolFilterValues) => void;
  onClearFilters: () => void;
}

export const PoolFilters = ({ filters, onFiltersChange, onClearFilters }: PoolFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleParticipantsChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minParticipants: values[0],
      maxParticipants: values[1],
    });
  };

  const handleWinPercentageChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minWinPercentage: values[0],
      maxWinPercentage: values[1],
    });
  };

  const handleDepositChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minDeposit: values[0],
      maxDeposit: values[1],
    });
  };

  const handleDateFilterChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateFilter: value,
    });
  };

  const activeFiltersCount = [
    filters.minParticipants > 0 || filters.maxParticipants < 100,
    filters.minWinPercentage > 0 || filters.maxWinPercentage < 100,
    filters.dateFilter !== "all",
    filters.minDeposit > 0 || filters.maxDeposit < 1000,
  ].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Filter Pools</SheetTitle>
          <SheetDescription>
            Customize your pool search with advanced filters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Number of Participants */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Number of Participants</Label>
            <div className="space-y-2">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[filters.minParticipants, filters.maxParticipants]}
                onValueChange={handleParticipantsChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Min: {filters.minParticipants}</span>
                <span>Max: {filters.maxParticipants}</span>
              </div>
            </div>
          </div>

          {/* Winner Percentage */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Winner Percentage</Label>
            <div className="space-y-2">
              <Slider
                min={0}
                max={100}
                step={5}
                value={[filters.minWinPercentage, filters.maxWinPercentage]}
                onValueChange={handleWinPercentageChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Min: {filters.minWinPercentage}%</span>
                <span>Max: {filters.maxWinPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Date Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Match Date</Label>
            <Select value={filters.dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Deposit Amount */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Deposit Amount ($)</Label>
            <div className="space-y-2">
              <Slider
                min={0}
                max={1000}
                step={10}
                value={[filters.minDeposit, filters.maxDeposit]}
                onValueChange={handleDepositChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Min: ${filters.minDeposit}</span>
                <span>Max: ${filters.maxDeposit}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClearFilters();
                setIsOpen(false);
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
