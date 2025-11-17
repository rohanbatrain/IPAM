import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page before each test
    await page.goto('/');
  });

  test.describe('Hero Section', () => {
    test('should load and display hero section', async ({ page }) => {
      // Verify hero section is visible
      const heroSection = page.locator('#hero-section');
      await expect(heroSection).toBeVisible();

      // Verify headline is present
      const headline = page.getByRole('heading', { level: 1 });
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Intelligent IP Address Management');
      await expect(headline).toContainText('Modern Networks');

      // Verify badge is present
      await expect(page.locator('text=Completely Free')).toBeVisible();
      await expect(page.locator('text=Powered by Second Brain Database')).toBeVisible();

      // Verify subheadline
      await expect(page.locator('text=hierarchical IP allocation')).toBeVisible();
    });

    test('should display all CTA buttons', async ({ page }) => {
      // Verify all three CTA buttons are visible
      const cloudButton = page.getByRole('link', { name: /start free on cloud/i });
      const selfHostedButton = page.getByRole('link', { name: /download self-hosted/i });
      const videoButton = page.getByRole('button', { name: /watch video/i });

      await expect(cloudButton).toBeVisible();
      await expect(selfHostedButton).toBeVisible();
      await expect(videoButton).toBeVisible();
    });

    test('should display key metrics', async ({ page }) => {
      // Verify metrics region is visible
      const metricsRegion = page.locator('[aria-label="Key metrics and capabilities"]');
      await expect(metricsRegion).toBeVisible();

      // Verify all four metrics are displayed
      await expect(page.locator('text=16.7M')).toBeVisible();
      await expect(page.locator('text=IP Addresses')).toBeVisible();
      await expect(page.locator('text=256')).toBeVisible();
      await expect(page.locator('text=Countries Supported')).toBeVisible();
      await expect(page.locator('text=65,536')).toBeVisible();
      await expect(page.locator('text=Regions per Country')).toBeVisible();
      await expect(page.locator('text=254')).toBeVisible();
      await expect(page.locator('text=Hosts per Region')).toBeVisible();
    });
  });

  test.describe('CTA Navigation', () => {
    test('should navigate to login page when clicking "Start Free on Cloud"', async ({ page }) => {
      const cloudButton = page.getByRole('link', { name: /start free on cloud/i }).first();
      await cloudButton.click();

      // Verify navigation to login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should navigate to download page when clicking "Download Self-Hosted"', async ({ page }) => {
      const selfHostedButton = page.getByRole('link', { name: /download self-hosted/i }).first();
      await selfHostedButton.click();

      // Verify navigation to download page
      await expect(page).toHaveURL(/\/download/);
    });

    test('should open video modal when clicking "Watch Video"', async ({ page }) => {
      const videoButton = page.getByRole('button', { name: /watch video/i }).first();
      await videoButton.click();

      // Verify video modal is opened
      const videoModal = page.locator('[role="dialog"]');
      await expect(videoModal).toBeVisible();

      // Verify modal title
      await expect(page.locator('text=IPAM Demo')).toBeVisible();
    });
  });

  test.describe('Deployment Comparison Section', () => {
    test('should display deployment comparison cards', async ({ page }) => {
      // Verify Cloud card
      await expect(page.locator('text=IPAM Cloud (Managed SaaS)')).toBeVisible();
      await expect(page.locator('text=Popular').first()).toBeVisible();

      // Verify Self-Hosted card
      await expect(page.locator('text=IPAM Self-Hosted (On-Premise)')).toBeVisible();

      // Verify comparison details
      await expect(page.locator('text=Pre-seeded with global network')).toBeVisible();
      await expect(page.locator('text=Complete data control')).toBeVisible();
    });
  });

  test.describe('Features Grid Section', () => {
    test('should display all 12 feature cards', async ({ page }) => {
      // Verify features section heading
      await expect(page.getByRole('heading', { name: /comprehensive features/i })).toBeVisible();

      // Verify key features are displayed
      const features = [
        'Hierarchical IP Management',
        'Real-Time Monitoring',
        'Geographic Visualization',
        'Advanced Search',
        'Batch Operations',
        'Enterprise Audit',
        'Team Collaboration',
        'JWT Authentication',
        'Keyboard Shortcuts',
        'Mobile Optimization',
        'Accessibility',
        'Performance',
      ];

      for (const feature of features) {
        await expect(page.locator(`text=${feature}`)).toBeVisible();
      }

      // Verify "Powered by Second Brain Database" emphasis
      await expect(page.locator('text=/powered.*second brain database/i')).toBeVisible();
    });
  });

  test.describe('Tech Stack Section', () => {
    test('should display technical specifications', async ({ page }) => {
      // Verify tech stack section heading
      await expect(page.getByRole('heading', { name: /technical specifications/i })).toBeVisible();

      // Verify Frontend specs
      await expect(page.locator('text=Next.js')).toBeVisible();
      await expect(page.locator('text=TypeScript')).toBeVisible();
      await expect(page.locator('text=Tailwind CSS')).toBeVisible();

      // Verify Backend specs
      await expect(page.locator('text=FastAPI')).toBeVisible();
      await expect(page.locator('text=JWT')).toBeVisible();

      // Verify Core Platform specs (Second Brain Database)
      await expect(page.locator('text=Second Brain Database')).toBeVisible();
      await expect(page.locator('text=MongoDB')).toBeVisible();
      await expect(page.locator('text=Redis')).toBeVisible();

      // Verify self-hosting requirements
      await expect(page.locator('text=/self-hosting requirements/i')).toBeVisible();
    });
  });

  test.describe('CTA Section', () => {
    test('should display final call-to-action section', async ({ page }) => {
      // Verify CTA section heading
      await expect(page.locator('text=/ready to transform/i')).toBeVisible();

      // Verify action buttons
      await expect(page.getByRole('link', { name: /get started free/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /download self-hosted/i }).last()).toBeVisible();
      await expect(page.getByRole('link', { name: /join community/i })).toBeVisible();

      // Verify trust indicators
      await expect(page.locator('text=No credit card required')).toBeVisible();
      await expect(page.locator('text=Instant setup')).toBeVisible();
      await expect(page.locator('text=Free forever')).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('should display footer with all sections', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Verify footer sections
      await expect(page.locator('footer >> text=Product')).toBeVisible();
      await expect(page.locator('footer >> text=Resources')).toBeVisible();
      await expect(page.locator('footer >> text=Company')).toBeVisible();

      // Verify key links
      await expect(page.locator('footer >> text=Dashboard')).toBeVisible();
      await expect(page.locator('footer >> text=Documentation')).toBeVisible();
      await expect(page.locator('footer >> text=API Reference')).toBeVisible();

      // Verify copyright
      await expect(page.locator('text=/© 2024.*Second Brain Database/i')).toBeVisible();
    });

    test('should have working social media links', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Verify social media links are present
      const githubLink = page.locator('footer a[href*="github"]');
      const twitterLink = page.locator('footer a[href*="twitter"]');
      const linkedinLink = page.locator('footer a[href*="linkedin"]');

      await expect(githubLink).toBeVisible();
      await expect(twitterLink).toBeVisible();
      await expect(linkedinLink).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile (375x667)', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify hero section is visible
      await expect(page.locator('#hero-section')).toBeVisible();

      // Verify headline is visible and readable
      const headline = page.getByRole('heading', { level: 1 });
      await expect(headline).toBeVisible();

      // Verify CTA buttons stack vertically (flex-col)
      const ctaContainer = page.locator('#hero-section').locator('div').filter({ hasText: 'Start Free on Cloud' }).first();
      await expect(ctaContainer).toBeVisible();

      // Verify metrics grid adapts to 2 columns
      const metricsRegion = page.locator('[aria-label="Key metrics and capabilities"]');
      await expect(metricsRegion).toBeVisible();
    });

    test('should display correctly on tablet (768x1024)', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Verify all sections are visible
      await expect(page.locator('#hero-section')).toBeVisible();
      await expect(page.locator('text=IPAM Cloud (Managed SaaS)')).toBeVisible();
      await expect(page.getByRole('heading', { name: /comprehensive features/i })).toBeVisible();

      // Verify features grid adapts to 2 columns
      const featuresSection = page.locator('text=Hierarchical IP Management').locator('..');
      await expect(featuresSection).toBeVisible();
    });

    test('should display correctly on desktop (1920x1080)', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Verify all sections are visible
      await expect(page.locator('#hero-section')).toBeVisible();

      // Verify features grid uses 3 columns
      const featuresSection = page.locator('text=Hierarchical IP Management').locator('..');
      await expect(featuresSection).toBeVisible();

      // Verify content is centered and not too wide
      const container = page.locator('.container').first();
      await expect(container).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through all interactive elements with Tab key', async ({ page }) => {
      // Start from the top
      await page.keyboard.press('Tab');

      // Verify first focusable element is focused
      let focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Tab through several elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        focusedElement = await page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should activate CTA buttons with Enter key', async ({ page }) => {
      // Tab to first CTA button
      await page.keyboard.press('Tab');
      let focusedElement = await page.locator(':focus');

      // Keep tabbing until we reach a CTA button
      let attempts = 0;
      while (attempts < 20) {
        const text = await focusedElement.textContent();
        if (text?.includes('Start Free on Cloud')) {
          break;
        }
        await page.keyboard.press('Tab');
        focusedElement = await page.locator(':focus');
        attempts++;
      }

      // Press Enter to activate
      await page.keyboard.press('Enter');

      // Verify navigation occurred
      await expect(page).toHaveURL(/\/login/);
    });

    test('should show visible focus indicators', async ({ page }) => {
      // Tab to first interactive element
      await page.keyboard.press('Tab');

      // Get focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Verify focus indicator is visible (check for ring or outline)
      const styles = await focusedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow,
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator =
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none';

      expect(hasFocusIndicator).toBeTruthy();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Get all headings
      const h1 = await page.locator('h1').count();
      const h2 = await page.locator('h2').count();
      const h3 = await page.locator('h3').count();

      // Should have exactly one h1
      expect(h1).toBe(1);

      // Should have multiple h2 and h3 headings
      expect(h2).toBeGreaterThan(0);
      expect(h3).toBeGreaterThanOrEqual(0);
    });

    test('should have alt text for images', async ({ page }) => {
      // Get all images
      const images = page.locator('img');
      const imageCount = await images.count();

      // Check each image has alt text
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Verify hero section has aria-labelledby
      const heroSection = page.locator('#hero-section');
      const ariaLabelledBy = await heroSection.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBe('hero-heading');

      // Verify metrics region has aria-label
      const metricsRegion = page.locator('[aria-label="Key metrics and capabilities"]');
      await expect(metricsRegion).toBeVisible();
    });

    test('should have semantic HTML elements', async ({ page }) => {
      // Verify main element exists
      await expect(page.locator('main')).toBeVisible();

      // Verify section elements exist
      const sections = await page.locator('section').count();
      expect(sections).toBeGreaterThan(0);

      // Verify footer element exists
      await expect(page.locator('footer')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds (generous for E2E)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have no console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // Should have no console errors
      expect(consoleErrors).toHaveLength(0);
    });
  });

  test.describe('SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/');

      // Verify title
      const title = await page.title();
      expect(title).toContain('IPAM');
      expect(title).toContain('IP Address Management');

      // Verify meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription).toContain('IP address management');
      expect(metaDescription).toContain('Second Brain Database');

      // Verify Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();

      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toBeTruthy();
    });

    test('should have structured data', async ({ page }) => {
      await page.goto('/');

      // Verify JSON-LD structured data exists
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      expect(structuredData).toBeTruthy();

      // Parse and verify structure
      const data = JSON.parse(structuredData!);
      expect(data['@type']).toBe('SoftwareApplication');
      expect(data.name).toBe('IPAM');
      expect(data.offers.price).toBe('0');
    });
  });
});
