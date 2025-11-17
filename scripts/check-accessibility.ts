#!/usr/bin/env bun

/**
 * Accessibility Checker Script
 * 
 * This script performs automated accessibility checks on the IPAM Frontend.
 * It checks for common accessibility issues and generates a report.
 * 
 * Usage: bun run scripts/check-accessibility.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface AccessibilityIssue {
  file: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
}

const issues: AccessibilityIssue[] = [];

// Rules to check
const rules = {
  // Check for images without alt text
  imgWithoutAlt: {
    pattern: /<img(?![^>]*alt=)/g,
    severity: 'error' as const,
    message: 'Image missing alt attribute',
  },
  
  // Check for buttons without accessible names
  buttonWithoutLabel: {
    pattern: /<button(?![^>]*aria-label)(?![^>]*aria-labelledby)>[\s]*<[^>]*\/>/g,
    severity: 'error' as const,
    message: 'Button with icon only needs aria-label',
  },
  
  // Check for links without accessible names
  linkWithoutText: {
    pattern: /<a[^>]*>[\s]*<\/a>/g,
    severity: 'error' as const,
    message: 'Link without text content',
  },
  
  // Check for form inputs without labels
  inputWithoutLabel: {
    pattern: /<input(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*id=)/g,
    severity: 'warning' as const,
    message: 'Input should have associated label or aria-label',
  },
  
  // Check for missing lang attribute
  htmlWithoutLang: {
    pattern: /<html(?![^>]*lang=)/g,
    severity: 'error' as const,
    message: 'HTML element missing lang attribute',
  },
  
  // Check for onclick without keyboard equivalent
  onClickWithoutKeyboard: {
    pattern: /<div[^>]*onClick(?![^>]*onKeyDown)(?![^>]*onKeyPress)/g,
    severity: 'warning' as const,
    message: 'onClick handler without keyboard equivalent',
  },
  
  // Check for missing heading hierarchy
  skippedHeading: {
    pattern: /<h[1-6]/g,
    severity: 'warning' as const,
    message: 'Check heading hierarchy (h1 → h2 → h3)',
  },
};

async function checkFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const [ruleName, rule] of Object.entries(rules)) {
      const matches = content.matchAll(rule.pattern);
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        issues.push({
          file: filePath,
          line: lineNumber,
          severity: rule.severity,
          rule: ruleName,
          message: rule.message,
        });
      }
    }
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error);
  }
}

async function checkDirectory(dir: string): Promise<void> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (entry.name === 'node_modules' || entry.name === '.next') {
          continue;
        }
        await checkDirectory(fullPath);
      } else if (entry.isFile()) {
        // Check TypeScript and TSX files
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          await checkFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error checking directory ${dir}:`, error);
  }
}

function generateReport(): void {
  console.log('\n=== Accessibility Check Report ===\n');

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  console.log(`Total Issues: ${issues.length}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);
  console.log(`  Info: ${infoCount}\n`);

  if (issues.length === 0) {
    console.log('✅ No accessibility issues found!\n');
    return;
  }

  // Group by severity
  const byFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {} as Record<string, AccessibilityIssue[]>);

  for (const [file, fileIssues] of Object.entries(byFile)) {
    console.log(`\n📄 ${file}`);
    
    for (const issue of fileIssues) {
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${icon} Line ${issue.line}: ${issue.message} (${issue.rule})`);
    }
  }

  console.log('\n');
}

async function main() {
  console.log('🔍 Checking accessibility...\n');

  const componentsDir = join(process.cwd(), 'components');
  const appDir = join(process.cwd(), 'app');

  await checkDirectory(componentsDir);
  await checkDirectory(appDir);

  generateReport();

  // Exit with error code if there are errors
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
