'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { SmartLink } from '@/components/ui/smart-link';
import { cn } from '@/lib/utils/cn';
import { trackCTAClick } from '@/lib/utils/analytics';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg transition-transform group-hover:scale-105">
              IP
            </div>
            <span className="text-xl font-bold">IPAM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('deployment')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Deployment
            </button>
            <button
              onClick={() => scrollToSection('tech-stack')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tech Stack
            </button>
            <Link
              href="https://github.com/rohanbatrain/ipam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <DarkModeToggle />
            <Button asChild variant="ghost" size="sm">
              <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'header')}>
                Sign In
              </SmartLink>
            </Button>
            <Button asChild size="sm">
              <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'header')}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Get Started
              </SmartLink>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('deployment')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Deployment
              </button>
              <button
                onClick={() => scrollToSection('tech-stack')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Tech Stack
              </button>
              <Link
                href="https://github.com/rohanbatrain/ipam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'header-mobile')}>
                    Sign In
                  </SmartLink>
                </Button>
                <Button asChild className="w-full">
                  <SmartLink href="/login" onClick={() => trackCTAClick('cloud', 'header-mobile')}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Get Started
                  </SmartLink>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
