'use client';

import { useSearchParams } from 'next/navigation';
import { RegionForm } from '@/components/forms/region-form';

export default function CreateRegionPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Region</h2>
        <p className="text-muted-foreground">
          Allocate a new /24 network region for IP address management
          {country && ` in ${country}`}
        </p>
      </div>

      <RegionForm preselectedCountry={country || undefined} />
    </div>
  );
}
