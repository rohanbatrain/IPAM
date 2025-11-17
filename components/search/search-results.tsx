'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, getStatusBadgeVariant } from '@/lib/utils/format';
import type { SearchResult } from '@/lib/api/search';
import { Server, Network, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query?: string;
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  const highlightText = (text: string, query?: string) => {
    if (!query || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'host') {
      router.push(`/dashboard/hosts/${result.id}`);
    } else {
      router.push(`/dashboard/regions/${result.id}`);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Found {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.map((result) => (
        <Card
          key={`${result.type}-${result.id}`}
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
          onClick={() => handleResultClick(result)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1">
                {result.type === 'host' ? (
                  <Server className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Network className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {result.type}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(result.status)}>
                    {result.status}
                  </Badge>
                </div>

                <h3 className="font-medium text-lg mb-1">
                  {highlightText(result.name, query)}
                </h3>

                {/* Hierarchical Context */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  {result.continent && (
                    <>
                      <span>{result.continent}</span>
                      <ChevronRight className="h-3 w-3" />
                    </>
                  )}
                  <span>{result.country}</span>
                  {result.region && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span>{result.region}</span>
                    </>
                  )}
                  {result.type === 'host' && result.ip_address && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <code className="font-mono">{highlightText(result.ip_address, query)}</code>
                    </>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {result.type === 'host' && result.ip_address && (
                    <div>
                      <span className="text-muted-foreground">IP: </span>
                      <code className="font-mono">{highlightText(result.ip_address, query)}</code>
                    </div>
                  )}
                  {result.type === 'region' && result.cidr && (
                    <div>
                      <span className="text-muted-foreground">CIDR: </span>
                      <code className="font-mono">{result.cidr}</code>
                    </div>
                  )}
                  {result.owner && (
                    <div>
                      <span className="text-muted-foreground">Owner: </span>
                      <span>{result.owner}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span>{formatDate(result.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="mt-1">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
