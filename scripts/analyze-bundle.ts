#!/usr/bin/env bun

/**
 * Bundle Analysis Script
 * 
 * Analyzes Next.js build output and reports on bundle sizes,
 * identifying opportunities for optimization.
 * 
 * Usage: bun run scripts/analyze-bundle.ts
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';

interface ChunkInfo {
  name: string;
  size: number;
  gzipSize?: number;
  path: string;
}

const BUNDLE_SIZE_LIMITS = {
  initial: 200 * 1024, // 200KB
  route: 150 * 1024,   // 150KB per route
  chunk: 100 * 1024,   // 100KB per chunk
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const getChunkType = (filename: string): string => {
  if (filename.includes('framework')) return 'Framework';
  if (filename.includes('main')) return 'Main';
  if (filename.includes('recharts')) return 'Charts';
  if (filename.includes('leaflet')) return 'Maps';
  if (filename.includes('radix')) return 'UI Components';
  if (filename.includes('vendor')) return 'Vendor';
  if (filename.match(/^\d+-/)) return 'Route';
  return 'Other';
};

async function analyzeDirectory(dir: string): Promise<ChunkInfo[]> {
  const chunks: ChunkInfo[] = [];
  
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        const subChunks = await analyzeDirectory(filePath);
        chunks.push(...subChunks);
      } else if (file.endsWith('.js')) {
        chunks.push({
          name: file,
          size: stats.size,
          path: filePath,
        });
      }
    }
  } catch (error) {
    // Directory might not exist yet
  }
  
  return chunks;
}

async function analyzeBuild() {
  console.log('🔍 Analyzing Next.js build output...\n');
  
  const buildDir = join(process.cwd(), '.next');
  const chunksDir = join(buildDir, 'static', 'chunks');
  
  // Analyze chunks
  const chunks = await analyzeDirectory(chunksDir);
  
  if (chunks.length === 0) {
    console.log('❌ No build output found. Run `bun run build` first.\n');
    process.exit(1);
  }
  
  // Sort by size (largest first)
  chunks.sort((a, b) => b.size - a.size);
  
  // Calculate totals
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  
  // Group by type
  const byType = chunks.reduce((acc, chunk) => {
    const type = getChunkType(chunk.name);
    if (!acc[type]) acc[type] = [];
    acc[type].push(chunk);
    return acc;
  }, {} as Record<string, ChunkInfo[]>);
  
  // Print summary
  console.log('📊 Bundle Size Summary\n');
  console.log('═'.repeat(80));
  console.log(`Total Bundle Size: ${formatBytes(totalSize)}`);
  console.log(`Total Chunks: ${chunks.length}`);
  console.log('═'.repeat(80));
  console.log('');
  
  // Print by type
  console.log('📦 Chunks by Type\n');
  for (const [type, typeChunks] of Object.entries(byType)) {
    const typeSize = typeChunks.reduce((sum, c) => sum + c.size, 0);
    console.log(`${type}:`);
    console.log(`  Total: ${formatBytes(typeSize)} (${typeChunks.length} chunks)`);
    
    // Show top 3 largest in this category
    const top3 = typeChunks.slice(0, 3);
    for (const chunk of top3) {
      const status = chunk.size > BUNDLE_SIZE_LIMITS.chunk ? '⚠️ ' : '✅ ';
      console.log(`  ${status}${chunk.name}: ${formatBytes(chunk.size)}`);
    }
    console.log('');
  }
  
  // Check against limits
  console.log('🎯 Bundle Size Targets\n');
  
  const mainChunk = chunks.find(c => c.name.includes('main'));
  if (mainChunk) {
    const status = mainChunk.size <= BUNDLE_SIZE_LIMITS.initial ? '✅' : '❌';
    console.log(`${status} Initial Bundle: ${formatBytes(mainChunk.size)} / ${formatBytes(BUNDLE_SIZE_LIMITS.initial)}`);
  }
  
  const largeChunks = chunks.filter(c => c.size > BUNDLE_SIZE_LIMITS.chunk);
  if (largeChunks.length > 0) {
    console.log(`\n⚠️  ${largeChunks.length} chunks exceed ${formatBytes(BUNDLE_SIZE_LIMITS.chunk)}:`);
    for (const chunk of largeChunks.slice(0, 5)) {
      console.log(`   - ${chunk.name}: ${formatBytes(chunk.size)}`);
    }
  }
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations\n');
  
  const recommendations: string[] = [];
  
  if (mainChunk && mainChunk.size > BUNDLE_SIZE_LIMITS.initial) {
    recommendations.push('• Initial bundle exceeds 200KB - consider more aggressive code splitting');
  }
  
  const chartsChunks = chunks.filter(c => c.name.includes('recharts'));
  if (chartsChunks.length > 0 && chartsChunks[0].size > 150 * 1024) {
    recommendations.push('• Charts bundle is large - ensure dynamic imports are used');
  }
  
  const mapsChunks = chunks.filter(c => c.name.includes('leaflet'));
  if (mapsChunks.length > 0 && mapsChunks[0].size > 200 * 1024) {
    recommendations.push('• Maps bundle is large - ensure dynamic imports are used');
  }
  
  const duplicates = findPotentialDuplicates(chunks);
  if (duplicates.length > 0) {
    recommendations.push(`• Found ${duplicates.length} potential duplicate dependencies`);
  }
  
  if (recommendations.length === 0) {
    console.log('✅ No major optimization opportunities found!');
  } else {
    recommendations.forEach(rec => console.log(rec));
  }
  
  console.log('\n' + '═'.repeat(80));
  
  // Exit with error if bundle is too large
  if (mainChunk && mainChunk.size > BUNDLE_SIZE_LIMITS.initial * 1.2) {
    console.log('\n❌ Bundle size exceeds acceptable limits!\n');
    process.exit(1);
  }
  
  console.log('\n✅ Bundle analysis complete!\n');
}

function findPotentialDuplicates(chunks: ChunkInfo[]): string[] {
  // Simple heuristic: look for similar chunk names
  const names = chunks.map(c => c.name);
  const duplicates: string[] = [];
  
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const similarity = calculateSimilarity(names[i], names[j]);
      if (similarity > 0.8) {
        duplicates.push(`${names[i]} ↔ ${names[j]}`);
      }
    }
  }
  
  return duplicates;
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Run analysis
analyzeBuild().catch(console.error);
