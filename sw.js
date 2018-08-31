//define the assest need to cache
const staticAssest = [
    './',
    './style.css',
    './main.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssest);
});

//Get called when serviceworker intercepts any service request from application net 
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin == location.url) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req))
    }    
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');
    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch(error){
        return await cache.match(req);
    }
}