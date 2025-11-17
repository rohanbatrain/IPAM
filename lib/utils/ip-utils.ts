// IP address utility functions

export function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

export function isValidCIDR(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  
  const [ip, prefix] = parts;
  const prefixNum = parseInt(prefix, 10);
  
  return isValidIPv4(ip) && prefixNum >= 0 && prefixNum <= 32;
}

export function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  // Use >>> 0 to convert to unsigned 32-bit integer
  return ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

export function numberToIP(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function calculateIPRange(cidr: string): { start: string; end: string; total: number } {
  const [ip, prefix] = cidr.split('/');
  const prefixNum = parseInt(prefix, 10);
  const ipNum = ipToNumber(ip);
  const mask = ~((1 << (32 - prefixNum)) - 1);
  const networkNum = ipNum & mask;
  const broadcastNum = networkNum | ~mask;
  
  return {
    start: numberToIP(networkNum >>> 0),
    end: numberToIP(broadcastNum >>> 0),
    total: broadcastNum - networkNum + 1,
  };
}

export function validateIP(ip: string): boolean {
  const ipRegex = /^10\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipRegex);

  if (!match) return false;

  const [, x, y, z] = match;
  const xNum = parseInt(x, 10);
  const yNum = parseInt(y, 10);
  const zNum = parseInt(z, 10);

  return (
    xNum >= 0 &&
    xNum <= 255 &&
    yNum >= 0 &&
    yNum <= 255 &&
    zNum >= 1 &&
    zNum <= 254 // Exclude network (0) and broadcast (255)
  );
}

export function parseCIDR(cidr: string): { network: string; prefix: number } | null {
  const cidrRegex = /^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/;
  const match = cidr.match(cidrRegex);

  if (!match) return null;

  const [, network, prefix] = match;
  return { network, prefix: parseInt(prefix, 10) };
}

export function calculateUtilization(allocated: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((allocated / total) * 100 * 100) / 100; // Round to 2 decimals
}

export function formatIPRange(xStart: number, xEnd: number): string {
  return `10.${xStart}.0.0 - 10.${xEnd}.255.255`;
}

export function getNextAvailableIP(existingIPs: string[], regionCIDR: string): string | null {
  const parsed = parseCIDR(regionCIDR);
  if (!parsed) return null;

  const [, , x, y] = parsed.network.match(/^10\.(\d+)\.(\d+)\.(\d+)$/) || [];
  if (!x || !y) return null;

  // Get all allocated Z values
  const allocatedZ = new Set(
    existingIPs
      .map((ip) => {
        const match = ip.match(/^10\.\d+\.\d+\.(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((z): z is number => z !== null)
  );

  // Find first available Z (1-254)
  for (let z = 1; z <= 254; z++) {
    if (!allocatedZ.has(z)) {
      return `10.${x}.${y}.${z}`;
    }
  }

  return null; // Region is full
}

export function isIPInRange(ip: string, cidr: string): boolean {
  const parsed = parseCIDR(cidr);
  if (!parsed) return false;

  const ipMatch = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  const networkMatch = parsed.network.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);

  if (!ipMatch || !networkMatch) return false;

  const [, ipA, ipB, ipC, ipD] = ipMatch.map(Number);
  const [, netA, netB, netC] = networkMatch.map(Number);

  if (parsed.prefix === 24) {
    // For /24, check if first 3 octets match and last octet is in range 0-255
    return ipA === netA && ipB === netB && ipC === netC && ipD >= 0 && ipD <= 255;
  } else if (parsed.prefix === 16) {
    // For /16, check if first 2 octets match
    return ipA === netA && ipB === netB && ipC >= 0 && ipC <= 255 && ipD >= 0 && ipD <= 255;
  }

  return false;
}
