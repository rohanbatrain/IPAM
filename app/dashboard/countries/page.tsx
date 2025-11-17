'use client';

import { CountryList } from '@/components/ipam/country-list';

export default function CountriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Countries</h2>
        <p className="text-muted-foreground">
          Browse available countries and their IP address allocations
        </p>
      </div>

      <CountryList />
    </div>
  );
}
