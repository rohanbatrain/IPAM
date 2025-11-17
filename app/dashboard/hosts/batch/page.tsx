'use client';

import { BatchHostForm } from '@/components/forms/batch-host-form';

export default function BatchCreateHostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Batch Allocate Hosts</h2>
        <p className="text-muted-foreground">
          Allocate multiple IP addresses at once with sequential hostnames
        </p>
      </div>

      <BatchHostForm />
    </div>
  );
}
