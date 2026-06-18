const CACHE_NAME = 'office-camera-v1';
// 캐싱할 파일 목록 (GitHub Pages 저장소 이름에 맞게 경로가 지정됩니다)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/685/685655.png',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// 1. 서비스 워커 설치 및 파일 캐싱 (최초 앱 실행 시)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 파일 캐싱 중...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. 오래된 캐시 삭제 및 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] 오래된 캐시 삭제 중...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 네트워크 연결이 없어도 캐시된 파일로 앱 실행 (오프라인 지원)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 캐시된 파일이 있으면 반환하고, 없으면 네트워크에서 가져옴
      return cachedResponse || fetch(event.request);
    })
  );
});