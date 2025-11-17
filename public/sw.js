/**
 * Service Worker for IPAM Frontend
 * 
 * Implements caching strategies for optimal performance:
 * - Cache-first for static assets
 * - Network-first for API calls
 * - Stale-while-revalidate for pages
 */

const CACHE_VERSION = 'ipam-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('ipam-') && name !== STATIC_CACHE && name !== API_CACHE && name !== PAGE_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Take control immediately
  return self.clients.claim();
});

// Fetch event: Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // API requests: Network-first with cache fallback
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ipam/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }
  
  // Static assets: Cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }
  
  // Pages: Stale-while-revalidate
  event.respondWith(staleWhileRevalidateStrategy(request, PAGE_CACHE));
});

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }
  
  console.log('[SW] Cache miss, fetching:', request.url);
  const response = await fetch(request);
  
  // Cache successful responses
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

/**
 * Network-first strategy
 * Try network first, fall back to cache
 */
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    console.log('[SW] Fetching from network:', request.url);
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page or error
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Stale-while-revalidate strategy
 * Return cached response immediately, update cache in background
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached version immediately if available
  if (cached) {
    console.log('[SW] Returning cached, updating in background:', request.url);
    return cached;
  }
  
  // Otherwise wait for network
  console.log('[SW] No cache, waiting for network:', request.url);
  return fetchPromise;
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.webp',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
  ];
  
  return staticExtensions.some((ext) => pathname.endsWith(ext));
}

// Message event: Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});
