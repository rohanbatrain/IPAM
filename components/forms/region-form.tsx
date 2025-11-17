'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountries } from '@/lib/hooks/use-countries';
import { useCreateRegion } from '@/lib/hooks/use-regions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RegionForm({ preselectedCountry }: { preselectedCountry?: string }) {
  const router = useRouter();
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const createRegion = useCreateRegion();

  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [formData, setFormData] = useState({
    country: '',
    region_name: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate continent and country if preselected
  useEffect(() => {
    if (preselectedCountry && countries) {
      const country = countries.find((c) => c.country === preselectedCountry);
      if (country) {
        setSelectedContinent(country.continent);
        setFormData((prev) => ({ ...prev, country: preselectedCountry }));
      }
    }
  }, [preselectedCountry, countries]);

  // Get unique continents from countries
  const continents = Array.from(new Set(countries?.map((c) => c.continent) || [])).sort();

  // Filter countries by selected continent
  const filteredCountries = selectedContinent
    ? countries?.filter((c) => c.continent === selectedContinent)
    : countries;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.region_name) {
      newErrors.region_name = 'Region name is required';
    } else if (formData.region_name.length < 2) {
      newErrors.region_name = 'Region name must be at least 2 characters';
    } else if (formData.region_name.length > 100) {
      newErrors.region_name = 'Region name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createRegion.mutateAsync({
        country: formData.country,
        region_name: formData.region_name,
        description: formData.description || undefined,
      });

      router.push('/dashboard/regions');
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create region:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/regions');
  };

  if (countriesLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Get selected country info
  const selectedCountry = countries?.find((c) => c.country === formData.country);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Region</CardTitle>
        <CardDescription>
          Allocate a new /24 network region. The system will automatically assign the next available
          X.Y values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Continent */}
          <div className="space-y-2">
            <Label htmlFor="continent">
              Continent <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedContinent}
              onValueChange={(value) => {
                setSelectedContinent(value);
                setFormData({ ...formData, country: '' }); // Reset country when continent changes
              }}
            >
              <SelectTrigger id="continent">
                <SelectValue placeholder="Select a continent" />
              </SelectTrigger>
              <SelectContent>
                {continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {continents.length} continents available
            </p>
          </div>

          {/* Step 2: Select Country (only shown after continent is selected) */}
          {selectedContinent && (
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger id="country" className={errors.country ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCountries?.map((country) => (
                    <SelectItem key={country.country} value={country.country}>
                      {country.country} - X:{country.x_start}-{country.x_end}
                      {country.is_reserved && ' (Reserved)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
              {selectedCountry && (
                <div className="rounded-md bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">X Octet Range:</span>
                    <span className="font-medium">{selectedCountry.x_start}-{selectedCountry.x_end} ({selectedCountry.total_blocks} blocks)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regions Allocated:</span>
                    <span className="font-medium">{selectedCountry.allocated_regions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className="font-medium">{(selectedCountry.utilization_percentage ?? 0).toFixed(1)}%</span>
                  </div>
                  {selectedCountry.is_reserved && (
                    <div className="pt-1 border-t border-border">
                      <span className="text-amber-600 dark:text-amber-500 font-medium">⚠️ Reserved for future use</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="region_name">
              Region Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="region_name"
              placeholder="e.g., Mumbai DC1, Tokyo Office"
              value={formData.region_name}
              onChange={(e) => setFormData({ ...formData, region_name: e.target.value })}
              className={errors.region_name ? 'border-destructive' : ''}
            />
            {errors.region_name && (
              <p className="text-sm text-destructive">{errors.region_name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              A descriptive name for this region (2-100 characters)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this region..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Additional details about this region (max 500 characters)
            </p>
          </div>

          {formData.country && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Auto-Assignment Preview</h4>
              <p className="text-sm text-muted-foreground">
                The system will automatically assign the next available /24 CIDR block in the{' '}
                <strong>{formData.country}</strong> range when you create this region.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={createRegion.isPending}>
              {createRegion.isPending ? 'Creating...' : 'Create Region'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
