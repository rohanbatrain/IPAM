'use client';

import { Badge } from '@/components/ui/badge';
import {
  Network,
  BarChart3,
  Map,
  Search,
  Zap,
  Shield,
  Users,
  Lock,
  Keyboard,
  Smartphone,
  Eye,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme-store';

export function FeaturesGrid() {
  const { darkMode } = useThemeStore();

  const features = [
    {
      icon: Network,
      title: 'Hierarchical IP Management',
      description:
        'Global → Continent → Country → Region → Host structure with automatic allocation and conflict prevention.',
      gradient: darkMode ? 'from-purple-600 to-pink-600' : 'from-purple-500 to-pink-500',
      featured: true,
    },
    {
      icon: BarChart3,
      title: 'Real-Time Monitoring',
      description:
        'Live capacity tracking, color-coded health indicators, and automatic 30-second polling.',
      gradient: darkMode ? 'from-blue-600 to-cyan-600' : 'from-blue-500 to-cyan-500',
      featured: true,
    },
    {
      icon: Map,
      title: 'Geographic Visualization',
      description:
        'Interactive OpenStreetMap integration with country markers and utilization layers.',
      gradient: darkMode ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500',
      featured: true,
    },
    {
      icon: Search,
      title: 'Advanced Search & Filtering',
      description:
        'IP address search, hostname matching, saved filters, and multi-criteria combination.',
      gradient: darkMode ? 'from-orange-600 to-red-600' : 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: 'Batch Operations',
      description:
        'Create up to 100 hosts at once with auto-numbering, bulk tagging, and CSV import/export.',
      gradient: darkMode ? 'from-yellow-600 to-orange-600' : 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Audit Trail',
      description:
        'Complete operation logging with before/after tracking, user attribution, and compliance reporting.',
      gradient: darkMode ? 'from-indigo-600 to-purple-600' : 'from-indigo-500 to-purple-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Resource comments with Markdown support, user avatars, and edit management.',
      gradient: darkMode ? 'from-pink-600 to-rose-600' : 'from-pink-500 to-rose-500',
    },
    {
      icon: Lock,
      title: 'JWT Authentication',
      description:
        'Secure 15-minute access tokens, 7-day refresh tokens, and role-based access control.',
      gradient: darkMode ? 'from-red-600 to-pink-600' : 'from-red-500 to-pink-500',
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description:
        'Command palette (Cmd+K), global shortcuts, and table navigation for power users.',
      gradient: darkMode ? 'from-cyan-600 to-blue-600' : 'from-cyan-500 to-blue-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description:
        'Responsive design, touch controls, pull-to-refresh, and progressive web app support.',
      gradient: darkMode ? 'from-violet-600 to-purple-600' : 'from-violet-500 to-purple-500',
    },
    {
      icon: Eye,
      title: 'WCAG 2.1 AA Compliant',
      description:
        'Screen reader support, keyboard navigation, high contrast, and reduced motion options.',
      gradient: darkMode ? 'from-teal-600 to-green-600' : 'from-teal-500 to-green-500',
    },
    {
      icon: Gauge,
      title: 'Performance Optimized',
      description:
        'Code splitting, lazy loading, service worker caching, and 99.9% uptime target.',
      gradient: darkMode ? 'from-emerald-600 to-teal-600' : 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="features-section" className="py-20 bg-muted/20" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-2 h-3 w-3" />
              Comprehensive Features
            </Badge>
            <h2 id="features-heading" className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Everything You Need for
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Enterprise IP Management
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on the powerful Second Brain Database platform with features designed for modern network teams
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              All features included in both Cloud and Self-Hosted deployments
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`} />
                <span className="text-muted-foreground">No Feature Limits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
                <span className="text-muted-foreground">No User Limits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`} />
                <span className="text-muted-foreground">100% Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  featured?: boolean;
}

function FeatureCard({ icon: Icon, title, description, gradient, featured }: FeatureCardProps) {
  return (
    <div className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-xl hover:scale-[1.02]">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="default" className="shadow-md text-xs">
            Popular
          </Badge>
        </div>
      )}
      
      <div className="relative">
        {/* Icon with gradient background */}
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Content */}
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
