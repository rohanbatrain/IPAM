import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  formatBytes,
  formatPercentage,
  formatNumber,
} from '@/lib/utils/format';

describe('Format Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Jan');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15T10:30:00Z');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain('minute');
    });

    it('should format hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toContain('hour');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly (backend returns 0-100)', () => {
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(75.5)).toBe('75.5%');
      expect(formatPercentage(100)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
    });

    it('should handle decimal places', () => {
      expect(formatPercentage(12.345, 2)).toBe('12.35%');
      expect(formatPercentage(12.345, 0)).toBe('12%');
    });

    it('should handle null and undefined values', () => {
      expect(formatPercentage(null)).toBe('0%');
      expect(formatPercentage(undefined)).toBe('0%');
    });

    it('should handle NaN and Infinity', () => {
      expect(formatPercentage(NaN)).toBe('0%');
      expect(formatPercentage(Infinity)).toBe('0%');
      expect(formatPercentage(-Infinity)).toBe('0%');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(123456789)).toBe('123,456,789');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(999)).toBe('999');
    });
  });
});
