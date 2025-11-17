'use client';

import Link from 'next/link';
import { SmartLink } from '@/components/ui/smart-link';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { trackCTAClick } from '@/lib/utils/analytics';
import { useThemeStore } from '@/lib/store/theme-store';

export function LandingFooter() {
  const { darkMode } = useThemeStore();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30 py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white font-bold text-lg transition-transform group-hover:scale-105 ${
                  darkMode ? 'from-purple-700 to-slate-600' : 'from-purple-600 to-pink-600'
                }`}>
                  IP
                </div>
                <span className="text-xl font-bold">IPAM</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Intelligent IP Address Management for modern networks. Built on the powerful Second Brain Database platform.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/yourusername/ipam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/ipam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/ipam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <nav aria-labelledby="footer-product">
              <div id="footer-product" className="mb-4 text-sm font-semibold text-foreground">
                Product
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('deployment')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Deployment
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('tech-stack')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tech Stack
                  </button>
                </li>
                <li>
                  <SmartLink href="/login" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => trackCTAClick('cloud', 'footer')}>
                    Get Started
                  </SmartLink>
                </li>
              </ul>
            </nav>

            {/* Resources */}
            <nav aria-labelledby="footer-resources">
              <div id="footer-resources" className="mb-4 text-sm font-semibold text-foreground">
                Resources
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="https://github.com/rohanbatrain/ipam" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Download
                  </a>
                </li>
              </ul>
            </nav>

            {/* Company */}
            <nav aria-labelledby="footer-company">
              <div id="footer-company" className="mb-4 text-sm font-semibold text-foreground">
                Company
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom section */}
          <div className="mt-16 pt-8 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} IPAM.
                <span className="inline-flex items-center gap-2 ml-2">
                  <span className="whitespace-nowrap">Built with</span>
                  <Heart aria-hidden className={`h-4 w-4 fill-current ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className="whitespace-nowrap">using</span>
                  <a
                    href="https://secondbraindatabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Second Brain Database
                  </a>
                </span>
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="/security" className="hover:text-foreground transition-colors">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
