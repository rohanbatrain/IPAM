'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with Next.js
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface CountryData {
  country: string;
  continent: string;
  coordinates: [number, number]; // [lat, lng]
  allocatedRegions: number;
  totalCapacity: number;
  utilization: number;
  allocatedHosts?: number;
}

interface MapViewProps {
  data: CountryData[];
  activeLayer?: 'utilization' | 'allocation' | 'growth';
  onCountryClick?: (country: CountryData) => void;
  className?: string;
}

// Component to handle map updates
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export function MapView({ data, activeLayer = 'utilization', onCountryClick, className }: MapViewProps) {
  const router = useRouter();
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  const getMarkerColor = (country: CountryData) => {
    switch (activeLayer) {
      case 'utilization':
        if (country.utilization < 50) return '#10b981'; // green
        if (country.utilization < 80) return '#f59e0b'; // yellow
        return '#ef4444'; // red
      case 'allocation':
        const allocRatio = country.allocatedRegions / Math.max(country.totalCapacity, 1);
        if (allocRatio < 0.3) return '#3b82f6'; // blue
        if (allocRatio < 0.7) return '#8b5cf6'; // purple
        return '#ec4899'; // pink
      case 'growth':
        // Simulated growth rate - in real app, this would come from backend
        return '#06b6d4'; // cyan
      default:
        return '#6b7280'; // gray
    }
  };

  const getMarkerSize = (country: CountryData) => {
    // Size based on allocation count
    const baseSize = 8;
    const sizeMultiplier = Math.log(country.allocatedRegions + 1) * 3;
    return Math.min(baseSize + sizeMultiplier, 30);
  };

  const handleCountryClick = (country: CountryData) => {
    if (onCountryClick) {
      onCountryClick(country);
    } else {
      router.push(`/countries/${country.country}`);
    }
  };

  const zoomToCountry = (country: CountryData) => {
    setMapCenter(country.coordinates);
    setMapZoom(5);
  };

  return (
    <div className={cn('relative', className)}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((country) => (
          <CircleMarker
            key={country.country}
            center={country.coordinates}
            radius={getMarkerSize(country)}
            fillColor={getMarkerColor(country)}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.7}
            eventHandlers={{
              click: () => handleCountryClick(country),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{country.country}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Continent:</span>
                    <span className="font-medium">{country.continent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regions:</span>
                    <span className="font-medium">{country.allocatedRegions}</span>
                  </div>
                  {country.allocatedHosts !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hosts:</span>
                      <span className="font-medium">{country.allocatedHosts}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <Badge variant={country.utilization > 80 ? 'destructive' : 'default'}>
                      {country.utilization.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => zoomToCountry(country)}
                    className="flex-1"
                  >
                    Zoom
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCountryClick(country)}
                    className="flex-1"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
