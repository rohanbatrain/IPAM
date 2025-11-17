'use client';

import { HostForm } from '@/components/forms/host-form';

export default function CreateHostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Allocate Host</h2>
        <p className="text-muted-foreground">
          Assign a new IP address to a host in your network
        </p>
      </div>

      <HostForm />
    </div>
  );
}
