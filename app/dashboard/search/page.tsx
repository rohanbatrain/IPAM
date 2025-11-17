'use client';

import { useState } from 'react';
import { SearchForm } from '@/components/search/search-form';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/lib/hooks/use-search';
import type { SearchFilters } from '@/lib/api/search';

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading } = useSearch(filters, hasSearched);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search</h2>
        <p className="text-muted-foreground">
          Search across all hosts and regions with advanced filtering
        </p>
      </div>

      <SearchForm onSearch={handleSearch} initialFilters={filters} />

      {hasSearched && (
        <SearchResults
          results={data?.results || []}
          isLoading={isLoading}
          query={filters.query || filters.ip_address || filters.hostname}
        />
      )}
    </div>
  );
}
