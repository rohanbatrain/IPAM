'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download, MessageCircle, Check, Sparkles } from 'lucide-react';
import { SmartLink } from '@/components/ui/smart-link';
import { trackCTAClick } from '@/lib/utils/analytics';
import { useThemeStore } from '@/lib/store/theme-store';

export function CTASection() {
  const { darkMode } = useThemeStore();
  return (
    <section id="cta-section" className="py-20 relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        darkMode 
          ? 'from-blue-900/20 via-slate-800/20 to-blue-900/20' 
          : 'from-blue-600/10 via-cyan-200/10 to-blue-50/10'
      }`} />
      <div className="absolute inset-0 bg-grid-white/5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-5xl">
          <div className="relative rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-background via-background to-muted/30 p-8 md:p-16 backdrop-blur-sm shadow-2xl">
            {/* Decorative elements */}
            <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${
              darkMode ? 'from-blue-800 to-slate-700' : 'from-blue-600 to-cyan-600'
            } opacity-20 blur-2xl`} />
            <div className={`absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br ${
              darkMode ? 'from-blue-800 to-slate-700' : 'from-blue-600 to-cyan-600'
            } opacity-20 blur-2xl`} />
            
            <div className="relative text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">Join Thousands of Network Teams</span>
              </div>

              {/* Heading */}
                <h2 id="cta-heading" className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                Ready to Transform Your
                <br className="hidden sm:block" />
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode 
                    ? 'from-blue-400 via-cyan-400 to-indigo-400' 
                    : 'from-blue-600 via-cyan-600 to-indigo-600'
                }`}>
                  IP Management?
                </span>
              </h2>
              
              {/* Subheading */}
              <p className="mb-10 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Start managing your IP space today with enterprise features.
                <br className="hidden sm:block" />
                <span className="font-semibold text-foreground">Completely free forever.</span>
              </p>

              {/* CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-10">
                <Button asChild size="lg" className="text-base h-14 px-8 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'cta-section')}>
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Start Free on Cloud
                  </SmartLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base h-14 px-8 border-2">
                  <a href="https://github.com/rohanbatrain/ipam" target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick('self-hosted', 'cta-section')}>
                    <Download className="mr-2 h-5 w-5" />
                    Self-Host for Free
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-base h-14 px-8">
                  <a href="https://github.com/rohanbatrain/ipam" target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick('community', 'cta-section')}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Join Community
                  </a>
                </Button>
              </div>

              {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    darkMode ? 'bg-green-500/30' : 'bg-green-500/20'
                  }`}>
                    <Check className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    darkMode ? 'bg-blue-500/30' : 'bg-blue-500/20'
                  }`}>
                    <Check className={`h-3 w-3 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                  <span>Setup in 60 seconds</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    darkMode ? 'bg-blue-500/30' : 'bg-blue-500/20'
                  }`}>
                    <Check className={`h-3 w-3 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
