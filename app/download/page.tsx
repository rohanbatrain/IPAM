import { Metadata } from 'next';
import Link from 'next/link';
import { SmartLink } from '@/components/ui/smart-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Server, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download IPAM Self-Hosted | Free IP Address Management',
  description: 'Download and deploy IPAM on your own infrastructure. Docker, Kubernetes, or binary installation. Complete data control and air-gapped capability.',
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Server className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Download IPAM Self-Hosted</h1>
            <p className="text-lg text-muted-foreground">
              Deploy on your own infrastructure with complete control
            </p>
          </div>

          {/* System Requirements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
              <CardDescription>Minimum specifications for running IPAM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <RequirementItem label="Platforms" value="Linux, macOS, Windows" />
                <RequirementItem label="CPU" value="2 cores minimum" />
                <RequirementItem label="RAM" value="4GB minimum" />
                <RequirementItem label="Storage" value="10GB available" />
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Dependencies</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Backend:</strong> Second Brain Database (MongoDB + Redis)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Frontend:</strong> Bun runtime (or Node.js 18+)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Optional:</strong> Docker & Docker Compose for containerized deployment</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Installation Methods */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold">Installation Methods</h2>

            {/* Docker */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Docker Compose (Recommended)</CardTitle>
                    <CardDescription>Easiest way to get started</CardDescription>
                  </div>
                  <Badge>Recommended</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
                  <div># Clone the repository</div>
                  <div>git clone https://github.com/rohanbatrain/ipam.git</div>
                  <div>cd ipam</div>
                  <div className="mt-2"># Start all services</div>
                  <div>docker-compose up -d</div>
                  <div className="mt-2"># Access at http://localhost:3000</div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <a href="https://github.com/rohanbatrain/ipam" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Kubernetes */}
            <Card>
              <CardHeader>
                <CardTitle>Kubernetes</CardTitle>
                <CardDescription>For production deployments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
                  <div># Apply Kubernetes manifests</div>
                  <div>kubectl apply -f k8s/</div>
                  <div className="mt-2"># Check deployment status</div>
                  <div>kubectl get pods -n ipam</div>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href="https://docs.secondbraindatabase.com/ipam/kubernetes" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Kubernetes Guide
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Manual */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Installation</CardTitle>
                <CardDescription>For custom setups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">1</span>
                    <span>Install and configure Second Brain Database backend</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">2</span>
                    <span>Install Bun runtime: <code className="text-xs bg-muted px-1 py-0.5 rounded">curl -fsSL https://bun.sh/install | bash</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">3</span>
                    <span>Clone and build IPAM frontend</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">4</span>
                    <span>Configure environment variables and start the application</span>
                  </li>
                </ol>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href="https://docs.secondbraindatabase.com/ipam/manual-install" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Full Installation Guide
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Support */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>We're here to support your deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Button asChild variant="outline" className="w-full">
                  <a href="https://docs.secondbraindatabase.com/ipam" target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://github.com/rohanbatrain/ipam/issues" target="_blank" rel="noopener noreferrer">
                    GitHub Issues
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://discord.gg/secondbrain" target="_blank" rel="noopener noreferrer">
                    Discord Community
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Prefer a managed solution?</p>
            <Button asChild size="lg">
              <SmartLink href="/login">
                Start Free on Cloud
              </SmartLink>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function RequirementItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-muted-foreground">{value}</div>
    </div>
  );
}
