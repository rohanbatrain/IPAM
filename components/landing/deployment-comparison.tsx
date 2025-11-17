'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Server, Check, ArrowRight, Download, Sparkles } from 'lucide-react';
import { SmartLink } from '@/components/ui/smart-link';
import { trackCTAClick } from '@/lib/utils/analytics';

export function DeploymentComparison() {
  return (
    <section id="deployment-comparison" className="py-20 bg-gradient-to-b from-background to-muted/30" aria-labelledby="deployment-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-2 h-3 w-3" />
              Flexible Deployment
            </Badge>
            <h2 id="deployment-heading" className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Choose Your Deployment Model
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start instantly on our managed cloud or deploy on your own infrastructure.
              <br className="hidden sm:block" />
              Both options are <span className="font-semibold text-foreground">completely free</span>.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Cloud Deployment */}
            <Card className="relative overflow-hidden border-2 border-primary shadow-lg hover:shadow-xl transition-all group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-4 top-4">
                <Badge className="shadow-md">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Recommended
                </Badge>
              </div>
              <CardHeader className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                  <Cloud className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">IPAM Cloud</CardTitle>
                <CardDescription className="text-base">Managed SaaS • Zero Setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 relative">
                <ComparisonRow
                  label="Best For"
                  value="Teams wanting instant access with our pre-configured global network"
                  highlight
                />
                <ComparisonRow
                  label="Database"
                  value="Pre-seeded with 256 countries, continents, and regions ready to use"
                />
                <ComparisonRow 
                  label="Setup Time" 
                  value="Instant. Sign up and start managing IPs in seconds" 
                />
                <ComparisonRow 
                  label="Infrastructure" 
                  value="Fully managed by us. No servers, no maintenance" 
                />
                <ComparisonRow 
                  label="Updates" 
                  value="Automatic updates with zero downtime" 
                />
                <ComparisonRow 
                  label="Cost" 
                  value="100% Free forever. No credit card required" 
                  highlight
                />
                
                <div className="pt-4">
                  <Button asChild className="w-full h-11 text-base shadow-md" size="lg">
                    <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'deployment-section')}>
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start Free on Cloud
                    </SmartLink>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Self-Hosted Deployment */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                  <Server className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">IPAM Self-Hosted</CardTitle>
                <CardDescription className="text-base">On-Premise • Full Control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 relative">
                <ComparisonRow
                  label="Best For"
                  value="Enterprises requiring complete data control or air-gapped environments"
                  highlight
                />
                <ComparisonRow
                  label="Database"
                  value="Start with empty database or import your existing IP data"
                />
                <ComparisonRow 
                  label="Setup Time" 
                  value="15-30 minutes via Docker, Kubernetes, or binary" 
                />
                <ComparisonRow 
                  label="Infrastructure" 
                  value="Deploy on your servers, VPC, or completely offline" 
                />
                <ComparisonRow 
                  label="Updates" 
                  value="You control when and how to update" 
                />
                <ComparisonRow 
                  label="Cost" 
                  value="100% Free forever. Open source" 
                  highlight
                />
                
                <div className="pt-4">
                  <Button asChild variant="outline" className="w-full h-11 text-base border-2" size="lg">
                      <a
                        href="https://github.com/rohanbatrain/ipam"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackCTAClick('self-hosted', 'deployment-section')}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Self-Hosted
                      </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Both deployment options use the same powerful Second Brain Database backend.
              <br className="hidden sm:block" />
              Switch between Cloud and Self-Hosted anytime with data export/import.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ComparisonRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ComparisonRow({ label, value, highlight }: ComparisonRowProps) {
  return (
    <div className="flex gap-3">
      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5 ${
        highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <Check className="h-3 w-3" />
      </div>
      <div>
        <div className={`font-medium text-sm mb-1 ${highlight ? 'text-foreground' : ''}`}>
          {label}
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">{value}</div>
      </div>
    </div>
  );
}
