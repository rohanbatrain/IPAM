import { describe, it, expect } from 'vitest';
import {
  isValidIPv4,
  isValidCIDR,
  calculateIPRange,
  ipToNumber,
  numberToIP,
  isIPInRange,
} from '@/lib/utils/ip-utils';

describe('IP Utils', () => {
  describe('isValidIPv4', () => {
    it('should validate correct IPv4 addresses', () => {
      expect(isValidIPv4('192.168.1.1')).toBe(true);
      expect(isValidIPv4('10.0.0.0')).toBe(true);
      expect(isValidIPv4('255.255.255.255')).toBe(true);
      expect(isValidIPv4('0.0.0.0')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(isValidIPv4('256.1.1.1')).toBe(false);
      expect(isValidIPv4('192.168.1')).toBe(false);
      expect(isValidIPv4('192.168.1.1.1')).toBe(false);
      expect(isValidIPv4('abc.def.ghi.jkl')).toBe(false);
      expect(isValidIPv4('')).toBe(false);
    });
  });

  describe('isValidCIDR', () => {
    it('should validate correct CIDR notation', () => {
      expect(isValidCIDR('10.0.0.0/8')).toBe(true);
      expect(isValidCIDR('192.168.1.0/24')).toBe(true);
      expect(isValidCIDR('172.16.0.0/16')).toBe(true);
    });

    it('should reject invalid CIDR notation', () => {
      expect(isValidCIDR('10.0.0.0/33')).toBe(false);
      expect(isValidCIDR('10.0.0.0/-1')).toBe(false);
      expect(isValidCIDR('10.0.0.0')).toBe(false);
      expect(isValidCIDR('invalid/24')).toBe(false);
    });
  });

  describe('ipToNumber', () => {
    it('should convert IP to number correctly', () => {
      expect(ipToNumber('0.0.0.0')).toBe(0);
      expect(ipToNumber('0.0.0.1')).toBe(1);
      expect(ipToNumber('192.168.1.1')).toBe(3232235777);
      expect(ipToNumber('255.255.255.255')).toBe(4294967295);
    });
  });

  describe('numberToIP', () => {
    it('should convert number to IP correctly', () => {
      expect(numberToIP(0)).toBe('0.0.0.0');
      expect(numberToIP(1)).toBe('0.0.0.1');
      expect(numberToIP(3232235777)).toBe('192.168.1.1');
      expect(numberToIP(4294967295)).toBe('255.255.255.255');
    });
  });

  describe('calculateIPRange', () => {
    it('should calculate IP range for /24 network', () => {
      const range = calculateIPRange('10.1.2.0/24');
      expect(range.start).toBe('10.1.2.0');
      expect(range.end).toBe('10.1.2.255');
      expect(range.total).toBe(256);
    });

    it('should calculate IP range for /16 network', () => {
      const range = calculateIPRange('10.1.0.0/16');
      expect(range.start).toBe('10.1.0.0');
      expect(range.end).toBe('10.1.255.255');
      expect(range.total).toBe(65536);
    });
  });

  describe('isIPInRange', () => {
    it('should check if IP is in range', () => {
      expect(isIPInRange('10.1.2.100', '10.1.2.0/24')).toBe(true);
      expect(isIPInRange('10.1.2.0', '10.1.2.0/24')).toBe(true);
      expect(isIPInRange('10.1.2.255', '10.1.2.0/24')).toBe(true);
      expect(isIPInRange('10.1.3.0', '10.1.2.0/24')).toBe(false);
      expect(isIPInRange('10.2.2.100', '10.1.2.0/24')).toBe(false);
    });
  });
});
