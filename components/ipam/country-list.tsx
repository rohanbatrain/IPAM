'use client';

import { useState } from 'react';
import { useCountries } from '@/lib/hooks/use-countries';
import { CountryCard } from './country-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function CountryList() {
  const { data: countries, isLoading, error } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load countries</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No countries available</p>
      </div>
    );
  }

  // Filter countries by search term
  const filteredCountries = countries.filter(
    (country) =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.continent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by continent
  const continents = Array.from(new Set(filteredCountries.map((c) => c.continent))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search countries or continents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
        </div>
      </div>

      {continents.map((continent) => {
        const continentCountries = filteredCountries.filter((c) => c.continent === continent);

        return (
          <div key={continent} className="space-y-4">
            <h3 className="text-xl font-semibold">{continent}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {continentCountries.map((country) => (
                <CountryCard
                  key={country.country}
                  country={country}
                  onClick={() => router.push(`/dashboard/countries/${country.country}`)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No countries match your search</p>
        </div>
      )}
    </div>
  );
}
