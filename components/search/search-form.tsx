'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountries } from '@/lib/hooks/use-countries';
import { useSavedFilters } from '@/lib/hooks/use-search';
import type { SearchFilters } from '@/lib/api/search';
import { Search, Save, X, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export function SearchForm({ onSearch, initialFilters = {} }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const { data: countries } = useCountries();
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) return;

    await saveFilter.mutateAsync({
      name: filterName,
      filters,
    });

    setShowSaveDialog(false);
    setFilterName('');
  };

  const handleLoadFilter = (savedFilter: typeof savedFilters[0]) => {
    setFilters(savedFilter.filters);
    onSearch(savedFilter.filters);
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <div className="space-y-4">
      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Filters</CardTitle>
            <CardDescription>Quick access to your saved search filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((saved) => (
                <Badge
                  key={saved.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 gap-2"
                >
                  <button onClick={() => handleLoadFilter(saved)} className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {saved.name}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFilter.mutate(saved.id);
                    }}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <CardDescription>Search across hosts and regions with multiple criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="query">General Search</Label>
                <Input
                  id="query"
                  placeholder="Search by name, IP, or keyword..."
                  value={filters.query || ''}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input
                  id="ip_address"
                  placeholder="e.g., 10.0.1.5"
                  value={filters.ip_address || ''}
                  onChange={(e) => setFilters({ ...filters, ip_address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input
                  id="hostname"
                  placeholder="e.g., web-server"
                  value={filters.hostname || ''}
                  onChange={(e) => setFilters({ ...filters, hostname: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={filters.country || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, country: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All countries</SelectItem>
                    {countries?.map((country) => (
                      <SelectItem key={country.country} value={country.country}>
                        {country.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  placeholder="e.g., Mumbai DC1"
                  value={filters.region || ''}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Released">Released</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  placeholder="e.g., DevOps Team"
                  value={filters.owner || ''}
                  onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {hasFilters && (
                <>
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSaveDialog(true)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Filter
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Save Filter Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search Filter</DialogTitle>
            <DialogDescription>
              Give your search filter a name for quick access later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                placeholder="e.g., Active Production Hosts"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
