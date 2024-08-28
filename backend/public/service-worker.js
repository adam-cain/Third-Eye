self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/service-worker.js'
                // Add other resources that you need to cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'START_WEBSOCKET') {
        startWebSocketConnection();
    }
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-audio') {
        event.waitUntil(handleAudioSync());
    }
});

let ws;
function startWebSocketConnection() {
    const isLocalhost = self.location.hostname === 'localhost';
    const wsUrl = isLocalhost ? 'ws://localhost:4000' : 'wss://squid-app-hyn6l.ondigitalocean.app/';

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'AUDIO_MESSAGE',
                    text: data.text,
                    audio: data.audio,
                    mute: data.mute
                });
            });
        });

        // Register sync
        self.registration.sync.register('sync-audio').catch(err => {
            console.error('Sync registration failed:', err);
        });
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed, retrying...');
        setTimeout(startWebSocketConnection, 5000); // Retry connection
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

async function handleAudioSync() {
    // Fetch audio data (this example assumes you store data somewhere)
    const cache = await caches.open('v1');
    const cachedResponse = await cache.match('/audio');
    const audioData = await cachedResponse.json();

    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'AUDIO_MESSAGE',
            text: audioData.text,
            audio: audioData.audio,
            mute: false
        });
    });
}
