#!/usr/bin/env bun

/**
 * Import Optimization Checker
 * 
 * Scans codebase for suboptimal imports that could increase bundle size.
 * 
 * Usage: bun run scripts/check-imports.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface ImportIssue {
  file: string;
  line: number;
  issue: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
}

const PROBLEMATIC_PATTERNS = [
  {
    pattern: /import\s+.*\s+from\s+['"]lodash['"]/,
    issue: 'Importing entire lodash library',
    suggestion: 'Use lodash-es or import specific functions: import { debounce } from "lodash-es"',
    severity: 'error' as const,
  },
  {
    pattern: /import\s+.*\s+from\s+['"]moment['"]/,
    issue: 'Moment.js is large (~70KB)',
    suggestion: 'Use date-fns instead (already in dependencies)',
    severity: 'warning' as const,
  },
  {
    pattern: /import\s+\*\s+as\s+\w+\s+from\s+['"]recharts['"]/,
    issue: 'Importing entire recharts library',
    suggestion: 'Import specific components: import { LineChart, Line } from "recharts"',
    severity: 'warning' as const,
  },
  {
    pattern: /import\s+\*\s+as\s+\w+\s+from\s+['"]lucide-react['"]/,
    issue: 'Importing all lucide icons',
    suggestion: 'Import specific icons: import { Home, Settings } from "lucide-react"',
    severity: 'warning' as const,
  },
  {
    pattern: /import\s+.*\s+from\s+['"]@radix-ui\/react-icons['"]/,
    issue: 'Using Radix icons when lucide-react is preferred',
    suggestion: 'Use lucide-react for consistency',
    severity: 'info' as const,
  },
];

async function scanDirectory(dir: string, baseDir: string = dir): Promise<ImportIssue[]> {
  const issues: ImportIssue[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
          continue;
        }
        const subIssues = await scanDirectory(fullPath, baseDir);
        issues.push(...subIssues);
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        const fileIssues = await scanFile(fullPath, baseDir);
        issues.push(...fileIssues);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return issues;
}

async function scanFile(filePath: string, baseDir: string): Promise<ImportIssue[]> {
  const issues: ImportIssue[] = [];
  
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const pattern of PROBLEMATIC_PATTERNS) {
        if (pattern.pattern.test(line)) {
          issues.push({
            file: filePath.replace(baseDir + '/', ''),
            line: i + 1,
            issue: pattern.issue,
            suggestion: pattern.suggestion,
            severity: pattern.severity,
          });
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return issues;
}

async function checkImports() {
  console.log('🔍 Scanning for import optimization opportunities...\n');
  
  const projectDir = process.cwd();
  const issues = await scanDirectory(projectDir);
  
  if (issues.length === 0) {
    console.log('✅ No import issues found!\n');
    return;
  }
  
  // Group by severity
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');
  
  console.log('📊 Import Analysis Results\n');
  console.log('═'.repeat(80));
  console.log(`Total Issues: ${issues.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Info: ${info.length}`);
  console.log('═'.repeat(80));
  console.log('');
  
  // Print errors
  if (errors.length > 0) {
    console.log('❌ ERRORS (Must Fix)\n');
    for (const issue of errors) {
      console.log(`${issue.file}:${issue.line}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Fix: ${issue.suggestion}`);
      console.log('');
    }
  }
  
  // Print warnings
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (Should Fix)\n');
    for (const issue of warnings) {
      console.log(`${issue.file}:${issue.line}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Fix: ${issue.suggestion}`);
      console.log('');
    }
  }
  
  // Print info
  if (info.length > 0) {
    console.log('ℹ️  INFO (Consider Fixing)\n');
    for (const issue of info) {
      console.log(`${issue.file}:${issue.line}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Fix: ${issue.suggestion}`);
      console.log('');
    }
  }
  
  console.log('═'.repeat(80));
  
  // Exit with error if there are errors
  if (errors.length > 0) {
    console.log('\n❌ Found critical import issues that will increase bundle size!\n');
    process.exit(1);
  }
  
  console.log('\n✅ Import check complete!\n');
}

// Run check
checkImports().catch(console.error);
