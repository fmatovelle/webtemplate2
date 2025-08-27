// Enhanced Service Worker for Premium Web Template
const CACHE_NAME = 'web-template-v2.0.0';
const STATIC_CACHE_NAME = 'static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'dynamic-v2.0.0';

// Resources to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'
];

// Resources that should be cached dynamically
const DYNAMIC_ASSETS_PATTERNS = [
  /^https:\/\/images\.unsplash\.com\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Serve cached content with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isDynamicAsset(request.url)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else if (request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(networkFirstWithCacheFallback(request));
  }
});

// Strategy: Cache First (for static assets)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First Strategy failed:', error);
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Strategy: Stale While Revalidate (for images and fonts)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Strategy: Network First (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('API Unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Strategy: Network First with Cache Fallback (for pages)
async function networkFirstWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }
    
    throw error;
  }
}

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.ico') ||
         url.includes('.svg');
}

function isDynamicAsset(url) {
  return DYNAMIC_ASSETS_PATTERNS.some(pattern => pattern.test(url));
}

// Background Sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData) {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        await clearStoredFormData();
        await notifyFormSubmissionSuccess();
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getStoredFormData() {
  // Implementation depends on your storage mechanism
  // This is a placeholder
  return null;
}

async function clearStoredFormData() {
  // Clear stored form data after successful submission
}

async function notifyFormSubmissionSuccess() {
  // Notify the main thread of successful submission
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'FORM_SUBMITTED',
      success: true
    });
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/favicon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Web Template', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_URLS':
      cacheUrls(data.urls);
      break;
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  await cache.addAll(urls);
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync content in the background
    const response = await fetch('/api/content-updates');
    if (response.ok) {
      const updates = await response.json();
      // Process updates
      console.log('Content synced:', updates);
    }
  } catch (error) {
    console.error('Content sync failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  event.preventDefault();
});

// Performance monitoring
function logPerformance(label, startTime) {
  const duration = performance.now() - startTime;
  console.log(`SW Performance - ${label}: ${duration.toFixed(2)}ms`);
}

console.log('Service Worker: Script loaded and ready');