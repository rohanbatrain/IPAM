'use client';

import { useState } from 'react';
import { IPHierarchyTree } from '@/components/ipam/ip-hierarchy-tree';
import { useHierarchy } from '@/lib/hooks/use-hierarchy';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function HierarchyPage() {
  const { data, isLoading, error } = useHierarchy();
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Filter tree based on search
  const filterTree = (nodes: any[], term: string): any[] => {
    if (!term) return nodes;

    const termLower = term.toLowerCase();
    
    return nodes.reduce((acc: any[], node) => {
      const matchesLabel = node.label.toLowerCase().includes(termLower);
      const matchesMetadata = 
        node.metadata?.cidr?.toLowerCase().includes(termLower) ||
        node.metadata?.ipAddress?.toLowerCase().includes(termLower);

      if (matchesLabel || matchesMetadata) {
        acc.push(node);
      } else if (node.children) {
        const filteredChildren = filterTree(node.children, term);
        if (filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }
      }

      return acc;
    }, []);
  };

  const filteredData = data ? filterTree(data, searchTerm) : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load hierarchy</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">IP Hierarchy</h1>
        <p className="text-muted-foreground mt-2">
          Visualize the complete IP allocation hierarchy from continents to individual hosts
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, CIDR, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-16 text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {data.length}
            </div>
            <div className="text-sm text-muted-foreground">Continents</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {data.reduce((sum, continent) => sum + (continent.children?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {data.reduce((sum, continent) => 
                sum + (continent.children?.reduce((s, country) => 
                  s + (country.children?.length || 0), 0) || 0), 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Regions</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {data.reduce((sum, continent) => 
                sum + (continent.children?.reduce((s, country) => 
                  s + (country.children?.reduce((ss, region) => 
                    ss + (region.children?.length || 0), 0) || 0), 0) || 0), 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Hosts</div>
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div
        className={cn(
          'transition-all duration-200',
          isFullscreen && 'fixed inset-0 z-50 bg-background p-6 overflow-auto'
        )}
        style={{ fontSize: `${zoom}%` }}
      >
        {filteredData.length === 0 && searchTerm ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
          </div>
        ) : (
          <IPHierarchyTree
            data={filteredData}
            expandedByDefault={false}
            showUtilization={true}
          />
        )}
      </div>
    </div>
  );
}
