'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Globe, Network, Shield, Zap } from 'lucide-react';
import { SmartLink } from '@/components/ui/smart-link';
import dynamic from 'next/dynamic';
import { trackCTAClick } from '@/lib/utils/analytics';
import { useThemeStore } from '@/lib/store/theme-store';

const World = dynamic(() => import('@/components/ui/globe').then((m) => m.World), {
  ssr: false,
});

export function HeroSection() {
  const { darkMode } = useThemeStore();

  // Actual IPAM capacity statistics based on configured country mappings
  // 17 countries (excluding Reserved) across 6 continents
  // Total capacity: 65,536 regions (including 12,288 reserved for future use)
  // Usable capacity: 53,248 regions × 254 hosts = 13,524,992 IPs
  const STATIC_COUNTRIES = '17'; // Actual configured countries in IPAM
  const STATIC_IP_ADDRESSES = '13.5M'; // 13,524,992 usable IPs (excluding reserved space)
  const STATIC_REGIONS = '53,248'; // Usable regions (excluding 12,288 reserved)
  const STATIC_HOSTS_PER_REGION = '254'; // /24 network capacity

  // Globe configuration for visual effect - theme-aware
  const globeConfig = {
    pointSize: 4,
    globeColor: darkMode ? '#0f172a' : '#f8fafc', // slate-900 for dark, slate-50 for light
    showAtmosphere: true,
    atmosphereColor: darkMode ? '#1e40af' : '#60a5fa', // blue-800 for dark, blue-400 for light
    atmosphereAltitude: 0.1,
    emissive: darkMode ? '#0f172a' : '#e2e8f0', // slate-900 for dark, slate-200 for light
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.6)', // white with opacity for dark, dark with opacity for light
    ambientLight: darkMode ? '#1e40af' : '#3b82f6', // blue-800 for dark, blue-500 for light
    directionalLeftLight: darkMode ? '#f1f5f9' : '#ffffff', // slate-100 for dark, white for light
    directionalTopLight: darkMode ? '#e2e8f0' : '#ffffff', // slate-200 for dark, white for light
    pointLight: darkMode ? '#60a5fa' : '#3b82f6', // blue-400 for dark, blue-500 for light
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  // Sample network arcs showing IPAM global coverage - theme-aware colors
  const networkArcs = [
    { order: 1, startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: darkMode ? '#60a5fa' : '#3b82f6' }, // SF to London - lighter blue for dark
    { order: 1, startLat: 40.7128, startLng: -74.0060, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: darkMode ? '#93c5fd' : '#60a5fa' }, // NY to Paris - even lighter for dark
    { order: 2, startLat: 35.6762, startLng: 139.6503, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: darkMode ? '#22d3ee' : '#06b6d4' }, // Tokyo to Singapore - cyan
    { order: 2, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: darkMode ? '#60a5fa' : '#3b82f6' }, // Sydney to Hong Kong
    { order: 3, startLat: 52.5200, startLng: 13.4050, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.2, color: darkMode ? '#93c5fd' : '#60a5fa' }, // Berlin to Moscow
    { order: 3, startLat: -23.5505, startLng: -46.6333, endLat: 40.4168, endLng: -3.7038, arcAlt: 0.4, color: darkMode ? '#22d3ee' : '#06b6d4' }, // São Paulo to Madrid
    { order: 4, startLat: 19.4326, startLng: -99.1332, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.3, color: darkMode ? '#60a5fa' : '#3b82f6' }, // Mexico City to Buenos Aires
    { order: 4, startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: darkMode ? '#93c5fd' : '#60a5fa' }, // Delhi to Dubai
  ];


  return (
    <>
      {/* Video demo removed from hero for now */}

      <section
        id="hero-section"
        className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32"
        aria-labelledby="hero-heading"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className={`absolute left-1/4 top-1/4 blur-3xl opacity-20 ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
            <div className={`h-[600px] w-[600px] rounded-full bg-gradient-to-r ${
              darkMode 
                ? 'from-blue-900 via-slate-800 to-indigo-900' 
                : 'from-blue-500 via-cyan-500 to-indigo-500'
            }`} />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className={`rounded-2xl border-2 p-12 ${
              darkMode
                ? 'bg-transparent border-neutral-800'
                : 'bg-gradient-to-br from-blue-50 via-blue-100 to-white border-blue-200/60'
            }`}>
              {/* Two-column layout: Text on left, Globe on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                  {/* Badge */}
                  <div className="flex justify-start">
                    <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm backdrop-blur-sm ${
                      darkMode 
                        ? 'border-blue-500/50 bg-blue-500/20' 
                        : 'border-blue-500/30 bg-blue-500/10'
                    }`}>
                      <span className={`mr-2 h-2 w-2 rounded-full animate-pulse ${
                        darkMode ? 'bg-emerald-400' : 'bg-emerald-500'
                      }`} aria-hidden="true" />
                      <span className="font-medium">Completely Free</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Powered by Second Brain Database</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h1
                    id="hero-heading"
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  >
                    Intelligent IP Address
                    <br />
                    Management for{' '}
                    <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                      darkMode 
                        ? 'from-blue-400 via-cyan-400 to-indigo-400' 
                        : 'from-blue-500 via-cyan-500 to-indigo-500'
                    }`}>
                      Modern Networks
                    </span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg text-muted-foreground sm:text-xl">
                    Hierarchical IP allocation, real-time monitoring, and enterprise-grade audit trails.
                    <br />
                    <span className="font-semibold text-foreground">Completely free</span> and powered by Second Brain Database.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className={`text-base h-12 px-8 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        darkMode
                          ? 'shadow-blue-500/40 hover:shadow-blue-500/60 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                          : 'shadow-blue-600/40 hover:shadow-blue-600/60 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                      }`}
                    >
                      <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'hero')}>
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Start Free on Cloud
                      </SmartLink>
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className={`text-base h-12 px-8 border-2 ${
                        darkMode
                          ? 'border-white/30 text-white bg-transparent hover:bg-white/5'
                          : 'border-blue-200 text-slate-900 bg-white/90 hover:bg-white shadow-sm'
                      }`}
                    >
                      <a
                        href="https://github.com/rohanbatrain/ipam"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackCTAClick('self-hosted', 'hero')}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Self-Host for Free
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Right Column - Interactive Globe */}
                <div className="relative h-[500px] lg:h-[600px]">
                  <div className="absolute inset-0">
                    <World data={networkArcs} globeConfig={globeConfig} />
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards - Full Width Below */}
              <div
                className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mt-8"
                role="region"
                aria-label="Key metrics and capabilities"
              >
                <MetricCard
                  value={STATIC_IP_ADDRESSES}
                  label="IP Addresses"
                  icon={<Network className="h-5 w-5" />}
                  gradient={darkMode ? "from-blue-600 to-cyan-600" : "from-blue-500 to-cyan-500"}
                />
                <MetricCard
                  value={STATIC_COUNTRIES}
                  label="Countries"
                  icon={<Globe className="h-5 w-5" />}
                  gradient={darkMode ? "from-cyan-600 to-teal-600" : "from-cyan-500 to-teal-500"}
                />
                <MetricCard
                  value={STATIC_REGIONS}
                  label="Regions"
                  icon={<Zap className="h-5 w-5" />}
                  gradient={darkMode ? "from-indigo-600 to-blue-600" : "from-indigo-500 to-blue-500"}
                />
                <MetricCard
                  value={STATIC_HOSTS_PER_REGION}
                  label="Hosts/Region"
                  icon={<Shield className="h-5 w-5" />}
                  gradient={darkMode ? "from-emerald-600 to-green-600" : "from-emerald-500 to-green-500"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface MetricCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

function MetricCard({ value, label, icon, gradient }: MetricCardProps) {
  return (
    <div className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:scale-105">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className={`mb-3 inline-flex p-2 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
