'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TechStack() {
  return (
    <section id="tech-stack-section" className="py-20 bg-muted/30" aria-labelledby="tech-stack-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 id="tech-stack-heading" className="mb-4 text-3xl font-bold sm:text-4xl">
              Technical Specifications
            </h2>
            <p className="text-lg text-muted-foreground">
              Built on modern, production-ready technologies
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Frontend */}
            <Card>
              <CardHeader>
                <CardTitle>IPAM Frontend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <TechItem label="Framework" value="Next.js 14+ (App Router)" />
                <TechItem label="Runtime" value="Bun" />
                <TechItem label="Language" value="TypeScript 5+" />
                <TechItem label="Styling" value="Tailwind CSS 3+" />
                <TechItem label="Components" value="shadcn/ui (Radix UI)" />
                <TechItem label="State" value="Zustand + React Query" />
                <TechItem label="Charts" value="Recharts" />
                <TechItem label="Maps" value="Leaflet + OpenStreetMap" />
              </CardContent>
            </Card>

            {/* Backend */}
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>IPAM Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <TechItem label="Framework" value="FastAPI (Python)" />
                <TechItem label="Auth" value="JWT (python-jose)" />
                <TechItem label="API" value="REST with OpenAPI docs" />
              </CardContent>
              <CardFooter>
                <div className="w-full pt-2">
                  <Badge variant="secondary" className="text-xs">
                    Powered by Second Brain Database
                  </Badge>
                </div>
              </CardFooter>
            </Card>

            {/* Platform */}
            <Card className="border-2 border-primary flex flex-col h-full">
              <CardHeader>
                <CardTitle>Core Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <TechItem label="Platform" value="Second Brain Database" />
                <TechItem label="Database" value="MongoDB (Motor async)" />
                <TechItem label="Cache" value="Redis" />
              </CardContent>
              <CardFooter>
                <div className="w-full pt-2">
                  <Badge variant="default" className="text-xs">
                    Enterprise-Grade Infrastructure
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Self-Hosting Requirements */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Self-Hosting Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium mb-1">Platforms</div>
                  <div className="text-sm text-muted-foreground">
                    Docker Compose, Kubernetes, Bare Metal
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Database</div>
                  <div className="text-sm text-muted-foreground">MongoDB 5.0+, Redis 6.0+</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Hardware (Min)</div>
                  <div className="text-sm text-muted-foreground">2 vCPU, 4 GB RAM</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Dependencies</div>
                  <div className="text-sm text-muted-foreground">
                    Second Brain Database instance
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TechItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
